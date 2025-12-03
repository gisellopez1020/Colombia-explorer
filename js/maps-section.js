export default function renderMapData(data) {
  document.getElementById("general-info").innerHTML = `
    <section class="maps-section">
      <div class="maps-grid">
        ${data.map(map => `
          <article class="map-card">
            <img
              src="${map.urlImages[0]}"
              alt="${map.name}"
              class="map-image"
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