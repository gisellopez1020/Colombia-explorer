export default function renderSpeciesData(data) {
  const infoSection = document.getElementById("general-info");

  // Agrupar especies por nivel de riesgo
  const groupedByRisk = data.reduce((acc, species) => {
    const level = species.riskLevel || 0;
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(species);
    return acc;
  }, {});

  // Ordenar por nivel de riesgo
  const sortedRiskLevels = Object.keys(groupedByRisk).sort((a, b) => b - a);

  const getRiskLabel = (level) => {
    switch(parseInt(level)) {
      case 3: return { label: 'Alto Riesgo', class: 'risk-high', icon: '🔴' };
      case 2: return { label: 'Riesgo Medio', class: 'risk-medium', icon: '🟡' };
      case 1: return { label: 'Riesgo Bajo', class: 'risk-low', icon: '🟢' };
      default: return { label: 'Sin Clasificar', class: 'risk-unknown', icon: '⚪' };
    }
  };

  let html = `
    <div class="fauna-container">
      <header class="fauna-header">
        <p class="fauna-intro">
          Colombia enfrenta desafíos en la conservación de sus ecosistemas debido a especies invasoras. 
          Conoce las especies que representan una amenaza para la biodiversidad del país.
        </p>
        <div class="fauna-stats">
          <div class="stat-item">
            <span class="stat-number">${data.length}</span>
            <span class="stat-label">Especies Registradas</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${groupedByRisk[3]?.length || 0}</span>
            <span class="stat-label">Alto Riesgo</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${groupedByRisk[2]?.length || 0}</span>
            <span class="stat-label">Riesgo Medio</span>
          </div>
        </div>
      </header>
  `;

  sortedRiskLevels.forEach(level => {
    const riskInfo = getRiskLabel(level);
    const species = groupedByRisk[level];

    html += `
      <section class="fauna-risk-section">
        <h3 class="risk-section-title ${riskInfo.class}">
          <span class="risk-icon">${riskInfo.icon}</span>
          ${riskInfo.label}
          <span class="risk-count">(${species.length} especies)</span>
        </h3>
        
        <div class="fauna-grid">
    `;

    species.forEach(specie => {
      html += `
        <article class="fauna-card ${riskInfo.class}" data-id="${specie.id}">
          <div class="fauna-card-header">
            <div class="fauna-image-container">
              <img 
                src="${specie.urlImage}" 
                alt="${specie.name}"
                class="fauna-image"
                loading="lazy"
                onerror="this.src='https://via.placeholder.com/400x300?text=Sin+Imagen'"
              />
              <span class="risk-badge ${riskInfo.class}">
                ${riskInfo.icon} ${riskInfo.label}
              </span>
            </div>
          </div>
          
          <div class="fauna-card-body">
            <h4 class="fauna-name">${specie.name}</h4>
            <p class="fauna-scientific-name">
              <i class="fas fa-dna"></i>
              <em>${specie.scientificName}</em>
            </p>
            
            <div class="fauna-common-names">
              <strong>También conocida como:</strong> ${specie.commonNames}
            </div>
            
            <button 
              class="fauna-details-btn" 
              onclick="showFaunaDetails(${specie.id})"
              aria-label="Ver detalles de ${specie.name}"
            >
              <i class="fas fa-info-circle"></i> Ver más información
            </button>
          </div>
        </article>
      `;
    });

    html += `
        </div>
      </section>
    `;
  });

  html += `</div>`;

  infoSection.innerHTML = html;

  window.showFaunaDetails = (id) => {
    const specie = data.find(s => s.id === id);
    if (!specie) return;

    const riskInfo = getRiskLabel(specie.riskLevel);

    const modalHtml = `
      <div class="modal-overlay" onclick="closeFaunaModal(event)">
        <div class="modal-content fauna-modal" onclick="event.stopPropagation()">
          <button class="modal-close" onclick="closeFaunaModal()" aria-label="Cerrar modal">
            <i class="fas fa-times"></i>
          </button>
          
          <div class="modal-header">
            <img 
              src="${specie.urlImage}" 
              alt="${specie.name}"
              class="modal-fauna-image"
              onerror="this.src='https://via.placeholder.com/800x500?text=Sin+Imagen'"
            />
            <div class="modal-risk-overlay ${riskInfo.class}">
              <span class="modal-risk-badge">
                ${riskInfo.icon} ${riskInfo.label}
              </span>
            </div>
          </div>
          
          <div class="modal-body">
            <h3 class="modal-title">${specie.name}</h3>
            <p class="modal-scientific">
              <i class="fas fa-dna"></i>
              <em>${specie.scientificName}</em>
            </p>
            
            <div class="modal-section">
              <h4><i class="fas fa-tag"></i> Nombres Comunes</h4>
              <p>${specie.commonNames}</p>
            </div>
            
            <div class="modal-section">
              <h4><i class="fas fa-exclamation-triangle"></i> Impacto Ambiental</h4>
              <p>${specie.impact}</p>
            </div>
            
            <div class="modal-section modal-manage">
              <h4><i class="fas fa-shield-alt"></i> Manejo y Control</h4>
              <p>${specie.manage}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.body.style.overflow = 'hidden';
  };

  window.closeFaunaModal = (event) => {
    if (!event || event.target === event.currentTarget || !event) {
      const modal = document.querySelector('.modal-overlay');
      if (modal) {
        modal.remove();
        document.body.style.overflow = '';
      }
    }
  };
}