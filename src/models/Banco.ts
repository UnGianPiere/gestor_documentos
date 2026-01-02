import mongoose, { Document, Schema } from 'mongoose';

export interface IBanco extends Document {
  nombre: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BancoSchema: Schema = new Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  activo: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Banco = mongoose.models.Banco || mongoose.model<IBanco>('Banco', BancoSchema);

export default Banco;

