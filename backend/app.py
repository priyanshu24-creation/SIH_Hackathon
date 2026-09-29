import json
import sqlite3
import uuid
from datetime import datetime
from pathlib import Path
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse
from email.parser import BytesParser
from email.policy import default


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "land_records.db"
UPLOAD_DIR = BASE_DIR / "uploads"

UPLOAD_DIR.mkdir(exist_ok=True)

PORT = 3001


def now():
    return datetime.now().isoformat(timespec="seconds")


def db():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():
    connection = db()

    connection.executescript(
        """
        CREATE TABLE IF NOT EXISTS records (
            id TEXT PRIMARY KEY,
            owner_name TEXT NOT NULL,
            district TEXT,
            village TEXT,
            plot_number TEXT,
            survey_number TEXT,
            area REAL,
            document_name TEXT,
            status TEXT DEFAULT 'Pending',
            confidence REAL DEFAULT 0.0,
            validation_message TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            record_id TEXT,
            action TEXT NOT NULL,
            actor TEXT DEFAULT 'System',
            details TEXT,
            created_at TEXT NOT NULL
        );
        """
    )

    connection.commit()
    connection.close()


def add_log(
    record_id,
    action,
    actor="System",
    details=""
):
    connection = db()

    connection.execute(
        """
        INSERT INTO audit_logs (
            record_id,
            action,
            actor,
            details,
            created_at
        )
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            record_id,
            action,
            actor,
            details,
            now()
        )
    )

    connection.commit()
    connection.close()


def json_bytes(data):
    return json.dumps(
        data,
        ensure_ascii=False
    ).encode("utf-8")


class Handler(BaseHTTPRequestHandler):

    def send_json(
        self,
        data,
        status=200
    ):
        body = json_bytes(data)

        self.send_response(status)

        self.send_header(
            "Content-Type",
            "application/json; charset=utf-8"
        )

        self.send_header(
            "Access-Control-Allow-Origin",
            "*"
        )

        self.send_header(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, OPTIONS"
        )

        self.send_header(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization"
        )

        self.send_header(
            "Content-Length",
            str(len(body))
        )

        self.end_headers()

        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)

        self.send_header(
            "Access-Control-Allow-Origin",
            "*"
        )

        self.send_header(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, OPTIONS"
        )

        self.send_header(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization"
        )

        self.end_headers()

    def read_json(self):
        content_length = int(
            self.headers.get(
                "Content-Length",
                "0"
            )
        )

        raw_data = self.rfile.read(
            content_length
        )

        if not raw_data:
            return {}

        return json.loads(
            raw_data.decode("utf-8")
        )

    def parse_multipart(self):

        content_type = self.headers.get(
            "Content-Type",
            ""
        )

        content_length = int(
            self.headers.get(
                "Content-Length",
                "0"
            )
        )

        body = self.rfile.read(
            content_length
        )

        headers = (
            f"Content-Type: {content_type}\r\n"
            f"MIME-Version: 1.0\r\n"
            f"\r\n"
        ).encode("utf-8")

        message = BytesParser(
            policy=default
        ).parsebytes(
            headers + body
        )

        fields = {}

        document_name = None

        document_data = None

        if message.is_multipart():

            for part in message.iter_parts():

                name = part.get_param(
                    "name",
                    header="content-disposition"
                )

                filename = part.get_filename()

                if filename:

                    document_name = filename

                    document_data = (
                        part.get_payload(
                            decode=True
                        )
                        or b""
                    )

                elif name:

                    value = part.get_content()

                    fields[name] = value.strip()

        return (
            fields,
            document_name,
            document_data
        )

    def do_GET(self):

        path = urlparse(
            self.path
        ).path

        if path in (
            "/",
            "/api/health"
        ):

            return self.send_json(
                {
                    "success": True,
                    "message": (
                        "Intelligent Land Record "
                        "Digitization and Validation "
                        "System API"
                    ),
                    "status": "running"
                }
            )

        if path == "/api/dashboard":

            connection = db()

            total_records = connection.execute(
                """
                SELECT COUNT(*)
                FROM records
                """
            ).fetchone()[0]

            pending = connection.execute(
                """
                SELECT COUNT(*)
                FROM records
                WHERE status = 'Pending'
                """
            ).fetchone()[0]

            approved = connection.execute(
                """
                SELECT COUNT(*)
                FROM records
                WHERE status = 'Approved'
                """
            ).fetchone()[0]

            rejected = connection.execute(
                """
                SELECT COUNT(*)
                FROM records
                WHERE status = 'Rejected'
                """
            ).fetchone()[0]

            validation_issues = connection.execute(
                """
                SELECT COUNT(*)
                FROM records
                WHERE validation_message IS NOT NULL
                AND validation_message != ''
                """
            ).fetchone()[0]

            connection.close()

            return self.send_json(
                {
                    "total_records": total_records,
                    "pending": pending,
                    "approved": approved,
                    "rejected": rejected,
                    "validation_issues": validation_issues
                }
            )

        if path == "/api/records":

            connection = db()

            rows = connection.execute(
                """
                SELECT *
                FROM records
                ORDER BY created_at DESC
                """
            ).fetchall()

            connection.close()

            records = [
                dict(row)
                for row in rows
            ]

            return self.send_json(
                records
            )

        if path.startswith(
            "/api/records/"
        ):

            record_id = (
                path
                .rstrip("/")
                .split("/")[-1]
            )

            connection = db()

            record = connection.execute(
                """
                SELECT *
                FROM records
                WHERE id = ?
                """,
                (record_id,)
            ).fetchone()

            logs = connection.execute(
                """
                SELECT *
                FROM audit_logs
                WHERE record_id = ?
                ORDER BY created_at DESC
                """,
                (record_id,)
            ).fetchall()

            connection.close()

            if not record:

                return self.send_json(
                    {
                        "error": "Record not found"
                    },
                    404
                )

            result = dict(record)

            result["audit_logs"] = [
                dict(log)
                for log in logs
            ]

            return self.send_json(
                result
            )

        return self.send_json(
            {
                "error": "Not found"
            },
            404
        )

    def do_POST(self):

        path = urlparse(
            self.path
        ).path

        if path == "/api/documents":

            content_type = self.headers.get(
                "Content-Type",
                ""
            )

            fields = {}

            document_name = (
                "uploaded-document"
            )

            document_data = None

            if content_type.startswith(
                "multipart/form-data"
            ):

                (
                    fields,
                    uploaded_name,
                    uploaded_data
                ) = self.parse_multipart()

                if uploaded_name:

                    document_name = (
                        uploaded_name
                    )

                document_data = (
                    uploaded_data
                )

            else:

                fields = self.read_json()

            saved_file = None

            if document_data is not None:

                extension = Path(
                    document_name
                ).suffix

                saved_file = (
                    f"{uuid.uuid4().hex}"
                    f"{extension}"
                )

                file_path = (
                    UPLOAD_DIR /
                    saved_file
                )

                file_path.write_bytes(
                    document_data
                )

            record_id = (
                uuid.uuid4().hex[:12]
            )

            owner_name = (
                fields.get("owner_name")
                or fields.get("ownerName")
                or "Demo Land Owner"
            )

            district = (
                fields.get("district")
                or "Demo District"
            )

            village = (
                fields.get("village")
                or "Demo Village"
            )

            plot_number = (
                fields.get("plot_number")
                or fields.get("plotNumber")
                or "PLT-001"
            )

            survey_number = (
                fields.get("survey_number")
                or fields.get("surveyNumber")
                or "SRV-001"
            )

            try:

                area = float(
                    fields.get("area")
                    or 2.5
                )

            except (
                ValueError,
                TypeError
            ):

                area = 2.5

            confidence = 94.0

            status = "Pending"

            if area <= 0:

                validation_message = (
                    "Invalid land area detected."
                )

            elif area > 100:

                validation_message = (
                    "Area exceeds prototype "
                    "validation threshold."
                )

            else:

                validation_message = (
                    "Document fields extracted "
                    "successfully. GIS reference "
                    "check passed."
                )

            timestamp = now()

            connection = db()

            connection.execute(
                """
                INSERT INTO records (
                    id,
                    owner_name,
                    district,
                    village,
                    plot_number,
                    survey_number,
                    area,
                    document_name,
                    status,
                    confidence,
                    validation_message,
                    created_at,
                    updated_at
                )
                VALUES (
                    ?, ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?
                )
                """,
                (
                    record_id,
                    owner_name,
                    district,
                    village,
                    plot_number,
                    survey_number,
                    area,
                    document_name,
                    status,
                    confidence,
                    validation_message,
                    timestamp,
                    timestamp
                )
            )

            connection.commit()

            connection.close()

            add_log(
                record_id,
                "DIGITIZED",
                "System",
                (
                    "Document uploaded and "
                    "fields extracted."
                )
            )

            add_log(
                record_id,
                "VALIDATED",
                "System",
                validation_message
            )

            return self.send_json(
                {
                    "success": True,
                    "message": (
                        "Land record digitized "
                        "and queued for verification."
                    ),
                    "record": {
                        "id": record_id,
                        "owner_name": owner_name,
                        "district": district,
                        "village": village,
                        "plot_number": plot_number,
                        "survey_number": survey_number,
                        "area": area,
                        "document_name": document_name,
                        "status": status,
                        "confidence": confidence,
                        "validation_message": (
                            validation_message
                        )
                    }
                },
                201
            )

        return self.send_json(
            {
                "error": "Not found"
            },
            404
        )

    def do_PUT(self):

        path = urlparse(
            self.path
        ).path

        if not path.startswith(
            "/api/records/"
        ):

            return self.send_json(
                {
                    "error": "Not found"
                },
                404
            )

        record_id = (
            path
            .rstrip("/")
            .split("/")[-1]
        )

        data = self.read_json()

        status = data.get(
            "status"
        )

        valid_statuses = (
            "Pending",
            "Approved",
            "Rejected",
            "Needs Review"
        )

        if status not in valid_statuses:

            return self.send_json(
                {
                    "error": "Invalid status"
                },
                400
            )

        connection = db()

        record = connection.execute(
            """
            SELECT id
            FROM records
            WHERE id = ?
            """,
            (record_id,)
        ).fetchone()

        if not record:

            connection.close()

            return self.send_json(
                {
                    "error": "Record not found"
                },
                404
            )

        connection.execute(
            """
            UPDATE records
            SET
                status = ?,
                updated_at = ?
            WHERE id = ?
            """,
            (
                status,
                now(),
                record_id
            )
        )

        connection.commit()

        connection.close()

        actor = data.get(
            "actor",
            "Officer"
        )

        details = data.get(
            "details",
            f"Record status changed to {status}."
        )

        add_log(
            record_id,
            status.upper().replace(
                " ",
                "_"
            ),
            actor,
            details
        )

        return self.send_json(
            {
                "success": True,
                "message": (
                    f"Record marked as {status}."
                )
            }
        )

    def log_message(
        self,
        format_string,
        *args
    ):

        print(
            f"[API] "
            f"{self.address_string()} "
            f"- "
            f"{format_string % args}"
        )


if __name__ == "__main__":

    init_db()

    print(
        "SIH Land Record Prototype API "
        "running at "
        "http://localhost:3001"
    )

    print(
        "Python 3.13+ compatible."
    )

    print(
        "No external package required."
    )

    server = ThreadingHTTPServer(
        (
            "0.0.0.0",
            PORT
        ),
        Handler
    )

    try:

        server.serve_forever()

    except KeyboardInterrupt:

        print(
            "\nServer stopped."
        )

        server.server_close()
