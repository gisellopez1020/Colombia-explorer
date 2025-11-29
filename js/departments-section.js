const departmentIcons = {
  capital: '<i class="fas fa-city"></i>',
  population: '<i class="fas fa-users"></i>',
  surface: '<i class="fas fa-map"></i>',
  municipalities: '<i class="fas fa-building"></i>',
  phone: '<i class="fas fa-phone"></i>'
};

let departmentsData = [];

export default function renderDepartmentData(data) {
  departmentsData = data;
  document.getElementById("general-info").innerHTML = `
    <section class="departments-section">
      <div class="departments-grid">
        ${data.map(department => renderDepartmentCard(department)).join("")}
      </div>
    </section>
  `;
}

function renderDepartmentCard(dept) {
  return `
    <article class="department-card" data-department-id="${dept.id}" aria-labelledby="dept-title-${dept.id}">
      <header class="department-header">
        <h3 id="dept-title-${dept.id}">${dept.name}</h3>
      </header>

      <p class="department-description">${dept.description}</p>

      <dl class="department-stats" aria-label="Estadísticas del departamento">
        <div class="stat" role="group">
          <dt aria-hidden="true">${departmentIcons.capital}</dt>
          <dd>
            ${dept.cityCapital?.name || 'N/A'}
          </dd>
        </div>
        <div class="stat" role="group">
          <dt aria-hidden="true">${departmentIcons.population}</dt>
          <dd>
            ${dept.population.toLocaleString('es-CO')}
          </dd>
        </div>
        <div class="stat" role="group">
          <dt aria-hidden="true">${departmentIcons.municipalities}</dt>
          <dd>
            ${dept.municipalities} municipios
          </dd>
        </div>
      </dl>

      <button class="btn-details" onclick="showDepartmentDetails(${dept.id})" aria-label="Ver más detalles de ${dept.name}">
        <span>Ver más detalles</span>
        <i class="fas fa-arrow-right" aria-hidden="true"></i>
      </button>
    </article>
  `;
}

function showDepartmentDetails(departmentId) {
  const dept = departmentsData.find(d => d.id === departmentId);
  if (!dept) return;

  // Modal con toda la información
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <article class="modal-content">
      <button class="modal-close" onclick="this.parentElement.parentElement.remove()" aria-label="Cerrar ventana de detalles">
        <i class="fas fa-times" aria-hidden="true"></i>
      </button>

      <header class="modal-header">
        <h2 id="modal-title">${dept.name}</h2>
      </header>

      <div class="modal-body">
        <section aria-label="Descripción del departamento">
          <p class="full-description">${dept.description}</p>
        </section>

        <section class="detail-section" aria-labelledby="general-info-heading">
          <h3 id="general-info-heading">Información General</h3>
          <dl class="detail-grid">
            <div class="detail-item">
              <dt aria-hidden="true">${departmentIcons.capital}</dt>
              <dd>
                <span class="label">Capital</span>
                <span class="value">${dept.cityCapital?.name || 'N/A'}</span>
              </dd>
            </div>
            <div class="detail-item">
              <dt aria-hidden="true">${departmentIcons.population}</dt>
              <dd>
                <span class="label">Población</span>
                <span class="value">${dept.population.toLocaleString('es-CO')} habitantes</span>
              </dd>
            </div>
            <div class="detail-item">
              <dt aria-hidden="true">${departmentIcons.surface}</dt>
              <dd>
                <span class="label">Superficie</span>
                <span class="value">${dept.surface.toLocaleString('es-CO')} km²</span>
              </dd>
            </div>
            <div class="detail-item">
              <dt aria-hidden="true">${departmentIcons.municipalities}</dt>
              <dd>
                <span class="label">Municipios</span>
                <span class="value">${dept.municipalities}</span>
              </dd>
            </div>
            <div class="detail-item">
              <dt aria-hidden="true">${departmentIcons.phone}</dt>
              <dd>
                <span class="label">Prefijo telefónico</span>
                <span class="value">+57 ${dept.phonePrefix}</span>
              </dd>
            </div>
          </dl>
        </section>

        ${dept.cityCapital ? `
          <section class="detail-section" aria-labelledby="capital-info-heading">
            <h3 id="capital-info-heading">Sobre ${dept.cityCapital.name}</h3>
            <p>${dept.cityCapital.description}</p>
            <dl class="capital-stats" role="list">
              <div class="stat-box" role="listitem">
                <dt aria-hidden="true"><i class="fas fa-users"></i></dt>
                <dd>
                  <span>${dept.cityCapital.population.toLocaleString('es-CO')}</span>
                  <small>Habitantes</small>
                </dd>
              </div>
              <div class="stat-box" role="listitem">
                <dt aria-hidden="true"><i class="fas fa-map"></i></dt>
                <dd>
                  <span>${dept.cityCapital.surface.toLocaleString('es-CO')} km²</span>
                  <small>Superficie</small>
                </dd>
              </div>
              <div class="stat-box" role="listitem">
                <dt aria-hidden="true"><i class="fas fa-envelope"></i></dt>
                <dd>
                  <span>${dept.cityCapital.postalCode}</span>
                  <small>Código postal</small>
                </dd>
              </div>
            </dl>
          </section>
        ` : ''}
      </div>
    </article>
  `;

  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Exponer función globalmente para uso con onclick
window.showDepartmentDetails = showDepartmentDetails;