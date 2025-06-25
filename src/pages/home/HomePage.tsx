import React from 'react';

export function HomePage() {
  return (
    <div className="min-vh-100 bg-light ">
      {/* Hero Section */}
      <div className="bg-info text-white position-relative overflow-hidden">
        <div className="position-absolute top-0 end-0 p-4">
          <div className="rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
            <div className="text-uppercase fw-bold small">UCR</div>
          </div>
        </div>

        <div className="container py-5">
          <div className="col-lg-8">
            <h1 className="display-4 fw-bold mb-4">OrientaUCR</h1>
            <p className="fs-5 mb-4">
              La Universidad de Costa Rica te acompaña en tu proceso de admisión con herramientas especializadas 
              para orientación vocacional, simulación de pruebas académicas y acceso a información sobre becas.
            </p>
            <p className="fs-6">
              <strong>Institución Benemérita de la Patria</strong> - Tu futuro académico comienza aquí
            </p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="mb-3 fw-bold">Servicios de Orientación</h2>
          <p className="text-muted mb-5 mx-auto" style={{ maxWidth: '600px' }}>
            OrientaUCR cuenta con <strong>4 servicios principales</strong> que te guían en tu camino hacia la educación superior.
          </p>

          <div className="row g-4">
            {/* Test Vocacional */}
            <div className="col-md-6">
              <div className="card text-white bg-info h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <i className="bi bi-bullseye fs-2"></i>
                    <i className="bi bi-chevron-right fs-5"></i>
                  </div>
                  <h5 className="card-title fw-bold">Test Vocacional</h5>
                  <p className="card-text">
                    Descubre tu vocación y las carreras que mejor se adaptan a tus intereses, habilidades y personalidad a través de evaluaciones especializadas.
                  </p>
                  <span className="badge bg-light text-dark mt-3">Orientación Personalizada</span>
                </div>
              </div>
            </div>

            {/* Simulación de Pruebas */}
            <div className="col-md-6">
              <div className="card text-white bg-success h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <i className="bi bi-file-earmark-text fs-2"></i>
                    <i className="bi bi-chevron-right fs-5"></i>
                  </div>
                  <h5 className="card-title fw-bold">Prueba Simulada</h5>
                  <p className="card-text">
                    Practica con exámenes similares a las pruebas de admisión reales. Familiarízate con el formato y evalúa tu nivel de preparación.
                  </p>
                  <span className="badge bg-light text-dark mt-3">Preparación Académica</span>
                </div>
              </div>
            </div>

            {/* Carreras */}
            <div className="col-md-6">
              <div className="card text-white bg-secondary h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <i className="bi bi-mortarboard fs-2"></i>
                    <i className="bi bi-chevron-right fs-5"></i>
                  </div>
                  <h5 className="card-title fw-bold">Carreras UCR</h5>
                  <p className="card-text">
                    Explora todas las carreras disponibles en la UCR, sus requisitos de admisión, perfiles profesionales y oportunidades laborales.
                  </p>
                  <span className="badge bg-light text-dark mt-3">Información Académica</span>
                </div>
              </div>
            </div>

            {/* Becas */}
            <div className="col-md-6">
              <div className="card text-white bg-warning h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <i className="bi bi-award fs-2"></i>
                    <i className="bi bi-chevron-right fs-5"></i>
                  </div>
                  <h5 className="card-title fw-bold">Becas y Ayudas</h5>
                  <p className="card-text">
                    Conoce las opciones de apoyo financiero disponibles, requisitos para becas y programas de ayuda estudiantil de la UCR.
                  </p>
                  <span className="badge bg-light text-dark mt-3">Apoyo Financiero</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <h3 className="text-primary fw-bold">50+</h3>
              <p className="text-muted">Carreras Disponibles</p>
            </div>
            <div className="col-md-4 mb-4">
              <h3 className="text-info fw-bold">15,000+</h3>
              <p className="text-muted">Estudiantes Orientados</p>
            </div>
            <div className="col-md-4 mb-4">
              <h3 className="text-success fw-bold">85%</h3>
              <p className="text-muted">Tasa de Satisfacción</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white text-primary py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-3">¿Listo para comenzar tu futuro académico?</h2>
          <p className="lead text-secondary mb-4">La UCR te espera. Comienza tu proceso de orientación hoy mismo.</p>
          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <button className="btn btn-info text-white px-4">Realizar Test Vocacional</button>
            <button className="btn btn-outline-primary px-4">Explorar Carreras</button>
          </div>
        </div>
      </section>
    </div>
  );
}
