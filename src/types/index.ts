// Tipos globales para el proyecto Gestor de Documentos
export interface BaseEntity {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User extends BaseEntity {
  nombres: string;
  usuario: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  isActive: boolean;
}

export interface Document extends BaseEntity {
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  tags?: string[];
  category?: string;
  isPublic: boolean;
}

// Tipos para formularios/responses (para el sistema de gestión)
export interface FormResponse extends BaseEntity {
  formId: string;
  formTitle: string;
  submittedBy: string; // ID del usuario que envió el formulario
  submittedByName: string;
  submittedByEmail: string;
  data: Record<string, unknown>; // Datos del formulario
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  reviewedBy?: string; // ID del admin que revisó
  reviewedAt?: Date;
  notes?: string;
}

export interface Form extends BaseEntity {
  title: string;
  description?: string;
  fields: FormField[];
  isActive: boolean;
  createdBy: string;
  responsesCount: number;
}

export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file' | 'date';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // Para select, radio, checkbox
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}
