import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Setup storage for uploaded documents
const uploadDir = process.env.VERCEL
  ? path.join('/tmp', 'sih-uploads')
  : path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Initialize SQLite database
const dbFile = process.env.VERCEL
  ? path.join('/tmp', 'sih-database.sqlite')
  : path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) console.error('Error opening database', err);
});

db.serialize(() => {
  // Create tables
  db.run(`CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    filename TEXT,
    file_path TEXT,
    doc_type TEXT,
    district TEXT,
    uploaded_at TEXT,
    status TEXT,
    confidence_score INTEGER,
    pages INTEGER,
    file_size TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS land_records (
    id TEXT PRIMARY KEY,
    document_id TEXT,
    khatian_no TEXT,
    plot_no TEXT,
    owner_name TEXT,
    village TEXT,
    district TEXT,
    area_document TEXT,
    area_gis TEXT,
    status TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS officers (
    id TEXT PRIMARY KEY,
    name TEXT,
    designation TEXT,
    email TEXT,
    phone TEXT,
    wing TEXT,
    status TEXT,
    records_processed INTEGER,
    last_active TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS audit_log (
    id TEXT PRIMARY KEY,
    record_id TEXT,
    action TEXT,
    description TEXT,
    actor TEXT,
    timestamp TEXT,
    type TEXT
  )`);

  // Simple seed check
  db.get("SELECT COUNT(*) as count FROM officers", (err, row) => {
    if (row.count === 0) {
      db.run("INSERT INTO officers (id, name, designation, email, wing, status, records_processed, last_active) VALUES ('o1', 'Sujan Thapa', 'Revenue Officer', 'sujan@lrc.wb.gov.in', 'Land Records', 'Active', 1420, '2 mins ago')");
    }
  });
  
  db.get("SELECT COUNT(*) as count FROM documents", (err, row) => {
    if (row.count === 0) {
      db.run("INSERT INTO documents (id, filename, file_path, doc_type, district, uploaded_at, status, confidence_score, pages, file_size) VALUES ('DOC-1024', 'Khatian_1456.pdf', '', 'Khatian', 'Darjeeling', '12 Sep 2026', 'Validated', 94, 1, '2.4 MB')");
    }
  });

  db.get("SELECT COUNT(*) as count FROM land_records", (err, row) => {
    if (row.count === 0) {
      db.run("INSERT INTO land_records (id, document_id, khatian_no, plot_no, owner_name, village, district, area_document, area_gis, status) VALUES ('1024', 'DOC-1024', '1456', '302', 'Binod Pradhan', 'Jorebunglow', 'Darjeeling', '0.82', '0.75', 'Needs Review')");
    }
  });
});

// API Routes
app.get('/api/dashboard', (req, res) => {
  db.all("SELECT status, count(*) as count FROM land_records GROUP BY status", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const stats = {
      processed: rows.reduce((acc, row) => acc + row.count, 0),
      validated: rows.find(r => r.status === 'Verified' || r.status === 'Validated')?.count || 0,
      pending: rows.find(r => r.status === 'Needs Review' || r.status === 'Pending')?.count || 0,
    };
    res.json(stats);
  });
});

app.get('/api/documents', (req, res) => {
  db.all("SELECT * FROM documents ORDER BY uploaded_at DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/documents', upload.single('file'), (req, res) => {
  const { doc_type, district } = req.body;
  const id = 'DOC-' + Math.floor(Math.random() * 10000);
  const uploaded_at = new Date().toISOString();
  
  db.run("INSERT INTO documents (id, filename, file_path, doc_type, district, uploaded_at, status, confidence_score, pages, file_size) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [id, req.file.originalname, req.file.path, doc_type, district, uploaded_at, 'Processing', 85, 1, (req.file.size/1024/1024).toFixed(2)+' MB'],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      
      // Auto create an audit log
      db.run("INSERT INTO audit_log (id, record_id, action, description, actor, timestamp, type) VALUES (?, ?, ?, ?, ?, ?, ?)",
        ['a'+Date.now(), id, 'Document Uploaded', 'Uploaded ' + req.file.originalname, 'System', uploaded_at, 'upload']);

      res.json({ id, message: 'Uploaded successfully' });
    }
  );
});

app.get('/api/records', (req, res) => {
  db.all("SELECT * FROM land_records", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/records/:id', (req, res) => {
  db.get("SELECT * FROM land_records WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

app.put('/api/records/:id/status', (req, res) => {
  const { status, actor } = req.body;
  const id = req.params.id;
  
  db.run("UPDATE land_records SET status = ? WHERE id = ?", [status, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    const timestamp = new Date().toISOString();
    db.run("INSERT INTO audit_log (id, record_id, action, description, actor, timestamp, type) VALUES (?, ?, ?, ?, ?, ?, ?)",
      ['a'+Date.now(), id, 'Status Updated', `Record status changed to ${status}`, actor || 'Sujan Thapa', timestamp, 'update']);
      
    res.json({ success: true });
  });
});

app.get('/api/officers', (req, res) => {
  db.all("SELECT * FROM officers", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/audit_log', (req, res) => {
  db.all("SELECT * FROM audit_log ORDER BY timestamp DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Serve the Vite production build from the same Express application.
const distDir = path.join(__dirname, 'dist');
app.use(express.static(distDir));

// React Router fallback. API routes above keep their normal JSON responses.
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    const indexFile = path.join(distDir, 'index.html');
    if (fs.existsSync(indexFile)) {
      return res.sendFile(indexFile);
    }
  }
  next();
});

// Vercel imports the Express app. Local development still uses port 3001.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

export default app;
