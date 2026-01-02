import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Banco from '@/models/Banco';

// GET - Obtener todos los bancos (activos e inactivos)
export async function GET() {
  try {
    await connectToDatabase();

    const bancos = await Banco.find({}).sort({ activo: -1, nombre: 1 });

    return NextResponse.json(bancos);
  } catch (error) {
    console.error('Error obteniendo bancos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo banco
export async function POST(request: NextRequest) {
  try {
    const { nombre } = await request.json();

    if (!nombre || !nombre.trim()) {
      return NextResponse.json(
        { error: 'El nombre del banco es requerido' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const banco = new Banco({
      nombre: nombre.trim(),
      activo: true,
    });

    await banco.save();

    return NextResponse.json(banco, { status: 201 });
  } catch (error: any) {
    console.error('Error creando banco:', error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'El banco ya existe' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

