import mongoose, { Document, Schema } from 'mongoose';

export interface INotaCredito extends Document {
  // Datos del form
  tipo: 'NATURAL' | 'JURIDICA';
  nombre_completo: string;
  dni?: string;
  ruc?: string;
  monto_pagar: number;
  monto_letras: string;
  numero_documento_origen: string;
  concepto_nota: string;
  documentos_adjuntos?: string;
  responsable_unidad: string;

  // Transferencia
  banco_id?: mongoose.Types.ObjectId;
  numero_cuenta?: string;
  cci?: string;

  // Snapshot de datos estáticos
  datos_estaticos: {
    dependencia_solicitante: string;
    persona_contacto: string;
    anexo: string;
  };

  createdAt: Date;
}

const NotaCreditoSchema: Schema = new Schema({
  // Datos del form
  tipo: {
    type: String,
    enum: ['NATURAL', 'JURIDICA'],
    required: true,
  },
  nombre_completo: {
    type: String,
    required: true,
    trim: true,
  },
  dni: {
    type: String,
    trim: true,
  },
  ruc: {
    type: String,
    trim: true,
  },
  monto_pagar: {
    type: Number,
    required: true,
    min: 0,
  },
  monto_letras: {
    type: String,
    required: true,
    trim: true,
  },
  numero_documento_origen: {
    type: String,
    required: true,
    trim: true,
  },
  concepto_nota: {
    type: String,
    required: true,
    trim: true,
  },
  documentos_adjuntos: {
    type: String,
  },
  responsable_unidad: {
    type: String,
    required: true,
    trim: true,
  },

  // Transferencia
  banco_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Banco',
  },
  numero_cuenta: {
    type: String,
    trim: true,
  },
  cci: {
    type: String,
    trim: true,
  },

  // Snapshot de datos estáticos
  datos_estaticos: {
    dependencia_solicitante: {
      type: String,
      required: true,
    },
    persona_contacto: {
      type: String,
      required: true,
    },
    anexo: {
      type: String,
      required: true,
    },
  },
}, {
  timestamps: true,
});

// Índices para optimizar búsquedas
NotaCreditoSchema.index({ tipo: 1 });
NotaCreditoSchema.index({ createdAt: -1 });
NotaCreditoSchema.index({ 'datos_estaticos.dependencia_solicitante': 1 });

const NotaCredito = mongoose.models.NotaCredito ||
  mongoose.model<INotaCredito>('NotaCredito', NotaCreditoSchema);

export default NotaCredito;
