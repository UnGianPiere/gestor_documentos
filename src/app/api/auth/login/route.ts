import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { usuario, contrasenna } = await request.json();

    if (!usuario || !contrasenna) {
      return NextResponse.json(
        { error: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Conectar a la base de datos
    await connectToDatabase();

    // Buscar usuario por credenciales
    const user = await User.findOne({
      $or: [
        { usuario: usuario.toLowerCase() },
        { email: usuario.toLowerCase() }
      ],
      isActive: true
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const bcrypt = await import('bcryptjs');
    const isPasswordValid = await bcrypt.default.compare(contrasenna, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    // Generar tokens (en producción, usa JWT real)
    const token = `token_${user._id}_${Date.now()}`;
    const refreshToken = `refresh_${user._id}_${Date.now()}`;

    const loginData = {
      token,
      refreshToken,
      usuario: {
        id: user._id.toString(),
        nombres: user.nombres,
        usuario: user.usuario,
        email: user.email,
        role: user.role,
      },
    };

    // Crear respuesta con token (el cliente configurará la cookie)
    const response = NextResponse.json(loginData);

    return response;

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
