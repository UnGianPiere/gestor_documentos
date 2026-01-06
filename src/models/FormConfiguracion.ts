import mongoose, { Document, Schema } from 'mongoose';

export interface IFormConfiguracion extends Document {
  dependencia_solicitante: string;
  persona_contacto: string;
  responsable_unidad: string;
  anexo: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FormConfiguracionSchema: Schema = new Schema({
  dependencia_solicitante: {
    type: String,
    required: true,
    trim: true,
  },
  persona_contacto: {
    type: String,
    required: true,
    trim: true,
  },
  responsable_unidad: {
    type: String,
    required: true,
    trim: true,
  },
  anexo: {
    type: String,
    required: true,
    trim: true,
  },
  activo: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Solo puede haber una configuración activa
FormConfiguracionSchema.pre<IFormConfiguracion>('save', async function(next) {
  if (this.activo) {
    await (this.constructor as any).updateMany(
      { _id: { $ne: this._id }, activo: true },
      { activo: false }
    );
  }
  next();
});

const FormConfiguracion = mongoose.models.FormConfiguracion ||
  mongoose.model<IFormConfiguracion>('FormConfiguracion', FormConfiguracionSchema);

export default FormConfiguracion;
