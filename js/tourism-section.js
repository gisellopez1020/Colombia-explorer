const tourismIcons = {
  location: '<i class="fas fa-map-marker-alt"></i>',
  city: '<i class="fas fa-city"></i>',
  department: '<i class="fas fa-map"></i>',
  coordinates: '<i class="fas fa-compass"></i>'
};

let tourismData = [];
let currentTourismIndex = 0;

export default function renderTourismData(data) {
  tourismData = data;
  currentTourismIndex = 0;
  document.getElementById("general-info").innerHTML = `
    <section class="tourism-section" aria-label="Atracciones turísticas de Colombia">
      <div class="gallery-container">
        <button class="gallery-nav gallery-prev" onclick="previousAttraction()" aria-label="Atracción anterior">
          <i class="fas fa-chevron-left"></i>
        </button>
        
        <div class="gallery-content" id="gallery-content">
          ${renderTourismCard(data[0], 0, data.length)}
        </div>
        
        <button class="gallery-nav gallery-next" onclick="nextAttraction()" aria-label="Siguiente atracción">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      
      <div class="gallery-indicators" id="gallery-indicators">
        ${data.map((_, index) => `
          <button class="indicator ${index === 0 ? 'active' : ''}" 
                  onclick="goToAttraction(${index})" 
                  aria-label="Ir a atracción ${index + 1}">
          </button>
        `).join('')}
      </div>
    </section>
  `;
}

function previousAttraction() {
  if (currentTourismIndex > 0) {
    currentTourismIndex--;
    updateGallery();
  }
}

function nextAttraction() {
  if (currentTourismIndex < tourismData.length - 1) {
    currentTourismIndex++;
    updateGallery();
  }
}

function goToAttraction(index) {
  currentTourismIndex = index;
  updateGallery();
}

function updateGallery() {
  const galleryContent = document.getElementById('gallery-content');
  const indicators = document.querySelectorAll('.indicator');
  
  galleryContent.style.opacity = '0';
  galleryContent.style.transform = 'translateX(20px)';
  
  setTimeout(() => {
    galleryContent.innerHTML = renderTourismCard(tourismData[currentTourismIndex], currentTourismIndex, tourismData.length);
    galleryContent.style.opacity = '1';
    galleryContent.style.transform = 'translateX(0)';
  }, 200);
  
  indicators.forEach((indicator, index) => {
    if (index === currentTourismIndex) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });
  
  const prevBtn = document.querySelector('.gallery-prev');
  const nextBtn = document.querySelector('.gallery-next');
  
  prevBtn.disabled = currentTourismIndex === 0;
  nextBtn.disabled = currentTourismIndex === tourismData.length - 1;
}

function renderTourismCard(attraction, currentIndex, totalCount) {
  return `
    <article class="tourism-card" data-attraction-id="${attraction.id}">
      <div class="gallery-counter">
        <span>${currentIndex + 1} / ${totalCount}</span>
      </div>
      
      <div class="tourism-image-container">
        <img
          src="${attraction.images[0]}"
          alt="${attraction.name}"
          class="tourism-image"
          loading="lazy"
          onError="this.src='assets/image-placeholder.png'"
        />
      </div>

      <div class="tourism-content">
        <header>
          <h3 class="tourism-title">${attraction.name}</h3>
          
          <div class="tourism-location">
            ${tourismIcons.location}
            <span>${attraction.city?.name || 'Colombia'}</span>
          </div>
        </header>

        <p class="tourism-description">${attraction.description}</p>

        <button class="btn-more-info" onclick="showTourismDetails(${attraction.id})" aria-label="Ver más detalles de ${attraction.name}">
          <span>Ver más detalles</span>
          <i class="fas fa-info-circle" aria-hidden="true"></i>
        </button>
      </div>
    </article>
  `;
}

function showTourismDetails(attractionId) {
  const attraction = tourismData.find(a => a.id === attractionId);
  if (!attraction) return;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content modal-tourism">
      <button class="modal-close" onclick="this.parentElement.parentElement.remove()" aria-label="Cerrar modal">
        <i class="fas fa-times"></i>
      </button>

      <div class="modal-header modal-header-tourism">
        <h2>${attraction.name}</h2>
        ${attraction.city ? `
          <div class="modal-subtitle">
            <i class="fas fa-map-marker-alt"></i>
            <span>${attraction.city.name}</span>
          </div>
        ` : ''}
      </div>

      <div class="modal-body">
        <div class="tourism-detail-image">
          <img 
            src="${attraction.images[0]}" 
            alt="${attraction.name}"
            loading="lazy"
          />
        </div>

        <div class="detail-section">
          <h3>Descripción</h3>
          <p class="full-description">${attraction.description}</p>
        </div>

        ${attraction.city || attraction.latitude ? `
          <div class="detail-section">
            <h3>Ubicación</h3>
            <div class="location-info-grid">
              ${attraction.city ? `
                <div class="location-item">
                  ${tourismIcons.city}
                  <div>
                    <span class="label">Ciudad</span>
                    <span class="value">${attraction.city.name}</span>
                  </div>
                </div>
              ` : ''}
              
              ${attraction.latitude && attraction.longitude ? `
                <div class="location-item">
                  ${tourismIcons.coordinates}
                  <div>
                    <span class="label">Coordenadas</span>
                    <span class="value">${attraction.latitude}, ${attraction.longitude}</span>
                  </div>
                </div>
                <div class="map-link-container">
                  <a 
                    href="https://www.google.com/maps?q=${attraction.latitude},${attraction.longitude}" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="btn-map"
                  >
                    <i class="fas fa-map-marked-alt"></i>
                    Ver en Google Maps
                  </a>
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

window.previousAttraction = previousAttraction;
window.nextAttraction = nextAttraction;
window.goToAttraction = goToAttraction;
window.showTourismDetails = showTourismDetails;