import { FileText, Clock, CheckCircle, FolderKanban, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-on-content-bg-heading)] mb-2">
          Dashboard - Gestor de Documentos
        </h1>
        <p className="text-[var(--text-secondary)] text-lg">
          Panel de control principal del sistema de gestión de documentos.
        </p>
      </div>

      <div className="space-y-8">
        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[var(--card-bg)] p-6 rounded-lg card-shadow-hover transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">Formularios Recibidos</p>
                <p className="text-3xl font-bold text-[var(--text-on-content-bg-heading)]">0</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] p-6 rounded-lg card-shadow-hover transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">Formularios Pendientes</p>
                <p className="text-3xl font-bold text-[var(--text-on-content-bg-heading)]">0</p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] p-6 rounded-lg card-shadow-hover transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">Formularios Revisados</p>
                <p className="text-3xl font-bold text-[var(--text-on-content-bg-heading)]">0</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] p-6 rounded-lg card-shadow-hover transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">Estructuras Creadas</p>
                <p className="text-3xl font-bold text-[var(--text-on-content-bg-heading)]">0</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <FolderKanban className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Secciones principales */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[var(--card-bg)] p-8 rounded-lg card-shadow-hover transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--text-on-content-bg-heading)]">
                Estructura de Formularios
              </h3>
            </div>
            <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
              Crea y administra la estructura de los formularios que recibirán los usuarios. Define campos, validaciones y flujos de trabajo.
            </p>
            <a
              href="/formularios-estructura"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 transition-all duration-300 font-medium group-hover:shadow-lg"
            >
              Ir a Estructura
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <div className="bg-[var(--card-bg)] p-8 rounded-lg card-shadow-hover transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--text-on-content-bg-heading)]">
                Formularios Recibidos
              </h3>
            </div>
            <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
              Gestiona y administra todos los formularios que han sido enviados por los usuarios. Revisa, aprueba y procesa las solicitudes.
            </p>
            <a
              href="/formularios-recibidos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 transition-all duration-300 font-medium group-hover:shadow-lg"
            >
              Ver Formularios
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Próximas funcionalidades */}
        <div className="bg-[var(--card-bg)] p-8 rounded-lg card-shadow-hover transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-on-content-bg-heading)]">
              Próximas Funcionalidades
            </h3>
          </div>
          <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
            Funcionalidades que estarán disponibles en futuras versiones del sistema. Mantente al día con las mejoras y nuevas características.
          </p>
          <a
            href="/proximas-funcionalidades"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--secondary)] text-[var(--secondary-foreground)] rounded-lg hover:bg-[var(--secondary)]/80 transition-all duration-300 font-medium"
          >
            Ver Funcionalidades
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
