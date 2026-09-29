import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import UploadDocument from './pages/UploadDocument';
import Processing from './pages/Processing';
import RecordDetails from './pages/RecordDetails';
import Validation from './pages/Validation';
import VerificationQueue from './pages/VerificationQueue';
import VerificationWorkspace from './pages/VerificationWorkspace';
import GISMap from './pages/GISMap';
import CrossCheck from './pages/CrossCheck';
import Analytics from './pages/Analytics';
import AuditTrail from './pages/AuditTrail';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<Landing />} />

      {/* Authenticated / Enterprise Portal Layout */}
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="documents" element={<Documents />} />
        <Route path="documents/:id" element={<RecordDetails />} />
        <Route path="upload" element={<UploadDocument />} />
        <Route path="processing" element={<Processing />} />
        <Route path="records" element={<Documents />} />
        <Route path="records/:id" element={<RecordDetails />} />
        <Route path="validation" element={<Validation />} />
        <Route path="verification" element={<VerificationQueue />} />
        <Route path="verification/:id" element={<VerificationWorkspace />} />
        <Route path="gis" element={<GISMap />} />
        <Route path="gis/cross-check" element={<CrossCheck />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="audit" element={<AuditTrail />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
