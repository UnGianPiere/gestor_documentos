import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectToDatabase();

    const users = await User.find({}, { password: 0 }); // Excluir contraseñas
    const count = await User.countDocuments();

    return NextResponse.json({
      success: true,
      message: 'Conexión exitosa',
      userCount: count,
      users: users
    });
  } catch (error) {
    console.error('Error en test:', error);
    return NextResponse.json(
      { error: 'Error de conexión', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
