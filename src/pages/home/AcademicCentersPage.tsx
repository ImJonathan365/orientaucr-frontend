import React from 'react';

 export function AcademicCentersPage() {
  return (
    <div>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
      
      {/* Hero Section */}
      <div className="bg-info  text-white py-5 mb-5">
        <div className="container">
           <div className="col-lg-4 text-center ms-auto">
              <img 
                src="https://th.bing.com/th/id/R.6d153ac21e77bd41572652d4905ea3f5?rik=Rw1SGRPdLK%2bG2w&pid=ImgRaw&r=0" 
                alt="Logo UCR" 
                className="img-fluid"
                style={{maxHeight: '120px'}}
              />
            </div>
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-3">Centros Académicos</h1>
              <p className="lead mb-4">
                La Universidad de Costa Rica se organiza en áreas académicas especializadas, 
                cada una dedicada a la excelencia en investigación, docencia y acción social.
              </p>
              <p className="mb-0">
                <strong>Institución Benemérita de la Patria</strong> - Pilar de la Investigación, 
                la Docencia y la Acción Social
              </p>
            </div>
           
          </div>
        </div>
      </div>

      <div className="container">
        {/* Introduction */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="text-center mb-4">
              <h2 className="h1 text-primary mb-3">Estructura Académica</h2>
              <p className="lead text-muted">
                La UCR cuenta con <strong>6 áreas del saber</strong> que agrupan facultades, 
                escuelas y centros de investigación de excelencia académica.
              </p>
            </div>
          </div>
        </div>

        {/* Academic Areas */}
        <div className="row g-4 mb-5">
          {/* Ciencias Sociales */}
          <div className="col-lg-6 col-md-12">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-header bg-primary text-white">
                <h3 className="card-title mb-0">
                  <i className="fas fa-users me-2"></i>Ciencias Sociales
                </h3>
              </div>
              <div className="card-body">
                <p className="card-text">
                  Área dedicada al estudio de la sociedad, las relaciones humanas y los fenómenos sociales.
                </p>
                <ul className="list-unstyled">
                  <li><i className="fas fa-chevron-right text-primary me-2"></i>Facultad de Ciencias Sociales</li>
                  <li><i className="fas fa-chevron-right text-primary me-2"></i>Escuela de Antropología</li>
                  <li><i className="fas fa-chevron-right text-primary me-2"></i>Escuela de Ciencias Políticas</li>
                  <li><i className="fas fa-chevron-right text-primary me-2"></i>Escuela de Geografía</li>
                  <li><i className="fas fa-chevron-right text-primary me-2"></i>Escuela de Historia</li>
                  <li><i className="fas fa-chevron-right text-primary me-2"></i>Escuela de Psicología</li>
                  <li><i className="fas fa-chevron-right text-primary me-2"></i>Escuela de Sociología</li>
                  <li><i className="fas fa-chevron-right text-primary me-2"></i>Escuela de Trabajo Social</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Artes y Letras */}
          <div className="col-lg-6 col-md-12">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-header bg-success text-white">
                <h3 className="card-title mb-0">
                  <i className="fas fa-palette me-2"></i>Artes y Letras
                </h3>
              </div>
              <div className="card-body">
                <p className="card-text">
                  Formación integral en humanidades, artes, comunicación y lenguas.
                </p>
                <ul className="list-unstyled">
                  <li><i className="fas fa-chevron-right text-success me-2"></i>Facultad de Letras</li>
                  <li><i className="fas fa-chevron-right text-success me-2"></i>Escuela de Artes Dramáticas</li>
                  <li><i className="fas fa-chevron-right text-success me-2"></i>Escuela de Artes Musicales</li>
                  <li><i className="fas fa-chevron-right text-success me-2"></i>Escuela de Artes Plásticas</li>
                  <li><i className="fas fa-chevron-right text-success me-2"></i>Escuela de Comunicación Colectiva</li>
                  <li><i className="fas fa-chevron-right text-success me-2"></i>Escuela de Filología, Lingüística y Literatura</li>
                  <li><i className="fas fa-chevron-right text-success me-2"></i>Escuela de Filosofía</li>
                  <li><i className="fas fa-chevron-right text-success me-2"></i>Escuela de Lenguas Modernas</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Ciencias Básicas */}
          <div className="col-lg-6 col-md-12">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-header bg-info text-white">
                <h3 className="card-title mb-0">
                  <i className="fas fa-atom me-2"></i>Ciencias Básicas
                </h3>
              </div>
              <div className="card-body">
                <p className="card-text">
                  Investigación y enseñanza en matemáticas, física, química y ciencias naturales.
                </p>
                <ul className="list-unstyled">
                  <li><i className="fas fa-chevron-right text-info me-2"></i>Facultad de Ciencias</li>
                  <li><i className="fas fa-chevron-right text-info me-2"></i>Escuela de Biología</li>
                  <li><i className="fas fa-chevron-right text-info me-2"></i>Escuela de Física</li>
                  <li><i className="fas fa-chevron-right text-info me-2"></i>Escuela de Geología</li>
                  <li><i className="fas fa-chevron-right text-info me-2"></i>Escuela de Matemática</li>
                  <li><i className="fas fa-chevron-right text-info me-2"></i>Escuela de Química</li>
                  <li><i className="fas fa-chevron-right text-info me-2"></i>Centro de Investigación en Ciencias del Mar y Limnología (CIMAR)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Ciencias Agroalimentarias */}
          <div className="col-lg-6 col-md-12">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-header bg-warning text-white">
                <h3 className="card-title mb-0">
                  <i className="fas fa-seedling me-2"></i>Ciencias Agroalimentarias
                </h3>
              </div>
              <div className="card-body">
                <p className="card-text">
                  Desarrollo sostenible en agricultura, tecnología de alimentos y recursos naturales.
                </p>
                <ul className="list-unstyled">
                  <li><i className="fas fa-chevron-right text-warning me-2"></i>Facultad de Ciencias Agroalimentarias</li>
                  <li><i className="fas fa-chevron-right text-warning me-2"></i>Escuela de Agronomía</li>
                  <li><i className="fas fa-chevron-right text-warning me-2"></i>Escuela de Economía Agrícola y Agronegocios</li>
                  <li><i className="fas fa-chevron-right text-warning me-2"></i>Escuela de Tecnología de Alimentos</li>
                  <li><i className="fas fa-chevron-right text-warning me-2"></i>Escuela de Zootecnia</li>
                  <li><i className="fas fa-chevron-right text-warning me-2"></i>Centro de Investigación en Granos y Semillas (CIGRAS)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Ingenierías */}
          <div className="col-lg-6 col-md-12">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-header bg-secondary text-white">
                <h3 className="card-title mb-0">
                  <i className="fas fa-cogs me-2"></i>Ingenierías
                </h3>
              </div>
              <div className="card-body">
                <p className="card-text">
                  Formación de ingenieros para el desarrollo tecnológico y la innovación.
                </p>
                <ul className="list-unstyled">
                  <li><i className="fas fa-chevron-right text-secondary me-2"></i>Facultad de Ingeniería</li>
                  <li><i className="fas fa-chevron-right text-secondary me-2"></i>Escuela de Ingeniería Civil</li>
                  <li><i className="fas fa-chevron-right text-secondary me-2"></i>Escuela de Ingeniería Eléctrica</li>
                  <li><i className="fas fa-chevron-right text-secondary me-2"></i>Escuela de Ingeniería Industrial</li>
                  <li><i className="fas fa-chevron-right text-secondary me-2"></i>Escuela de Ingeniería Mecánica</li>
                  <li><i className="fas fa-chevron-right text-secondary me-2"></i>Escuela de Ciencias de la Computación e Informática</li>
                  <li><i className="fas fa-chevron-right text-secondary me-2"></i>Escuela de Ingeniería Química</li>
                  <li><i className="fas fa-chevron-right text-secondary me-2"></i>Escuela de Arquitectura</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Salud */}
          <div className="col-lg-6 col-md-12">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-header bg-danger text-white">
                <h3 className="card-title mb-0">
                  <i className="fas fa-heartbeat me-2"></i>Salud
                </h3>
              </div>
              <div className="card-body">
                <p className="card-text">
                  Formación de profesionales para la atención integral de la salud.
                </p>
                <ul className="list-unstyled">
                  <li><i className="fas fa-chevron-right text-danger me-2"></i>Facultad de Medicina</li>
                  <li><i className="fas fa-chevron-right text-danger me-2"></i>Facultad de Odontología</li>
                  <li><i className="fas fa-chevron-right text-danger me-2"></i>Facultad de Farmacia</li>
                  <li><i className="fas fa-chevron-right text-danger me-2"></i>Escuela de Enfermería</li>
                  <li><i className="fas fa-chevron-right text-danger me-2"></i>Escuela de Medicina</li>
                  <li><i className="fas fa-chevron-right text-danger me-2"></i>Escuela de Nutrición</li>
                  <li><i className="fas fa-chevron-right text-danger me-2"></i>Escuela de Salud Pública</li>
                  <li><i className="fas fa-chevron-right text-danger me-2"></i>Escuela de Tecnologías en Salud</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Special Centers */}
        <div className="row mb-5">
          <div className="col-12">
            <h2 className="text-primary mb-4">Centros y Escuelas Especiales</h2>
          </div>
          
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <i className="fas fa-graduation-cap fa-3x text-primary mb-3"></i>
                <h4 className="card-title">Escuela de Estudios Generales</h4>
                <p className="card-text">
                  Formación humanística interdisciplinaria que fundamenta la educación universitaria 
                  con perspectiva crítica y humanista.
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <i className="fas fa-chalkboard-teacher fa-3x text-success mb-3"></i>
                <h4 className="card-title">Facultad de Educación</h4>
                <p className="card-text">
                  Formación de educadores innovadores comprometidos con la transformación 
                  del sistema educativo costarricense.
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <i className="fas fa-chart-line fa-3x text-warning mb-3"></i>
                <h4 className="card-title">Facultad de Ciencias Económicas</h4>
                <p className="card-text">
                  Formación en administración, economía y estadística para el desarrollo 
                  económico y social del país.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Campus Information */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light">
                <h3 className="card-title mb-0 text-primary">
                  <i className="fas fa-university me-2"></i>Campus Universitarios
                </h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-6">
                    <h5 className="text-primary">Campus Principal</h5>
                    <p>
                      <strong>Ciudad Universitaria Rodrigo Facio Brenes</strong><br />
                      Ubicada en Montes de Oca, San José. Sede central que concentra 
                      la mayoría de facultades y escuelas.
                    </p>
                    <h5 className="text-primary mt-4">Sedes Regionales</h5>
                    <ul className="list-unstyled">
                      <li><i className="fas fa-map-marker-alt text-primary me-2"></i>Sede del Atlántico</li>
                      <li><i className="fas fa-map-marker-alt text-primary me-2"></i>Sede de Guanacaste</li>
                      <li><i className="fas fa-map-marker-alt text-primary me-2"></i>Sede del Pacífico</li>
                      <li><i className="fas fa-map-marker-alt text-primary me-2"></i>Sede de Occidente</li>
                    </ul>
                  </div>
                  <div className="col-lg-6">
                    <h5 className="text-primary">Recintos</h5>
                    <ul className="list-unstyled">
                      <li><i className="fas fa-map-marker-alt text-success me-2"></i>Recinto de Golfito</li>
                      <li><i className="fas fa-map-marker-alt text-success me-2"></i>Recinto de Paraíso</li>
                      <li><i className="fas fa-map-marker-alt text-success me-2"></i>Recinto de Tacares</li>
                      <li><i className="fas fa-map-marker-alt text-success me-2"></i>Recinto de Turrialba</li>
                      <li><i className="fas fa-map-marker-alt text-success me-2"></i>Recinto de Guapiles</li>
                    </ul>
                    <h5 className="text-primary mt-4">Centros Académicos</h5>
                    <ul className="list-unstyled">
                      <li><i className="fas fa-map-marker-alt text-info me-2"></i>Centro Académico de San Ramón</li>
                      <li><i className="fas fa-map-marker-alt text-info me-2"></i>Sede Interuniversitaria de Alajuela</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="row mb-5">
          <div className="col-12">
            <h2 className="text-primary mb-4 text-center">UCR en Números</h2>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="text-center">
              <div className="display-4 text-primary fw-bold">300+</div>
              <p className="lead">Carreras de Grado</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="text-center">
              <div className="display-4 text-success fw-bold">200+</div>
              <p className="lead">Posgrados</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="text-center">
              <div className="display-4 text-warning fw-bold">45,000+</div>
              <p className="lead">Estudiantes</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="text-center">
              <div className="display-4 text-info fw-bold">6,000+</div>
              <p className="lead">Funcionarios</p>
            </div>
          </div>
        </div>

        {/* Excellence Recognition */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm bg-light">
              <div className="card-body text-center py-5">
                <h2 className="display-5 text-primary mb-3">Excelencia Académica Reconocida</h2>
                <p className="lead mb-4">
                  La UCR ocupa el <strong>primer lugar en América Central y el Caribe</strong> 
                  según QS-Quacquarelli Symonds, el <strong>puesto 16 en América Latina</strong> 
                  y el <strong>lugar 497 a nivel mundial</strong>.
                </p>
                <div className="row justify-content-center">
                  <div className="col-md-4 mb-3">
                    <i className="fas fa-trophy fa-2x text-warning mb-2"></i>
                    <p className="fw-bold mb-0">#1 Centroamérica</p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <i className="fas fa-medal fa-2x text-success mb-2"></i>
                    <p className="fw-bold mb-0">#16 América Latina</p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <i className="fas fa-globe fa-2x text-primary mb-2"></i>
                    <p className="fw-bold mb-0">#497 Mundial</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <h2 className="text-primary mb-3">¿Listo para formar parte de la UCR?</h2>
                <p className="lead text-muted mb-4">
                  Descubre las oportunidades académicas que tenemos para ti en nuestros 
                  centros de excelencia educativa.
                </p>
                <div className="row justify-content-center">
                  <div className="col-md-3 mb-3">
                    <button className="btn btn-primary btn-lg w-100">
                      <i className="fas fa-search me-2"></i>Explorar Carreras
                    </button>
                  </div>
                  <div className="col-md-3 mb-3">
                    <button className="btn btn-outline-primary btn-lg w-100">
                      <i className="fas fa-calendar-alt me-2"></i>Proceso de Admisión
                    </button>
                  </div>
                  <div className="col-md-3 mb-3">
                    <button className="btn btn-outline-primary btn-lg w-100">
                      <i className="fas fa-info-circle me-2"></i>Más Información
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
