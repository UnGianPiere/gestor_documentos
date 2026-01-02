export default function FormulariosEstructuraPage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-on-content-bg-heading)] mb-2">
            Estructura de Formularios
          </h1>
          <p className="text-[var(--text-secondary)]">
            Crea y administra la estructura de los formularios que recibirán los usuarios.
          </p>
        </div>

        <div className="bg-[var(--card-bg)] p-6 rounded-lg card-shadow-hover transition-colors duration-300">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-[var(--text-on-content-bg-heading)] mb-2">
              Constructor de Formularios
            </h2>
            <p className="text-[var(--text-secondary)] mb-6">
              Aquí podrás crear y editar la estructura de los formularios que los usuarios rellenarán.
            </p>
            <div className="text-sm text-[var(--text-secondary)] bg-[var(--content-bg)] p-4 rounded-lg">
              Funcionalidad en desarrollo - Próximamente disponible
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


