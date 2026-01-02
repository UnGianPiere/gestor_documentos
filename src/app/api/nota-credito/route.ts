import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import NotaCredito from '@/models/NotaCredito';
import FormConfiguracion from '@/models/FormConfiguracion';

// POST - Crear nueva nota de crédito
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const {
      tipo_comprobante,
      nombre_completo,
      dni,
      ruc,
      monto_pagar,
      monto_letras,
      numero_documento_origen,
      concepto_nota,
      fecha_caducidad,
      responsable_unidad,
      banco_id,
      numero_cuenta,
      cci
    } = data;

    // Validaciones básicas
    if (!tipo_comprobante || !nombre_completo || !monto_pagar || !monto_letras || !numero_documento_origen ||
        !concepto_nota || !fecha_caducidad || !responsable_unidad) {
      return NextResponse.json(
        { error: 'Campos requeridos faltantes' },
        { status: 400 }
      );
    }

    // Validar tipo de comprobante
    if (!['FACTURA', 'BOLETA'].includes(tipo_comprobante)) {
      return NextResponse.json(
        { error: 'Tipo de comprobante inválido' },
        { status: 400 }
      );
    }

    // Validar formato de DNI/RUC
    if (tipo_comprobante === 'FACTURA' && (!ruc || !/^\d{11}$/.test(ruc.trim()))) {
      return NextResponse.json(
        { error: 'RUC inválido - debe tener exactamente 11 dígitos' },
        { status: 400 }
      );
    }

    if (tipo_comprobante === 'BOLETA' && (!dni || !/^\d{8}$/.test(dni.trim()))) {
      return NextResponse.json(
        { error: 'DNI inválido - debe tener exactamente 8 dígitos' },
        { status: 400 }
      );
    }

    // Validar monto máximo
    const montoNum = parseFloat(monto_pagar);
    if (isNaN(montoNum) || montoNum <= 0 || montoNum > 999999.99) {
      return NextResponse.json(
        { error: 'Monto inválido - debe ser mayor a 0 y menor o igual a 999,999.99' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Obtener configuración activa para snapshot
    const config = await FormConfiguracion.findOne({ activo: true });
    if (!config) {
      return NextResponse.json(
        { error: 'Configuración del formulario no encontrada' },
        { status: 500 }
      );
    }

    // Crear la nota de crédito
    const notaCredito = new NotaCredito({
      tipo: tipo_comprobante === 'FACTURA' ? 'JURIDICA' : 'NATURAL',
      nombre_completo: nombre_completo.trim(),
      dni: dni?.trim(),
      ruc: ruc?.trim(),
      monto_pagar: parseFloat(monto_pagar),
      monto_letras: monto_letras?.trim(),
      numero_documento_origen: numero_documento_origen.trim(),
      concepto_nota: concepto_nota.trim(),
      fecha_caducidad: new Date(fecha_caducidad),
      responsable_unidad: responsable_unidad.trim(),
      banco_id: banco_id ? banco_id : undefined,
      numero_cuenta: numero_cuenta?.trim(),
      cci: cci?.trim(),
      datos_estaticos: {
        dependencia_solicitante: config.dependencia_solicitante,
        persona_contacto: config.persona_contacto,
        anexo: config.anexo,
      },
    });

    await notaCredito.save();

    return NextResponse.json({
      success: true,
      message: 'Nota de crédito creada exitosamente',
      id: notaCredito._id
    }, { status: 201 });

  } catch (error) {
    console.error('Error creando nota de crédito:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// GET - Obtener notas de crédito (para admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Filtros
    const tipo = searchParams.get('tipo');
    const nombre = searchParams.get('nombre');
    const documento = searchParams.get('documento');

    await connectToDatabase();

    // Construir query de filtros
    const query: any = {};
    if (tipo) {
      query.tipo = tipo === 'factura' ? 'JURIDICA' : 'NATURAL';
    }
    if (nombre) {
      query.nombre_completo = { $regex: nombre, $options: 'i' };
    }
    if (documento) {
      query.$or = [
        { dni: { $regex: documento, $options: 'i' } },
        { ruc: { $regex: documento, $options: 'i' } }
      ];
    }

    const notas = await NotaCredito.find(query)
      .populate('banco_id', 'nombre')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await NotaCredito.countDocuments(query);

    return NextResponse.json({
      notas,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error obteniendo notas de crédito:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

