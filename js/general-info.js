import { updatePageTitle } from "./index.js";

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

// Renderizar información general
export default function renderCountryInfo(data) {
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