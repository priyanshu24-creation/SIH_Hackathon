import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  LandRecord,
  ReviewQueueItem,
  AuditLog,
  DocumentItem,
  GISParcel,
  ExtractedField,
} from '../types';
import {
  initialLandRecords,
  initialReviewQueue,
  initialAuditLogs,
  mockDocuments,
  gisParcels,
} from '../data/mockData';
import { useToast } from './ToastContext';

interface ProcessingFile {
  name: string;
  size: string;
  type: string;
  district: string;
  language: string;
}

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
  currentProcessingFile: ProcessingFile;
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
  setProcessingFile: (fileInfo: ProcessingFile) => void;
  updateRecordStatus: (recordId: string, status: LandRecord['status']) => void;
  updateStructuredRecord: (recordId: string, updatedFields: Partial<LandRecord>) => void;
  ingestNewDocument: (
    file: { name: string; size: string; type: string },
    docType: string,
    district: string
  ) => void;
}

const LandRecordContext = createContext<LandRecordContextType | undefined>(undefined);

const confidenceLevel = (value: number): ExtractedField['confidenceLevel'] => {
  if (value >= 90) return 'High';
  if (value >= 70) return 'Medium';
  return 'Low';
};

const makeField = (
  id: string,
  field: string,
  value: string,
  confidence: number,
  x: number,
  y: number,
  width: number,
  height: number,
  method: string
): ExtractedField => ({
  id,
  field,
  value,
  confidence,
  confidenceLevel: confidenceLevel(confidence),
  coordinates: { x, y, width, height, page: 1 },
  method,
  verified: false,
});

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
  const [currentProcessingFile, setProcessingFile] = useState<ProcessingFile>({
    name: 'Khatian_1456.pdf',
    size: '2.4 MB',
    type: 'Khatian',
    district: 'Darjeeling',
    language: 'Bengali',
  });

  const activeRecord = records[0] ?? initialLandRecords[0];

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
    setRecords((current) =>
      current.map((record) => {
        if (record.id !== recordId) return record;
        return {
          ...record,
          extractedFields: record.extractedFields.map((field) =>
            field.id === fieldId ? { ...field, value: newValue, verified: true } : field
          ),
        };
      })
    );
  };

  const createAuditLog = (
    item: ReviewQueueItem,
    action: string,
    details: string,
    type: AuditLog['type']
  ): AuditLog => ({
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    recordId: item.recordId,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: new Date().toISOString(),
    action,
    details,
    user: 'Animesh Roy (Officer)',
    type,
  });

  const approveReviewItem = (itemId: string) => {
    const item = reviewQueue.find((entry) => entry.id === itemId);
    if (!item) return;

    setReviewQueue((current) =>
      current.map((entry) => (entry.id === itemId ? { ...entry, status: 'Approved' } : entry))
    );
    setAuditLogs((current) => [
      createAuditLog(item, `Field ${item.field} approved`, `Approved value: ${item.extractedValue}`, 'approval'),
      ...current,
    ]);
    showToast('Item Approved', `${item.field} has been approved.`, 'success');
    closeReviewModal();
  };

  const rejectReviewItem = (itemId: string) => {
    const item = reviewQueue.find((entry) => entry.id === itemId);
    if (!item) return;

    setReviewQueue((current) =>
      current.map((entry) => (entry.id === itemId ? { ...entry, status: 'Rejected' } : entry))
    );
    setAuditLogs((current) => [
      createAuditLog(item, `Field ${item.field} rejected`, `Rejected value: ${item.extractedValue}`, 'edit'),
      ...current,
    ]);
    showToast('Item Rejected', `${item.field} was sent back for review.`, 'warning');
    closeReviewModal();
  };

  const saveReviewCorrection = (itemId: string, correctedValue: string) => {
    const item = reviewQueue.find((entry) => entry.id === itemId);
    if (!item) return;

    const previousValue = item.extractedValue;

    setReviewQueue((current) =>
      current.map((entry) =>
        entry.id === itemId
          ? { ...entry, status: 'Corrected', extractedValue: correctedValue, suggestedValue: correctedValue }
          : entry
      )
    );

    setRecords((current) =>
      current.map((record) => {
        if (record.id !== item.recordId) return record;

        const updatedFields = record.extractedFields.map((field) =>
          field.field === item.field
            ? {
                ...field,
                value: correctedValue,
                confidence: 98,
                confidenceLevel: 'High' as const,
                verified: true,
              }
            : field
        );

        const updated: LandRecord = { ...record, extractedFields: updatedFields };

        if (item.field === 'Owner Name') updated.ownerName = correctedValue;
        if (item.field === 'Plot No.') updated.plotNo = correctedValue;
        if (item.field === 'Area' || item.field === 'Area (Acres)') {
          const numeric = Number.parseFloat(correctedValue);
          if (!Number.isNaN(numeric)) updated.areaAcre = numeric;
        }

        return updated;
      })
    );

    setAuditLogs((current) => [
      createAuditLog(
        item,
        `Officer corrected ${item.field}`,
        `Changed value from "${previousValue}" to "${correctedValue}"`,
        'edit'
      ),
      ...current,
    ]);

    showToast('Correction Saved', `${item.field} updated successfully.`, 'success');
    closeReviewModal();
  };

  const updateRecordStatus = (recordId: string, status: LandRecord['status']) => {
    setRecords((current) => current.map((record) => (record.id === recordId ? { ...record, status } : record)));
  };

  const updateStructuredRecord = (recordId: string, updatedFields: Partial<LandRecord>) => {
    setRecords((current) => {
      const targetId = current.some((record) => record.id === recordId) ? recordId : current[0]?.id;
      return current.map((record) => (record.id === targetId ? { ...record, ...updatedFields } : record));
    });
    showToast('Record Saved', 'Structured land-record details have been saved.', 'success');
  };

  const ingestNewDocument = (
    file: { name: string; size: string; type: string },
    docType: string,
    district: string
  ) => {
    const newId = 'PROP-2026-001';
    const uploadedDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const ownerName = 'Arindam Sen';
    const fatherName = 'Subhash Sen';
    const plotNo = 'PLOT-1047';
    const khatianNo = 'KH-7842';
    const surveyNo = 'SURV-2026-1047';
    const areaAcre = 0.82;
    const landType = 'Agricultural Land';
    const village = 'Shantipur Demo Village';
    const tehsil = 'Demo Block-I';
    const demoDistrict = 'Durgapur Demo District';
    const address = '12 Demo Road, Shantipur Demo Village, West Bengal';

    const extractedFields: ExtractedField[] = [
      makeField(`field-owner-${newId}`, 'Owner Name', ownerName, 96, 100, 345, 210, 42, 'OCR + field extraction'),
      makeField(`field-father-${newId}`, 'Father / Husband Name', fatherName, 94, 100, 395, 250, 42, 'OCR + field extraction'),
      makeField(`field-khatian-${newId}`, 'Khatian No.', khatianNo, 97, 40, 230, 260, 48, 'OCR + pattern match'),
      makeField(`field-plot-${newId}`, 'Plot No.', plotNo, 98, 390, 345, 100, 45, 'OCR + pattern match'),
      makeField(`field-area-${newId}`, 'Area', `${areaAcre} acre`, 95, 620, 345, 130, 45, 'OCR + rule engine'),
      makeField(`field-survey-${newId}`, 'Survey No.', surveyNo, 96, 40, 285, 260, 42, 'OCR + pattern match'),
      makeField(`field-land-${newId}`, 'Land Type', landType, 93, 490, 395, 180, 42, 'Classification model'),
      makeField(`field-village-${newId}`, 'Village', village, 94, 520, 170, 220, 40, 'Gazetteer match'),
      makeField(`field-tehsil-${newId}`, 'Tehsil', tehsil, 94, 280, 170, 220, 40, 'Gazetteer match'),
      makeField(`field-district-${newId}`, 'District', demoDistrict, 98, 40, 170, 230, 40, 'Gazetteer match'),
      makeField(`field-address-${newId}`, 'Address', address, 92, 40, 445, 700, 50, 'OCR + field extraction'),
    ];

    const newRecord: LandRecord = {
      id: newId,
      documentId: `DOC-${newId}`,
      ownerName,
      fatherName,
      address,
      khatianNo,
      plotNo,
      areaAcre,
      referenceAreaAcre: areaAcre,
      landType,
      village,
      tehsil,
      district: demoDistrict || district,
      status: 'Pending',
      confidence: 95,
      uploadedDate,
      fileName: file.name,
      fileSize: file.size,
      extractedFields,
      validationRules: [
        {
          id: `validation-${newId}-plot`,
          field: 'Plot No.',
          documentValue: plotNo,
          referenceValue: plotNo,
          status: 'Match',
          ruleDescription: 'Plot identifier is present and internally consistent.',
        },
        {
          id: `validation-${newId}-area`,
          field: 'Area',
          documentValue: `${areaAcre} acre`,
          referenceValue: `${areaAcre} acre`,
          status: 'Match',
          ruleDescription: 'Document area matches the prototype reference value.',
        },
      ],
    };

    const reviewBase = {
      documentId: newRecord.documentId,
      suggestedValue: '',
      reason: 'Prototype extraction requires officer confirmation.',
      priority: 'Medium' as const,
      category: 'Low Confidence' as const,
      cropCoordinates: extractedFields[0].coordinates,
      assignedTo: 'Animesh Roy',
    };

    const newReviewItems: ReviewQueueItem[] = [
      {
        ...reviewBase,
        id: `review-plot-${newId}`,
        recordId: newId,
        field: 'Plot No.',
        extractedValue: plotNo,
        suggestedValue: plotNo,
        confidence: 98,
        status: 'Pending',
        cropCoordinates: extractedFields[3].coordinates,
      },
      {
        ...reviewBase,
        id: `review-owner-${newId}`,
        recordId: newId,
        field: 'Owner Name',
        extractedValue: ownerName,
        suggestedValue: ownerName,
        confidence: 96,
        status: 'Pending',
        cropCoordinates: extractedFields[0].coordinates,
      },
      {
        ...reviewBase,
        id: `review-area-${newId}`,
        recordId: newId,
        field: 'Area',
        extractedValue: `${areaAcre} acre`,
        suggestedValue: `${areaAcre} acre`,
        confidence: 95,
        status: 'Pending',
        cropCoordinates: extractedFields[4].coordinates,
      },
    ];

    const newDocument: DocumentItem = {
      id: newRecord.documentId,
      fileName: file.name,
      fileSize: file.size,
      type: docType,
      district: demoDistrict || district,
      uploadedDate,
      status: 'Processing',
      confidence: 95,
      pages: 1,
    };

    const newAuditLog: AuditLog = {
      id: `audit-upload-${Date.now()}`,
      recordId: newId,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString(),
      action: 'Document uploaded',
      details: `${file.name} queued for digitization.`,
      user: 'System',
      type: 'upload',
    };

    setRecords([newRecord]);
    setReviewQueue(newReviewItems);
    setDocuments([newDocument]);
    setAuditLogs([newAuditLog]);
    setProcessingFile({
      name: file.name,
      size: file.size,
      type: docType,
      district: demoDistrict || district,
      language: 'Bengali / English',
    });
    setHighlightedField(extractedFields[0]);

    showToast('Document processed', 'Prototype land-record fields are ready for officer verification.', 'success');
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
        ingestNewDocument,
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
