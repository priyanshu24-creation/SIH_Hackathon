import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { LandRecordProvider } from './context/LandRecordContext';
import { MainLayout } from './components/Layout/MainLayout';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Documents } from './pages/Documents';
import { UploadDocument } from './pages/UploadDocument';
import { ProcessingStatus } from './pages/ProcessingStatus';
import { DocumentDetails } from './pages/DocumentDetails';
import { ReviewQueue } from './pages/ReviewQueue';
import { Validation } from './pages/Validation';
import { GISMap } from './pages/GISMap';
import { StructuredRecord } from './pages/StructuredRecord';
import { AuditLogs } from './pages/AuditLogs';
import { LandRecords } from './pages/LandRecords';
import { Reports } from './pages/Reports';
import { Users } from './pages/Users';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <LandRecordProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="documents" element={<Documents />} />
              <Route path="upload" element={<UploadDocument />} />
              <Route path="processing" element={<ProcessingStatus />} />
              <Route path="documents/:id" element={<DocumentDetails />} />
              <Route path="review-queue" element={<ReviewQueue />} />
              <Route path="validation" element={<Validation />} />
              <Route path="gis-map" element={<GISMap />} />
              <Route path="structured-record" element={<StructuredRecord />} />
              <Route path="audit-logs" element={<AuditLogs />} />
              <Route path="land-records" element={<LandRecords />} />
              <Route path="reports" element={<Reports />} />
              <Route path="users" element={<Users />} />
              <Route path="settings" element={<Settings />} />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LandRecordProvider>
    </ToastProvider>
  );
};

export default App;
