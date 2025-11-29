export default function renderRegionData(data) {
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