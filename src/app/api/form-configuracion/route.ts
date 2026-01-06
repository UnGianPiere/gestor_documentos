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
    const { dependencia_solicitante, persona_contacto, responsable_unidad, anexo } = await request.json();

    if (!dependencia_solicitante || !persona_contacto || !responsable_unidad || !anexo) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const config = new FormConfiguracion({
      dependencia_solicitante: dependencia_solicitante?.trim() || '',
      persona_contacto: persona_contacto?.trim() || '',
      responsable_unidad: responsable_unidad?.trim() || '',
      anexo: anexo?.trim() || '',
      activo: true,
    });

    console.log('Guardando configuración...', config);
    const savedConfig = await config.save();
    console.log('Configuración guardada:', savedConfig);

    return NextResponse.json(savedConfig, { status: 201 });
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
    const { dependencia_solicitante, persona_contacto, responsable_unidad, anexo } = await request.json();

    if (!dependencia_solicitante || !persona_contacto || !responsable_unidad || !anexo) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Buscar configuración existente
    let existingConfig = await FormConfiguracion.findOne({ activo: true });

    if (existingConfig) {
      // Eliminar documento existente y crear uno nuevo para asegurar que tenga todos los campos
      await FormConfiguracion.deleteOne({ _id: existingConfig._id });

      const newConfigData = {
        dependencia_solicitante: dependencia_solicitante?.trim() || '',
        persona_contacto: persona_contacto?.trim() || '',
        responsable_unidad: responsable_unidad?.trim() || '',
        anexo: anexo?.trim() || '',
        activo: true,
      };

      const config = new FormConfiguracion(newConfigData);

      // Forzar que se incluya responsable_unidad
      config.responsable_unidad = newConfigData.responsable_unidad;
      config.markModified('responsable_unidad');

      const savedConfig = await config.save();

      // Forzar que se incluya responsable_unidad en la respuesta
      const responseData = savedConfig.toObject();

      // Si no tiene responsable_unidad, agregarlo manualmente
      if (!('responsable_unidad' in responseData)) {
        responseData.responsable_unidad = newConfigData.responsable_unidad;
      }

      return NextResponse.json(responseData);
    } else {
      // Crear nueva configuración
      const config = new FormConfiguracion({
        dependencia_solicitante: dependencia_solicitante?.trim() || '',
        persona_contacto: persona_contacto?.trim() || '',
        responsable_unidad: responsable_unidad?.trim() || '',
        anexo: anexo?.trim() || '',
        activo: true,
      });

      const savedConfig = await config.save();
      return NextResponse.json(savedConfig);
    }
  } catch (error) {
    console.error('Error actualizando configuración:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

