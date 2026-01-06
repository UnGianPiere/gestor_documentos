'use client';

import Modal from '@/components/ui/modal';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';

// Estilos para el PDF - Exactamente igual al diseño del formulario
const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 9,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  headerTable: {
    marginBottom: 0,
    border: '1px solid #e5e7eb',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e5e7eb',
  },
  logoCell: {
    width: '25%', // Logo: 25%
    textAlign: 'center',
    padding: 16, // p-4
    borderRight: '1px solid #e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleCell: {
    width: '50%', // Título: 50% al centro con letras más pequeñas
    textAlign: 'center',
    padding: 12, // p-3
    justifyContent: 'center',
    borderRight: '1px solid #e5e7eb',
  },
  infoCell: {
    width: '25%', // Información lateral: 25%
    textAlign: 'left',
    padding: 16, // p-4
    fontSize: 12, // text-xs
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    fontSize: 12, // text-xs
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12, // text-xs
    fontWeight: 'bold',
    marginTop: 8,
  },
  subtitleSmall: {
    fontSize: 12, // text-xs
    marginTop: 2,
  },
  table: {
    marginTop: 0,
    marginBottom: 0,
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 0,
    marginTop: 6,
  },
  tableHeaderCell: {
    backgroundColor: '#d8d9d9',
    padding: 8,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#5c5c5c',
  },
  tableDataCell: {
    backgroundColor: '#f2f3f2',
    padding: 8,
    fontSize: 9,
    color: '#5c5c5c',
  },
  signatureRow: {
    flexDirection: 'row',
    marginTop: 24,
  },
  signatureLeft: {
    width: '66.67%',
    backgroundColor: '#f2f3f2',
    padding: 16,
  },
  signatureRight: {
    width: '33.33%',
    backgroundColor: '#d8d9d9',
    padding: 12,
    textAlign: 'center',
  },
  signatureTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#5c5c5c',
  },
  signatureText: {
    fontSize: 9,
    marginBottom: 4,
    color: '#5c5c5c',
  },
  signaturePlaceholder: {
    fontSize: 8,
    marginTop: 40,
    color: '#5c5c5c',
  },
  footer: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#64748b',
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  infoText: {
    fontSize: 9,
    marginBottom: 2,
    color: '#5c5c5c',
  },
  montoText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#5c5c5c',
  },
  montoLetrasText: {
    fontSize: 7,
    marginTop: 3,
    fontStyle: 'italic',
    color: '#5c5c5c',
  },
});

interface NotaCredito {
  _id: string;
  tipo: 'NATURAL' | 'JURIDICA';
  nombre_completo: string;
  dni?: string;
  ruc?: string;
  monto_pagar: number;
  monto_letras?: string;
  numero_documento_origen: string;
  concepto_nota: string;
  responsable_unidad: string;
  banco_id?: {
    _id: string;
    nombre: string;
  };
  numero_cuenta?: string;
  cci?: string;
  datos_estaticos: {
    dependencia_solicitante: string;
    persona_contacto: string;
    anexo: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface RecibidosPdfProps {
  isOpen: boolean;
  onClose: () => void;
  nota: NotaCredito | null;
}

// Componente PDF Document
const NotaCreditoPDF = ({ nota }: { nota: NotaCredito }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };


  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.headerTable}>
          <View style={styles.headerRow}>
            <View style={styles.logoCell}>
              <Image
                src="/logo.png"
                style={{ width: 70, height: 70, objectFit: 'contain' }}
              />
            </View>
            <View style={styles.titleCell}>
              <Text style={styles.infoText}>UNIDAD DE GESTIÓN GOBIERNO Y ADMINISTRACIÓN</Text>
              <Text style={styles.infoText}>DIRECCIÓN GENERAL DE ADMINISTRACIÓN</Text>
              <Text style={styles.infoText}>SISTEMA DE GESTIÓN DE LA CALIDAD</Text>
              <Text style={styles.infoText}><Text style={{ fontWeight: 'bold' }}>SOLICITUD DE EMISIÓN NOTA DE CRÉDITO</Text></Text>
              <Text style={styles.infoText}>(Bienes, servicios, proyectos, protocolos y otros)</Text>
            </View>
            <View style={styles.infoCell}>
              <Text style={styles.infoText}><Text style={{ fontWeight: 'bold' }}>Código:</Text> F-1-C-E-12</Text>
              <Text style={styles.infoText}><Text style={{ fontWeight: 'bold' }}>Versión:</Text> 10 - {new Date(nota.createdAt).toLocaleDateString('es-ES')}</Text>
              <Text style={styles.infoText}><Text style={{ fontWeight: 'bold' }}>División:</Text> Finanzas</Text>
              <Text style={styles.infoText}><Text style={{ fontWeight: 'bold' }}>Página:</Text> 1 de 1</Text>
            </View>
          </View>
        </View>

        {/* TIPO COMPROBANTE */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableHeaderCell, { width: '25%' }]}>
              <Text>TIPO COMPROBANTE</Text>
            </View>
            <View style={[styles.tableDataCell, { width: '75%' }]}>
              <Text style={{ fontWeight: 'bold' }}>
                {nota.tipo === 'JURIDICA' ? 'FACTURA' : nota.tipo === 'NATURAL' ? 'BOLETA DE VENTA' : 'NO DEFINIDO'}
              </Text>
            </View>
          </View>
        </View>

        {/* DATOS */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableHeaderCell, { width: '25%' }]}>
              <Text>{nota.tipo === 'JURIDICA' ? 'Razón Social' : 'Nombre Completo'}</Text>
            </View>
            <View style={[styles.tableDataCell, { width: '75%' }]}>
              <Text>{nota.nombre_completo}</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={[styles.tableHeaderCell, { width: '25%' }]}>
              <Text>{nota.tipo === 'JURIDICA' ? 'RUC' : 'DNI'}</Text>
            </View>
            <View style={[styles.tableDataCell, { width: '75%' }]}>
              <Text>{nota.tipo === 'JURIDICA' ? (nota.ruc || 'N/A') : (nota.dni || 'N/A')}</Text>
            </View>
          </View>

          {/* DATOS ESTÁTICOS */}
          <View style={styles.tableRow}>
            <View style={[styles.tableHeaderCell, { width: '25%' }]}>
              <Text>Dependencia Solicitante</Text>
            </View>
            <View style={[styles.tableDataCell, { width: '75%' }]}>
              <Text>{nota.datos_estaticos.dependencia_solicitante}</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={[styles.tableHeaderCell, { width: '25%' }]}>
              <Text>Persona de Contacto</Text>
            </View>
            <View style={[styles.tableDataCell, { width: '40%' }]}>
              <Text>{nota.datos_estaticos.persona_contacto}</Text>
            </View>
            <View style={[styles.tableHeaderCell, { width: '10%', textAlign: 'center' }]}>
              <Text>Anexo</Text>
            </View>
            <View style={[styles.tableDataCell, { width: '25%' }]}>
              <Text>{nota.datos_estaticos.anexo}</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={[styles.tableHeaderCell, { width: '25%' }]}>
              <Text>Monto a Pagar</Text>
            </View>
            <View style={[styles.tableDataCell, { width: '75%' }]}>
              <Text style={styles.montoText}>S/ {nota.monto_pagar.toFixed(2)}</Text>
              {nota.monto_letras && (
                <Text style={styles.montoLetrasText}>{nota.monto_letras}</Text>
              )}
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={[styles.tableHeaderCell, { width: '25%' }]}>
              <Text>N° Documento de Origen</Text>
            </View>
            <View style={[styles.tableDataCell, { width: '75%' }]}>
              <Text>{nota.numero_documento_origen}</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={[styles.tableHeaderCell, { width: '25%' }]}>
              <Text>Concepto de Nota de Crédito</Text>
            </View>
            <View style={[styles.tableDataCell, { width: '75%' }]}>
              <Text>{nota.concepto_nota}</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={[styles.tableHeaderCell, { width: '25%' }]}>
              <Text>Responsable de la Unidad</Text>
            </View>
            <View style={[styles.tableDataCell, { width: '75%' }]}>
              <Text>{nota.responsable_unidad}</Text>
            </View>
          </View>
        </View>

        {/* TRANSFERENCIA */}
        <View style={styles.signatureRow}>
          <View style={styles.signatureLeft}>
            <Text style={styles.signatureTitle}>APLICACIÓN DE LA NOTA DE CRÉDITO</Text>
            <Text style={styles.signatureTitle}>TRANSFERENCIA BANCARIA</Text>
            <Text style={styles.signatureText}>Banco: {nota.banco_id?.nombre || 'No especificado'}</Text>
            <Text style={styles.signatureText}>Cuenta: {nota.numero_cuenta || 'No especificada'}</Text>
            <Text style={styles.signatureText}>CCI: {nota.cci || 'No especificado'}</Text>
          </View>
          <View style={styles.signatureRight}>
            <Text style={styles.signatureTitle}>FIRMA Y SELLO DEL RESPONSABLE DE LA UNIDAD</Text>
            <Image
              src="/firma.jpg"
              style={{
                width: 120,
                height: 60,
                objectFit: 'contain',
                marginTop: 20,
                alignSelf: 'center'
              }}
            />
          </View>
        </View>

      </Page>
    </Document>
  );
};

export function RecibidosPdf({ isOpen, onClose, nota }: RecibidosPdfProps) {
  if (!nota) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Nota de Crédito - ${nota.nombre_completo}`}
      size="xl"
    >
      <div className="w-full h-[80vh]">
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <NotaCreditoPDF nota={nota} />
        </PDFViewer>
      </div>
    </Modal>
  );
}