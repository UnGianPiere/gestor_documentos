import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Banco from '@/models/Banco';

// PUT - Actualizar banco por ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { nombre } = await request.json();

    if (!nombre || !nombre.trim()) {
      return NextResponse.json(
        { error: 'El nombre del banco es requerido' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const banco = await Banco.findByIdAndUpdate(
      id,
      { nombre: nombre.trim() },
      { new: true, runValidators: true }
    );

    if (!banco) {
      return NextResponse.json(
        { error: 'Banco no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(banco);
  } catch (error: any) {
    console.error('Error actualizando banco:', error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Ya existe un banco con ese nombre' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Desactivar banco por ID (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const banco = await Banco.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );

    if (!banco) {
      return NextResponse.json(
        { error: 'Banco no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Banco eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando banco:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
