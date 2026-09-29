import React, { createContext, useContext, useState } from 'react';
import { mockRecords } from '../data/mockRecords';
import confetti from 'canvas-confetti';

const RecordsContext = createContext();

export function RecordsProvider({ children }) {
  const [records, setRecords] = useState(mockRecords);
  const [selectedRecordId, setSelectedRecordId] = useState("LR-2026-001284");
  const [activeEvidenceField, setActiveEvidenceField] = useState("surveyNumber");
  const [toasts, setToasts] = useState([
    { id: 1, type: "info", title: "System Ready", message: "IND DIGI-LAND AI engine initialized with demo datasets." }
  ]);

  const addToast = ({ type = "info", title, message }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getRecord = (id) => {
    return records.find(r => r.id === id) || records[0];
  };

  const updateRecordField = (recordId, fieldKey, newValue) => {
    setRecords(prev => prev.map(rec => {
      if (rec.id === recordId) {
        return {
          ...rec,
          fields: {
            ...rec.fields,
            [fieldKey]: {
              ...rec.fields[fieldKey],
              value: newValue,
              confidence: 99, // user confirmed
              status: "high"
            }
          }
        };
      }
      return rec;
    }));
    addToast({
      type: "success",
      title: "Field Verified",
      message: `Updated ${fieldKey} to "${newValue}" and marked verified.`
    });
  };

  const approveRecord = (recordId, notes = "") => {
    setRecords(prev => prev.map(rec => {
      if (rec.id === recordId) {
        return {
          ...rec,
          status: "Validated",
          validationScore: 98,
          officerNotes: notes,
          verifiedAt: new Date().toLocaleTimeString()
        };
      }
      return rec;
    }));
    
    // Launch celebration confetti
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // safe fallback
    }

    addToast({
      type: "success",
      title: "Record Approved",
      message: `Record ${recordId} has been verified and registered to the GIS cadastral database.`
    });
  };

  const rejectRecord = (recordId, reason = "Unreadable document") => {
    setRecords(prev => prev.map(rec => {
      if (rec.id === recordId) {
        return {
          ...rec,
          status: "Rejected",
          rejectReason: reason,
          rejectedAt: new Date().toLocaleTimeString()
        };
      }
      return rec;
    }));
    addToast({
      type: "error",
      title: "Record Rejected",
      message: `Record ${recordId} marked rejected: ${reason}`
    });
  };

  const sendBackRecord = (recordId, instructions = "Re-scan required") => {
    setRecords(prev => prev.map(rec => {
      if (rec.id === recordId) {
        return {
          ...rec,
          status: "Needs Review",
          reviewInstructions: instructions
        };
      }
      return rec;
    }));
    addToast({
      type: "warning",
      title: "Sent Back",
      message: `Record ${recordId} sent back for re-scan: ${instructions}`
    });
  };

  const addNewUploadedRecord = (newRecord) => {
    setRecords(prev => [newRecord, ...prev]);
    setSelectedRecordId(newRecord.id);
    addToast({
      type: "success",
      title: "Digitization Complete",
      message: `Record ${newRecord.id} successfully processed and added to repository.`
    });
  };

  return (
    <RecordsContext.Provider value={{
      records,
      selectedRecordId,
      setSelectedRecordId,
      activeEvidenceField,
      setActiveEvidenceField,
      getRecord,
      updateRecordField,
      approveRecord,
      rejectRecord,
      sendBackRecord,
      addNewUploadedRecord,
      toasts,
      addToast,
      dismissToast
    }}>
      {children}
    </RecordsContext.Provider>
  );
}

export function useRecords() {
  const context = useContext(RecordsContext);
  if (!context) {
    throw new Error('useRecords must be used within a RecordsProvider');
  }
  return context;
}
