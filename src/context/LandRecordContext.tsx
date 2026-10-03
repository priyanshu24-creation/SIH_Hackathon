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
    documentUrl?: string;
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
    documentUrl?: string;
  }) => void;
  updateRecordStatus: (recordId: string, status: LandRecord['status']) => void;
  updateStructuredRecord: (recordId: string, updatedFields: Partial<LandRecord>) => void;
  ingestNewDocument: (
    file: { name: string; size: string; type: string; url?: string },
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

  const [currentProcessingFile, setProcessingFile] = useState<{
    name: string;
    size: string;
    type: string;
    district: string;
    language: string;
    documentUrl?: string;
  }>({
    name: 'Khatian_1456.pdf',
    size: '2.4 MB',
    type: 'Khatian',
    district: 'Darjeeling',
    language: 'Bengali / English',
    documentUrl: `${import.meta.env.BASE_URL}documents/Hackathon_Demo_real.png`
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
      url?: string;
    },
    docType: string,
    district: string
  ) => {
    const newId = 'PROP-2026-001';
    const uploadDate = new Date().toISOString().split('T')[0];

    // Demo extraction adapter for the supplied SIH land-record document.
    // The UI is wired to accept real OCR output later without changing the viewer.
    const ownerName = 'Arindam Sen';
    const fatherName = 'Subhash Sen';
    const address =
      'Shantipur Demo Village, Demo Block-1, Durgapur, Demo District, West Bengal - 700000';
    const plotNumber = 'DAG-1047';
    const khatianNumber = 'KH-7842';
    const surveyNumber = 'SURV-2026-1047';
    const area = 0.82;
    const landType = 'Agricultural Land';
    const village = 'Shantipur Demo Village';
    const tehsil = 'Demo Block-1';
    const demoDistrict = 'Durgapur Demo';
    const districtCode = 'PLOT-1047';
    const propertyId = 'PROP-2026-001';
    const villageNo = '1047';
    const totalPlots = '1';
    const recordType = 'Revenue - Demo Record';
    const currency = 'INR';
    const recordCreationDate = '15/08/2026';
    const shareInPlot = '1.0000';
    const ownerLandArea = '0.82 Acre';

    const confidence = 94;

    const box = (
      id: string,
      field: string,
      value: string,
      confidenceValue: number,
      x: number,
      y: number,
      width: number,
      height: number,
      method = 'Demo OCR + field extraction'
    ): ExtractedField => ({
      id,
      field,
      value,
      confidence: confidenceValue,
      confidenceLevel:
        confidenceValue >= 90 ? 'High' : confidenceValue >= 75 ? 'Medium' : 'Low',
      coordinates: { x, y, width, height, page: 1 },
      method,
      verified: false
    });

    // Coordinates are based on the 1240 x 1755 demo scan.
    const extractedFields: ExtractedField[] = [
      box(`field-property-${newId}`, 'Property ID', propertyId, 98, 910, 20, 300, 70),
      box(`field-district-${newId}`, 'District', demoDistrict, 97, 20, 10, 430, 65),
      box(`field-village-${newId}`, 'Village', village, 96, 20, 70, 500, 70),
      box(`field-block-${newId}`, 'Block', tehsil, 96, 900, 65, 300, 75),
      box(`field-date-${newId}`, 'Record Creation Date', recordCreationDate, 95, 800, 145, 390, 65),
      box(`field-landarea-${newId}`, 'Land Area', `${area.toFixed(2)} Acre`, 97, 30, 195, 360, 55),
      box(`field-totalplots-${newId}`, 'Total Number of Plots', totalPlots, 97, 430, 195, 360, 55),
      box(`field-owner-${newId}`, 'Owner Name', ownerName, 96, 300, 365, 290, 65),
      box(`field-father-${newId}`, "Father's Name", fatherName, 95, 300, 430, 290, 65),
      box(`field-address-${newId}`, 'Address', address, 91, 300, 495, 300, 125),
      box(`field-plot-${newId}`, 'Plot No.', plotNumber, 97, 35, 930, 135, 70),
      box(`field-landtype-${newId}`, 'Land Classification', landType, 94, 165, 910, 170, 100),
      box(`field-survey-${newId}`, 'Survey No.', surveyNumber, 92, 350, 920, 190, 120),
      box(`field-area2-${newId}`, 'Total Plot Area', `${area.toFixed(2)} Acre`, 97, 570, 965, 160, 90),
      box(`field-share-${newId}`, 'Share in Plot', shareInPlot, 96, 735, 965, 145, 90),
      box(`field-ownerarea-${newId}`, "Owner's Land Area", ownerLandArea, 96, 885, 965, 285, 90),
      box(`field-khatian-${newId}`, 'Khatian No.', khatianNumber, 97, 350, 1010, 190, 115)
    ];

    const validationRules: LandRecord['validationRules'] = [
      {
        id: `v-${newId}-area`,
        field: 'Land Area',
        documentValue: area.toFixed(2),
        referenceValue: area.toFixed(2),
        status: 'Passed',
        ruleDescription: 'Owner land area matches the total plot area.'
      },
      {
        id: `v-${newId}-share`,
        field: 'Share in Plot',
        documentValue: shareInPlot,
        referenceValue: '1.0000',
        status: 'Match',
        ruleDescription: 'Ownership share is within the valid 0–1 range.'
      },
      {
        id: `v-${newId}-owner`,
        field: 'Owner Name',
        documentValue: ownerName,
        referenceValue: ownerName,
        status: 'Match',
        ruleDescription: 'Owner name extracted successfully.'
      }
    ];

    const newDocument: DocumentItem = {
      id: newId,
      fileName: file.name,
      fileSize: file.size,
      status: 'Processing',
      type: docType || file.type || 'Land Record',
      pages: 1,
      confidence,
      district: demoDistrict || district,
      uploadedDate: uploadDate
    };

    const newRecord: LandRecord = {
      id: newId,
      documentId: newId,
      ownerName,
      fatherName,
      address,
      khatianNo: khatianNumber,
      plotNo: plotNumber,
      areaAcre: area,
      referenceAreaAcre: area,
      landType,
      village,
      tehsil,
      district: demoDistrict,
      status: 'Needs Verification',
      confidence,
      uploadedDate: uploadDate,
      fileName: file.name,
      fileSize: file.size,
      extractedFields,
      validationRules
    };

    const reviewFields = extractedFields.filter((field) => field.confidence < 95);
    const newReviewItems: ReviewQueueItem[] = reviewFields.map((field, index) => ({
      id: `review-${newId}-${index}`,
      recordId: newId,
      documentId: newId,
      field: field.field,
      extractedValue: field.value,
      suggestedValue: field.value,
      confidence: field.confidence,
      reason: field.confidence < 90 ? 'Low OCR confidence' : 'Manual verification recommended',
      priority: field.confidence < 90 ? 'High' : 'Medium',
      status: 'Pending',
      category: field.confidence < 90 ? 'Low Confidence' : 'Validation Issues',
      cropCoordinates: field.coordinates,
      assignedTo: 'Revenue Officer'
    }));

    const newAuditLog: AuditLog = {
      id: `a-${Date.now()}`,
      recordId: newId,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString(),
      action: 'Document Uploaded',
      details:
        `Digitization completed for ${file.name}. Owner: ${ownerName}, ` +
        `Khatian: ${khatianNumber}, Plot: ${plotNumber}, Area: ${area.toFixed(2)} Acre.`,
      user: 'System',
      type: 'upload'
    };

    setDocuments([newDocument]);
    setRecords([newRecord]);
    setReviewQueue(newReviewItems);
    setAuditLogs([newAuditLog]);

    setProcessingFile({
      name: file.name,
      size: file.size,
      type: file.type || docType || 'Land Record',
      district: demoDistrict || district,
      language: 'Bengali / English',
      documentUrl: file.url || `${import.meta.env.BASE_URL}documents/Hackathon_Demo_real.png`
    });

    setHighlightedField(extractedFields[0]);

    showToast(
      'Digitization Complete',
      `Fields extracted from ${file.name}. Owner: ${ownerName}, Khatian: ${khatianNumber}, Plot: ${plotNumber}.`,
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
