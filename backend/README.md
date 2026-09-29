# SIH Intelligent Land Record Digitization and Validation System

## Python Prototype Backend

This prototype backend uses Python's built-in HTTP server and SQLite.
No Flask installation is required.

### Start backend

```bash
cd backend
python3 app.py
```

Backend:
http://localhost:3001

### API endpoints

- GET `/api/health`
- GET `/api/dashboard`
- GET `/api/records`
- GET `/api/records/:id`
- POST `/api/documents`
- PUT `/api/records/:id`

### Prototype workflow

Upload document -> simulated digitization/OCR -> validation -> verification queue -> officer approval/rejection -> audit log.

The OCR/GIS logic is intentionally simulated for the SIH prototype. Real OCR, document classification, GIS comparison and ML validation can be added later.
