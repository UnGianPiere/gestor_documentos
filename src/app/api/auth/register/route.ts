import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { nombres, usuario, email, contrasenna } = await request.json();

    if (!nombres || !usuario || !email || !contrasenna) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El email no es válido' },
        { status: 400 }
      );
    }

    // Validar longitud de contraseña
    if (contrasenna.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Conectar a la base de datos
    await connectToDatabase();

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      $or: [
        { usuario: usuario.toLowerCase() },
        { email: email.toLowerCase() }
      ]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El usuario o email ya están registrados' },
        { status: 409 }
      );
    }

    // Hashear la contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(contrasenna, saltRounds);

    // Crear nuevo usuario
    const newUser = new User({
      nombres,
      usuario: usuario.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user', // Rol por defecto
      isActive: true,
    });

    await newUser.save();

    // Retornar éxito (sin datos sensibles)
    return NextResponse.json(
      {
        message: 'Usuario registrado exitosamente',
        usuario: {
          id: newUser._id.toString(),
          nombres: newUser.nombres,
          usuario: newUser.usuario,
          email: newUser.email,
          role: newUser.role,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
