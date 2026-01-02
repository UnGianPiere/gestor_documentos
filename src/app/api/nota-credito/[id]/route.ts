import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import NotaCredito from '@/models/NotaCredito';

// PUT - Actualizar nota de crédito por ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updateData = await request.json();

    const {
      tipo,
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
    } = updateData;

    // Validaciones básicas
    if (!tipo || !nombre_completo || !monto_pagar || !numero_documento_origen ||
        !concepto_nota || !fecha_caducidad || !responsable_unidad) {
      return NextResponse.json(
        { error: 'Campos requeridos faltantes' },
        { status: 400 }
      );
    }

    // Validar tipo
    if (!['NATURAL', 'JURIDICA'].includes(tipo)) {
      return NextResponse.json(
        { error: 'Tipo inválido' },
        { status: 400 }
      );
    }

    // Validar formato de DNI/RUC
    if (tipo === 'JURIDICA' && (!ruc || !/^\d{11}$/.test(ruc.trim()))) {
      return NextResponse.json(
        { error: 'RUC inválido - debe tener exactamente 11 dígitos' },
        { status: 400 }
      );
    }

    if (tipo === 'NATURAL' && (!dni || !/^\d{8}$/.test(dni.trim()))) {
      return NextResponse.json(
        { error: 'DNI inválido - debe tener exactamente 8 dígitos' },
        { status: 400 }
      );
    }

    // Validar monto
    const montoNum = parseFloat(monto_pagar);
    if (isNaN(montoNum) || montoNum <= 0 || montoNum > 999999.99) {
      return NextResponse.json(
        { error: 'Monto inválido - debe ser mayor a 0 y menor o igual a 999,999.99' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Actualizar la nota de crédito
    const notaActualizada = await NotaCredito.findByIdAndUpdate(
      id,
      {
        tipo,
        nombre_completo: nombre_completo.trim(),
        dni: dni?.trim(),
        ruc: ruc?.trim(),
        monto_pagar: montoNum,
        monto_letras: monto_letras?.trim(),
        numero_documento_origen: numero_documento_origen.trim(),
        concepto_nota: concepto_nota.trim(),
        fecha_caducidad: new Date(fecha_caducidad),
        responsable_unidad: responsable_unidad.trim(),
        banco_id: banco_id || undefined,
        numero_cuenta: numero_cuenta?.trim(),
        cci: cci?.trim(),
      },
      { new: true, runValidators: true }
    ).populate('banco_id', 'nombre');

    if (!notaActualizada) {
      return NextResponse.json(
        { error: 'Nota de crédito no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Nota de crédito actualizada exitosamente',
      nota: notaActualizada
    });

  } catch (error) {
    console.error('Error actualizando nota de crédito:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar nota de crédito por ID (opcional)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectToDatabase();

    const notaEliminada = await NotaCredito.findByIdAndDelete(id);

    if (!notaEliminada) {
      return NextResponse.json(
        { error: 'Nota de crédito no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Nota de crédito eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando nota de crédito:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
