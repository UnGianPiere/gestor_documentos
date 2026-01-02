import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  nombres: string;
  usuario: string;
  email: string;
  password: string; // En producción, esto debería estar hasheado
  role: 'admin' | 'user' | 'viewer';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface para métodos estáticos del modelo
interface IUserModel extends Model<IUser> {
  findByCredentials(usuario: string, password: string): Promise<IUser>;
}

const UserSchema: Schema = new Schema({
  nombres: {
    type: String,
    required: true,
    trim: true,
  },
  usuario: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'viewer'],
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Índices para optimizar búsquedas
UserSchema.index({ usuario: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

// Método estático para encontrar usuario por credenciales
UserSchema.static('findByCredentials', async function findByCredentials(usuario: string, password: string) {
  const user = await this.findOne({
    $or: [
      { usuario: usuario.toLowerCase() },
      { email: usuario.toLowerCase() }
    ],
    isActive: true
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Verificar contraseña hasheada
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Contraseña incorrecta');
  }

  return user;
});

// Método para obtener usuario sin contraseña
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export type { IUserModel };
export default User;
