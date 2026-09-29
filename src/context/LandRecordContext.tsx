import React, { createContext, useContext, useState, ReactNode } from 'react';

import {
  LandRecord,
  ReviewQueueItem,
  AuditLog,
  DocumentItem,
  GISParcel,
  ExtractedField
} from '../types';

import {
  initialLandRecords,
  initialReviewQueue,
  initialAuditLogs,
  mockDocuments,
  gisParcels
} from '../data/mockData';

import { useToast } from './ToastContext';

interface LandRecordContextType {
  records: LandRecord[];
  reviewQueue: ReviewQueueItem[];
  auditLogs: AuditLog[];
  documents: DocumentItem[];
  activeRecord: LandRecord;
  activeParcel: GISParcel;
  highlightedField: ExtractedField | null;
  evidenceModalOpen: boolean;
  activeEvidenceField: ExtractedField | null;
  reviewModalOpen: boolean;
  activeReviewItem: ReviewQueueItem | null;
  currentProcessingFile: {
    name: string;
    size: string;
    type: string;
    district: string;
    language: string;
  };
  setActiveParcel: (parcel: GISParcel) => void;
  setHighlightedField: (field: ExtractedField | null) => void;
  openEvidenceModal: (field: ExtractedField) => void;
  closeEvidenceModal: () => void;
  openReviewModal: (item: ReviewQueueItem) => void;
  closeReviewModal: () => void;
  updateRecordField: (recordId: string, fieldId: string, newValue: string) => void;
  approveReviewItem: (itemId: string) => void;
  rejectReviewItem: (itemId: string) => void;
  saveReviewCorrection: (itemId: string, correctedValue: string) => void;
  setProcessingFile: (fileInfo: {
    name: string;
    size: string;
    type: string;
    district: string;
    language: string;
  }) => void;
  updateRecordStatus: (recordId: string, status: LandRecord['status']) => void;
  updateStructuredRecord: (recordId: string, updatedFields: Partial<LandRecord>) => void;
  ingestNewDocument: (
    file: { name: string; size: string; type: string },
    docType: string,
    district: string
  ) => void;
}

const LandRecordContext = createContext<LandRecordContextType | undefined>(undefined);

export const LandRecordProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [records, setRecords] = useState<LandRecord[]>(initialLandRecords);
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueItem[]>(initialReviewQueue);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [documents, setDocuments] = useState<DocumentItem[]>(mockDocuments);
  const [activeParcel, setActiveParcel] = useState<GISParcel>(gisParcels[0]);
  const [highlightedField, setHighlightedField] = useState<ExtractedField | null>(
    initialLandRecords[0]?.extractedFields?.[0] ?? null
  );
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [activeEvidenceField, setActiveEvidenceField] = useState<ExtractedField | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeReviewItem, setActiveReviewItem] = useState<ReviewQueueItem | null>(null);

  const [currentProcessingFile, setProcessingFile] = useState({
    name: 'Khatian_1456.pdf',
    size: '2.4 MB',
    type: 'Khatian',
    district: 'Darjeeling',
    language: 'Bengali / English'
  });

  const activeRecord: LandRecord = records[0] ?? initialLandRecords[0];

  const openEvidenceModal = (field: ExtractedField) => {
    setActiveEvidenceField(field);
    setHighlightedField(field);
    setEvidenceModalOpen(true);
  };

  const closeEvidenceModal = () => {
    setEvidenceModalOpen(false);
    setActiveEvidenceField(null);
  };

  const openReviewModal = (item: ReviewQueueItem) => {
    setActiveReviewItem(item);
    setReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setReviewModalOpen(false);
    setActiveReviewItem(null);
  };

  const updateRecordField = (recordId: string, fieldId: string, newValue: string) => {
    setRecords((previousRecords) =>
      previousRecords.map((record) => {
        if (record.id !== recordId) return record;

        return {
          ...record,
          extractedFields: record.extractedFields.map((field) =>
            field.id === fieldId
              ? { ...field, value: newValue, verified: true }
              : field
          )
        };
      })
    );

    showToast(
      'Field Updated',
      `Value updated to "${newValue}" successfully.`,
      'success'
    );
  };

  const approveReviewItem = (itemId: string) => {
    const item = reviewQueue.find((queueItem) => queueItem.id === itemId);
    if (!item) return;

    setReviewQueue((previousQueue) =>
      previousQueue.map((queueItem) =>
        queueItem.id === itemId
          ? { ...queueItem, status: 'Approved' }
          : queueItem
      )
    );

    const newLog: AuditLog = {
      id: `a-${Date.now()}`,
      recordId: item.recordId,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      timestamp: new Date().toISOString(),
      action: `Field ${item.field} Approved`,
      details: `Officer Animesh approved extracted value: "${item.extractedValue}"`,
      user: 'Animesh (Officer)',
      type: 'approval'
    };

    setAuditLogs((previousLogs) => [newLog, ...previousLogs]);

    showToast(
      'Item Approved',
      `${item.field} for ${item.recordId} has been approved.`,
      'success'
    );

    closeReviewModal();
  };

  const rejectReviewItem = (itemId: string) => {
    const item = reviewQueue.find((queueItem) => queueItem.id === itemId);
    if (!item) return;

    setReviewQueue((previousQueue) =>
      previousQueue.map((queueItem) =>
        queueItem.id === itemId
          ? { ...queueItem, status: 'Rejected' }
          : queueItem
      )
    );

    const newLog: AuditLog = {
      id: `a-${Date.now()}`,
      recordId: item.recordId,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      timestamp: new Date().toISOString(),
      action: `Field ${item.field} Rejected`,
      details: `Value "${item.extractedValue}" rejected by officer. Sent for re-scanning.`,
      user: 'Animesh (Officer)',
      type: 'edit'
    };

    setAuditLogs((previousLogs) => [newLog, ...previousLogs]);

    showToast(
      'Item Rejected',
      `${item.field} marked for document re-inspection.`,
      'warning'
    );

    closeReviewModal();
  };

  const saveReviewCorrection = (itemId: string, correctedValue: string) => {
    const item = reviewQueue.find((queueItem) => queueItem.id === itemId);
    if (!item) return;

    const previousValue = item.extractedValue;

    setReviewQueue((previousQueue) =>
      previousQueue.map((queueItem) =>
        queueItem.id === itemId
          ? {
              ...queueItem,
              status: 'Corrected',
              extractedValue: correctedValue
            }
          : queueItem
      )
    );

    setRecords((previousRecords) =>
      previousRecords.map((record) => {
        if (record.id !== item.recordId) return record;

        const updatedFields = record.extractedFields.map((field) =>
          field.field === item.field
            ? {
                ...field,
                value: correctedValue,
                confidence: 98,
                verified: true
              }
            : field
        );

        const updatedRecord: LandRecord = {
          ...record,
          extractedFields: updatedFields,
          status: 'Verified'
        };

        if (item.field === 'Plot No.') {
          updatedRecord.plotNo = correctedValue;
        }

        if (item.field === 'Owner Name') {
          updatedRecord.ownerName = correctedValue;
        }

        if (item.field === 'Area (Acres)') {
        }

        return updatedRecord;
      })
    );

    const newLog: AuditLog = {
      id: `a-${Date.now()}`,
      recordId: item.recordId,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      timestamp: new Date().toISOString(),
      action: `Officer edited ${item.field}`,
      details: `Corrected value: "${previousValue}" → "${correctedValue}"`,
      user: 'Animesh (Officer)',
      type: 'edit'
    };

    setAuditLogs((previousLogs) => [newLog, ...previousLogs]);

    showToast(
      'Correction Saved',
      `${item.field} updated to "${correctedValue}". Audit trail recorded.`,
      'success'
    );

    closeReviewModal();
  };

  const updateRecordStatus = (
    recordId: string,
    status: LandRecord['status']
  ) => {
    setRecords((previousRecords) =>
      previousRecords.map((record) =>
        record.id === recordId
          ? { ...record, status }
          : record
      )
    );

    showToast(
      'Status Updated',
      `Record #${recordId} status set to "${status}".`,
      'info'
    );
  };

  const updateStructuredRecord = (
    recordId: string,
    updatedFields: Partial<LandRecord>
  ) => {
    setRecords((previousRecords) =>
      previousRecords.map((record) =>
        record.id === recordId
          ? { ...record, ...updatedFields }
          : record
      )
    );

    showToast(
      'Record Saved',
      `Structured details for Record #${recordId} saved.`,
      'success'
    );
  };

  const ingestNewDocument = (
    file: {
      name: string;
      size: string;
      type: string;
    },
    docType: string,
    district: string
  ) => {
    const newId = `LR-${Date.now()}`;
    const uploadDate = new Date().toISOString();

    const ownerName = 'Ramesh Das';
    const fatherName = 'Haran Das';
    const plotNumber = '302';
    const khatianNumber = '1456';
    const area = 0.82;

    const extractedFields: ExtractedField[] = [
      {
        id: `field-owner-${newId}`,
        field: 'Owner Name',
        value: ownerName,
        confidence: 96,
        confidenceLevel: 'High',
        coordinates: {
          x: 10,
          y: 35,
          width: 80,
          height: 20,
          page: 1
        },
        method: 'OCR + Entity Extraction',
        verified: true
      },
      {
        id: `field-father-${newId}`,
        field: 'Father / Husband Name',
        value: fatherName,
        confidence: 95,
        confidenceLevel: 'High',
        coordinates: {
          x: 10,
          y: 60,
          width: 80,
          height: 20,
          page: 1
        },
        method: 'OCR + Entity Extraction',
        verified: true
      },
      {
        id: `field-plot-${newId}`,
        field: 'Plot No.',
        value: plotNumber,
        confidence: 97,
        confidenceLevel: 'High',
        coordinates: {
          x: 10,
          y: 85,
          width: 40,
          height: 20,
          page: 1
        },
        method: 'OCR + Pattern Matching',
        verified: true
      },
      {
        id: `field-khatian-${newId}`,
        field: 'Khatian No.',
        value: khatianNumber,
        confidence: 98,
        confidenceLevel: 'High',
        coordinates: {
          x: 55,
          y: 85,
          width: 40,
          height: 20,
          page: 1
        },
        method: 'OCR + Pattern Matching',
        verified: true
      },
      {
        id: `field-area-${newId}`,
        field: 'Area (Acres)',
        value: String(area),
        confidence: 94,
        confidenceLevel: 'High',
        coordinates: {
          x: 10,
          y: 110,
          width: 45,
          height: 20,
          page: 1
        },
        method: 'OCR + Numeric Extraction',
        verified: true
      },
      {
        id: `field-landtype-${newId}`,
        field: 'Land Type',
        value: 'Agricultural',
        confidence: 93,
        confidenceLevel: 'High',
        coordinates: {
          x: 60,
          y: 110,
          width: 35,
          height: 20,
          page: 1
        },
        method: 'OCR + Classification',
        verified: true
      },
      {
        id: `field-village-${newId}`,
        field: 'Village',
        value: 'ABC',
        confidence: 91,
        confidenceLevel: 'High',
        coordinates: {
          x: 10,
          y: 135,
          width: 60,
          height: 20,
          page: 1
        },
        method: 'OCR + Entity Extraction',
        verified: true
      },
      {
        id: `field-block-${newId}`,
        field: 'Block',
        value: 'XYZ',
        confidence: 90,
        confidenceLevel: 'High',
        coordinates: {
          x: 10,
          y: 160,
          width: 50,
          height: 20,
          page: 1
        },
        method: 'OCR + Entity Extraction',
        verified: true
      },
      {
        id: `field-district-${newId}`,
        field: 'District',
        value: district || 'Darjeeling',
        confidence: 99,
        confidenceLevel: 'High',
        coordinates: {
          x: 65,
          y: 160,
          width: 30,
          height: 20,
          page: 1
        },
        method: 'OCR + Entity Extraction',
        verified: true
      },
      {
        id: `field-survey-${newId}`,
        field: 'Survey Year',
        value: '1968-69',
        confidence: 92,
        confidenceLevel: 'High',
        coordinates: {
          x: 10,
          y: 185,
          width: 45,
          height: 20,
          page: 1
        },
        method: 'OCR + Pattern Matching',
        verified: true
      },
      {
        id: `field-state-${newId}`,
        field: 'State',
        value: 'West Bengal',
        confidence: 99,
        confidenceLevel: 'High',
        coordinates: {
          x: 60,
          y: 185,
          width: 35,
          height: 20,
          page: 1
        },
        method: 'OCR + Entity Extraction',
        verified: true
      }
    ];

    const newDocument: DocumentItem = {
      id: newId,
      fileName: file.name,
      fileSize: file.size,
      uploadedDate: uploadDate,
      status: 'Processing',
      type: docType || 'Khatian',
      pages: 1,
      confidence: 95,
      district: district || 'Darjeeling'
    };

    const newRecord: LandRecord = {
      id: newId,
      documentId: newId,
      ownerName,
      fatherName,
      address: 'ABC Village, XYZ Block, Darjeeling, West Bengal',
      khatianNo: khatianNumber,
      plotNo: plotNumber,
      areaAcre: area,
      referenceAreaAcre: area,
      landType: 'Agricultural',
      village: 'ABC',
      tehsil: 'XYZ',
      district: district || 'Darjeeling',
      status: 'Pending',
      confidence: 95,
      uploadedDate: uploadDate,
      fileName: file.name,
      fileSize: file.size,
      extractedFields,
      validationRules: []
    };

    const reviewItems: ReviewQueueItem[] = [
      {
        id: `review-owner-${newId}`,
        recordId: newId,
        documentId: newId,
        field: 'Owner Name',
        extractedValue: ownerName,
        suggestedValue: ownerName,
        confidence: 96,
        reason: 'Manual verification recommended',
        priority: 'Medium',
        status: 'Pending',
        category: 'Low Confidence',
        cropCoordinates: extractedFields[0].coordinates
      },
      {
        id: `review-father-${newId}`,
        recordId: newId,
        documentId: newId,
        field: 'Father / Husband Name',
        extractedValue: fatherName,
        suggestedValue: fatherName,
        confidence: 95,
        reason: 'Manual verification recommended',
        priority: 'Medium',
        status: 'Pending',
        category: 'Low Confidence',
        cropCoordinates: extractedFields[1].coordinates
      },
      {
        id: `review-plot-${newId}`,
        recordId: newId,
        documentId: newId,
        field: 'Plot No.',
        extractedValue: plotNumber,
        suggestedValue: plotNumber,
        confidence: 97,
        reason: 'Verify plot number against source document',
        priority: 'Low',
        status: 'Pending',
        category: 'Validation Issues',
        cropCoordinates: extractedFields[2].coordinates
      },
      {
        id: `review-khatian-${newId}`,
        recordId: newId,
        documentId: newId,
        field: 'Khatian No.',
        extractedValue: khatianNumber,
        suggestedValue: khatianNumber,
        confidence: 98,
        reason: 'Verify khatian number against source document',
        priority: 'Low',
        status: 'Pending',
        category: 'Validation Issues',
        cropCoordinates: extractedFields[3].coordinates
      },
      {
        id: `review-area-${newId}`,
        recordId: newId,
        documentId: newId,
        field: 'Area (Acres)',
        extractedValue: String(area),
        suggestedValue: String(area),
        confidence: 94,
        reason: 'Verify recorded land area',
        priority: 'Medium',
        status: 'Pending',
        category: 'Validation Issues',
        cropCoordinates: extractedFields[4].coordinates
      }
    ];

    setDocuments((previous) => [newDocument, ...previous]);
    setRecords((previous) => [newRecord, ...previous]);
    setReviewQueue((previous) => [...reviewItems, ...previous]);

    setAuditLogs((previous) => [
      {
        id: `audit-${newId}`,
        recordId: newId,
        time: new Date().toLocaleTimeString(),
        timestamp: uploadDate,
        action: 'Document Uploaded',
        details: `${file.name} uploaded and queued for extraction.`,
        user: 'SIH Demo Officer',
        type: 'upload'
      },
      ...previous
    ]);

    setProcessingFile({
      name: file.name,
      size: file.size,
      type: docType || 'Khatian',
      district: district || 'Darjeeling',
      language: 'Bengali'
    });

    showToast(
      'Document Uploaded',
      `${file.name} has been added to the verification queue.`,
      'success'
    );
  };

  return (
    <LandRecordContext.Provider
      value={{
        records,
        reviewQueue,
        auditLogs,
        documents,
        activeRecord,
        activeParcel,
        highlightedField,
        evidenceModalOpen,
        activeEvidenceField,
        reviewModalOpen,
        activeReviewItem,
        currentProcessingFile,
        setActiveParcel,
        setHighlightedField,
        openEvidenceModal,
        closeEvidenceModal,
        openReviewModal,
        closeReviewModal,
        updateRecordField,
        approveReviewItem,
        rejectReviewItem,
        saveReviewCorrection,
        setProcessingFile,
        updateRecordStatus,
        updateStructuredRecord,
        ingestNewDocument
      }}
    >
      {children}
    </LandRecordContext.Provider>
  );
};

export const useLandRecord = () => {
  const context = useContext(LandRecordContext);

  if (!context) {
    throw new Error('useLandRecord must be used within a LandRecordProvider');
  }

  return context;
};
