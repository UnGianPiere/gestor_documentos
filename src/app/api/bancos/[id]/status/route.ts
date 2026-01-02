import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Banco from '@/models/Banco';

// PUT - Cambiar estado del banco (activar/desactivar)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { activo } = await request.json();

    if (typeof activo !== 'boolean') {
      return NextResponse.json(
        { error: 'El campo activo debe ser un booleano' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const banco = await Banco.findByIdAndUpdate(
      id,
      { activo },
      { new: true, runValidators: true }
    );

    if (!banco) {
      return NextResponse.json(
        { error: 'Banco no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(banco);
  } catch (error) {
    console.error('Error cambiando estado del banco:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
