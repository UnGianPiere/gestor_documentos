// Configurar variables de entorno antes de importar módulos
import { config } from 'dotenv';

// Cargar variables de entorno
config({ path: '.env.local' });
config({ path: '.env' });

// Configurar manualmente si no se cargaron
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb://localhost:27017/gestor_documentos_db';
}

// Ahora importar los módulos después de configurar las variables de entorno
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectToDatabase from '../src/lib/mongodb';
import User from '../src/models/User';
import FormConfiguracion from '../src/models/FormConfiguracion';
import Banco from '../src/models/Banco';

async function initDatabase() {
  try {
    console.log('Conectando a MongoDB...');
    await connectToDatabase();
    console.log('Conexión exitosa');

    // Limpiar usuarios existentes (opcional, solo para desarrollo)
    console.log('Eliminando usuarios existentes...');
    await User.deleteMany({});

    // Crear usuarios de prueba
    console.log('Creando usuarios de prueba...');

    const users = [
      {
        nombres: 'Administrador del Sistema',
        usuario: 'admin',
        email: 'admin@gestordocumentos.com',
        password: 'admin123',
        role: 'admin' as const,
        isActive: true,
      },
      {
        nombres: 'Usuario Regular',
        usuario: 'user',
        email: 'user@gestordocumentos.com',
        password: 'user123',
        role: 'user' as const,
        isActive: true,
      },
      {
        nombres: 'Usuario Solo Lectura',
        usuario: 'viewer',
        email: 'viewer@gestordocumentos.com',
        password: 'viewer123',
        role: 'viewer' as const,
        isActive: true,
      },
    ];

    for (const userData of users) {
      // Hashear la contraseña
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      const user = new User({
        ...userData,
        password: hashedPassword,
      });
      await user.save();
      console.log(`Usuario creado: ${userData.usuario}`);
    }

    // Crear configuración del formulario
    console.log('Creando configuración del formulario...');
    const formConfig = new FormConfiguracion({
      dependencia_solicitante: 'ESCUELA DE POSGRADO',
      persona_contacto: 'YVONNE MACHICADO ZUÑIGA',
      anexo: '210204',
      activo: true,
    });
    await formConfig.save();
    console.log('Configuración del formulario creada');

    // Crear bancos de prueba
    console.log('Creando bancos...');
    const bancos = [
      { nombre: 'BANCO DE CRÉDITO DEL PERÚ', activo: true },
      { nombre: 'BANCO CONTINENTAL', activo: true },
      { nombre: 'BANCO PICHINCHA', activo: true },
      { nombre: 'BANCO INTERBANK', activo: true },
      { nombre: 'BANCO DE LA NACIÓN', activo: true },
      { nombre: 'BANCO SCOTIABANK', activo: true },
    ];

    for (const bancoData of bancos) {
      const banco = new Banco(bancoData);
      await banco.save();
    }
    console.log(`${bancos.length} bancos creados`);

    console.log('Base de datos inicializada correctamente');
    console.log('\nCredenciales de acceso:');
    console.log('Admin: usuario: admin, contraseña: admin123');
    console.log('Usuario: usuario: user, contraseña: user123');
    console.log('Viewer: usuario: viewer, contraseña: viewer123');

    console.log('\nDatos de configuración:');
    console.log('Dependencia: ESCUELA DE POSGRADO');
    console.log('Persona Contacto: YVONNE MACHICADO ZUÑIGA');
    console.log('Anexo: 210204');

  } catch (error) {
    console.error('Error inicializando la base de datos:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Conexión cerrada');
  }
}

// Ejecutar el script
initDatabase();
