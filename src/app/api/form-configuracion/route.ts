import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import FormConfiguracion from '@/models/FormConfiguracion';

// GET - Obtener configuración activa
export async function GET() {
  try {
    await connectToDatabase();

    const config = await FormConfiguracion.findOne({ activo: true });

    if (!config) {
      return NextResponse.json(
        { error: 'Configuración no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error obteniendo configuración:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva configuración
export async function POST(request: NextRequest) {
  try {
    const { dependencia_solicitante, persona_contacto, anexo } = await request.json();

    if (!dependencia_solicitante || !persona_contacto || !anexo) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const config = new FormConfiguracion({
      dependencia_solicitante: dependencia_solicitante.trim(),
      persona_contacto: persona_contacto.trim(),
      anexo: anexo.trim(),
      activo: true,
    });

    await config.save();

    return NextResponse.json(config, { status: 201 });
  } catch (error) {
    console.error('Error creando configuración:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar configuración activa
export async function PUT(request: NextRequest) {
  try {
    const { dependencia_solicitante, persona_contacto, anexo } = await request.json();

    if (!dependencia_solicitante || !persona_contacto || !anexo) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const config = await FormConfiguracion.findOneAndUpdate(
      { activo: true },
      {
        dependencia_solicitante: dependencia_solicitante.trim(),
        persona_contacto: persona_contacto.trim(),
        anexo: anexo.trim(),
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error actualizando configuración:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

