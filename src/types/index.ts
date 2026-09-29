export type ConfidenceLevel = 'High' | 'Medium' | 'Low';
export type RecordStatus = 'Verified' | 'Pending' | 'Needs Verification' | 'Flagged';
export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
}

export interface ExtractedField {
  id: string;
  field: string;
  labelBengali?: string;
  value: string;
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  coordinates: BoundingBox;
  method: string;
  verified: boolean;
}

export interface ValidationRule {
  id: string;
  field: string;
  documentValue: string;
  referenceValue: string;
  status: 'Match' | 'Mismatch' | 'Passed';
  ruleDescription: string;
}

export interface LandRecord {
  id: string;
  documentId: string;
  ownerName: string;
  fatherName: string;
  address: string;
  khatianNo: string;
  plotNo: string;
  areaAcre: number;
  referenceAreaAcre: number;
  landType: string;
  village: string;
  tehsil: string;
  district: string;
  status: RecordStatus;
  confidence: number;
  uploadedDate: string;
  fileName: string;
  fileSize: string;
  extractedFields: ExtractedField[];
  validationRules: ValidationRule[];
}

export interface ReviewQueueItem {
  id: string;
  recordId: string;
  documentId: string;
  field: string;
  extractedValue: string;
  suggestedValue: string;
  confidence: number;
  reason: string;
  priority: PriorityLevel;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Corrected';
  category: 'All' | 'Low Confidence' | 'Validation Issues' | 'Duplicates';
  cropCoordinates: BoundingBox;
  assignedTo?: string;
}

export interface GISParcel {
  plotNo: string;
  khatianNo: string;
  gisArea: number;
  docArea: number;
  status: 'Verified' | 'Mismatch' | 'Pending';
  village: string;
  owner: string;
  landType: string;
  path: string; // SVG path d attribute
  labelPos: { x: number; y: number };
}

export interface AuditLog {
  id: string;
  recordId: string;
  time: string;
  timestamp: string;
  action: string;
  details: string;
  user: string;
  type: 'upload' | 'ocr' | 'extraction' | 'mismatch' | 'edit' | 'approval';
}

export interface DocumentItem {
  id: string;
  fileName: string;
  fileSize: string;
  type: string;
  district: string;
  uploadedDate: string;
  status: 'Validated' | 'Processing' | 'Pending' | 'Flagged';
  confidence: number;
  pages: number;
}

export interface OfficerUser {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'Active' | 'Inactive';
  lastActive: string;
  email: string;
  recordsProcessed: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}
