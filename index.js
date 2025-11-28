const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const generalLink = document.getElementById("p-title");
const mapasLink = document.getElementById("mapas-link");
const regionesLink = document.getElementById("regiones-link");
const departamentosLink = document.getElementById("departamentos-link");
const turismoLink = document.getElementById("turismo-link");
const gastronomiaLink = document.getElementById("gastronomia-link");

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  body.classList.add("dark-mode");
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

function updatePageTitle(title) {
  const heading = document.getElementById("country-heading");
  if (heading) {
    heading.textContent = title;
  }
}

function triggerAnimation() {
  const infoSection = document.getElementById("general-info");
  if (infoSection) {
    infoSection.style.animation = "none";
    void infoSection.offsetWidth;
    infoSection.style.animation = "fadeIn 0.5s ease-in";
  }
}

generalLink.addEventListener("click", () => {
  updatePageTitle("Información General");
  fetchCountryInfo();
  setTimeout(triggerAnimation, 10);
});

mapasLink.addEventListener("click", () => {
  updatePageTitle("Mapas");
  fetchMapData();
  setTimeout(triggerAnimation, 10);
});

regionesLink.addEventListener("click", () => {
  updatePageTitle("Regiones");
  fetchRegionData();
  setTimeout(triggerAnimation, 10);
});

departamentosLink.addEventListener("click", () => {
  updatePageTitle("Departamentos");
  setTimeout(triggerAnimation, 10);
});

turismoLink.addEventListener("click", () => {
  updatePageTitle("Turismo");
  setTimeout(triggerAnimation, 10);
});

gastronomiaLink.addEventListener("click", () => {
  updatePageTitle("Gastronomía");
  setTimeout(triggerAnimation, 10);
});

// Navegación suave
const navLinks = document.querySelectorAll("nav a");
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Iconos
const icons = {
  capital: '<i class="fas fa-landmark"></i>',
  population: '<i class="fas fa-users"></i>',
  surface: '<i class="fas fa-ruler-combined"></i>',
  currency: '<i class="fas fa-coins"></i>',
  languages: '<i class="fas fa-language"></i>',
  timezone: '<i class="fas fa-clock"></i>',
  phone: '<i class="fas fa-phone"></i>',
  domain: '<i class="fas fa-globe"></i>',
};

// Llamada a la API para obtener información general del país
async function fetchCountryInfo() {
  try {
    const response = await fetch(
      "https://api-colombia.com/api/v1/Country/Colombia"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    renderCountryInfo(data);
  } catch (error) {
    console.error("Error al obtener la información del país:", error);
    showErrorMessage();
  }
}

// Llamada a la API para obtener información de los mapas
async function fetchMapData() {
  try {
    const response = await fetch(
      "https://api-colombia.com/api/v1/Map"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    renderMapData(data);
  } catch (error) {
    console.error("Error al obtener la información de los mapas:", error);
    showErrorMessage();
  }
}

// Llamada a la API para la información de regiones
async function fetchRegionData() {
  try {
    const response = await fetch(
      "https://api-colombia.com/api/v1/Region"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    renderRegionData(data);
  } catch (error) {
    console.error("Error al obtener la información de las regiones:", error);
    showErrorMessage();
  }
}

// Llamada a la API para la info de departamentos
async function fetchDepartmentData() {
  try {
    const response = await fetch(
      "https://api-colombia.com/api/v1/Department"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    renderDepartmentData(data);
  } catch (error) {
    console.error("Error al obtener la información de los departamentos:", error);
    showErrorMessage();
  }
}

// Renderizar información general
function renderCountryInfo(data) {
  updatePageTitle("Información General");
  const infoSection = document.getElementById("general-info");

  infoSection.innerHTML = `
    <header class="country-header">
      <img 
        src="${data.flags[1]}" 
        alt="Bandera de ${data.name}" 
        class="country-flag"
        loading="lazy"
      />
      <div class="country-title">
        <h3>${data.name}</h3>
        <p class="country-subtitle">
          <span class="capital">${data.stateCapital}</span> 
          <span aria-hidden="true">•</span> 
          <span class="region">${data.region}</span>
        </p>
      </div>
    </header>

    <section class="country-description" aria-label="Descripción general">
      <p>${data.description}</p>
    </section>

    <section class="country-statistics" aria-label="Estadísticas del país">
      <div class="country-info-grid" role="list">
        ${renderInfoCard(icons.capital, "Capital", data.stateCapital)}
        ${renderInfoCard(
          icons.population,
          "Población",
          data.population.toLocaleString("es-ES")
        )}
        ${renderInfoCard(
          icons.surface,
          "Superficie",
          `${data.surface.toLocaleString("es-ES")} km²`
        )}
        ${renderInfoCard(
          icons.currency,
          "Moneda",
          `${data.currency} (${data.currencyCode})`
        )}
        ${renderInfoCard(icons.languages, "Idiomas", data.languages.join(", "))}
        ${renderInfoCard(icons.timezone, "Zona Horaria", data.timeZone)}
        ${renderInfoCard(icons.phone, "Prefijo Telefónico", data.phonePrefix)}
        ${renderInfoCard(icons.domain, "Dominio Internet", data.internetDomain)}
      </div>
    </section>

    <section class="borders-section" aria-label="Países fronterizos">
      <h3>Países Fronterizos</h3>
      <ul class="borders-list" role="list">
        ${data.borders
          .map((border) => `<li><span class="border-tag">${border}</span></li>`)
          .join("")}
      </ul>
    </section>
  `;
}

// Renderizar tarjeta de información
function renderInfoCard(icon, title, value) {
  return `
    <article class="info-card" role="listitem">
      <div class="info-icon" aria-hidden="true">${icon}</div>
      <h4>${title}</h4>
      <p>${value}</p>
    </article>
  `;
}

// Renderizar datos de mapas
function renderMapData(data) {
  document.getElementById("general-info").innerHTML = `
    <section class="maps-section">
      <div class="maps-grid">
        ${data.map(map => `
          <article class="map-card">
            <img
              src="${map.urlImages[0]}"
              alt="${map.name}"
              class="map-image"
              loading="lazy"
            />
            <h4>${map.name}</h4>
            <p>${map.description}</p>
            <a href="${map.urlSource}" target="_blank" rel="noopener">
              Más información
            </a>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

// Renderizar datos de regiones
function renderRegionData(data) {
  document.getElementById("general-info").innerHTML = `
    <section class="regions-section">
      <div class="regions-grid">
        ${data.map(region => `
          <article class="region-card">
            <h4>${region.id}. Región ${region.name}</h4>
            <p>${region.description}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

// Mensaje de error
function showErrorMessage() {
  const infoSection = document.getElementById("general-info");
  infoSection.innerHTML = `
    <aside class="error-message" role="alert" aria-live="polite">
      <p>Error al cargar la información. Por favor, intenta de nuevo más tarde.</p>
    </aside>
  `;
}

fetchCountryInfo();
