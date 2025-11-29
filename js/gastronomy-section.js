export default function renderGastronomyData(data) {
  // Agrupar platos por departamento
  const dishesByDepartment = groupByDepartment(data);
  
  document.getElementById("general-info").innerHTML = `
    <section class="gastronomy-section" aria-label="Gastronomía de Colombia">
      ${Object.entries(dishesByDepartment).map(([departmentName, dishes]) => 
        renderDepartmentSection(departmentName, dishes)
      ).join('')}
    </section>
  `;
}

function groupByDepartment(data) {
  const grouped = {};
  
  data.forEach(dish => {
    const departmentName = dish.department.name;
    
    if (!grouped[departmentName]) {
      grouped[departmentName] = [];
    }
    
    grouped[departmentName].push(dish);
  });
  
  return Object.keys(grouped)
    .sort()
    .reduce((acc, key) => {
      acc[key] = grouped[key];
      return acc;
    }, {});
}

function renderDepartmentSection(departmentName, dishes) {
  return `
    <article class="department-gastronomy">
      <header class="gastronomy-department-header">
        <h3 id="dept-${departmentName.replace(/\s+/g, '-')}" class="department-title">
          <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
          ${departmentName}
        </h3>
        <span class="dishes-count">${dishes.length} ${dishes.length === 1 ? 'plato típico' : 'platos típicos'}</span>
      </header>
      
      <div class="gastronomy-grid" role="list">
        ${dishes.map(dish => renderGastronomyCard(dish)).join('')}
      </div>
    </article>
  `;
}

function renderGastronomyCard(dish) {
  return `
    <article class="gastronomy-card" role="listitem">
      <div class="gastronomy-image-container">
        <img 
          src="${dish.imageUrl}" 
          alt="${dish.name}" 
          class="gastronomy-image"
          loading="lazy"
          onerror="this.src='assets/placeholder-food.png'"
        />
      </div>
      
      <div class="gastronomy-content">
        <header>
          <h4 class="dish-name">${dish.name}</h4>
        </header>
        
        <p class="dish-description">${dish.description}</p>
        
        <div class="dish-ingredients">
          <h5>
            <i class="fas fa-utensils" aria-hidden="true"></i>
            Ingredientes
          </h5>
          <p>${dish.ingredients}</p>
        </div>
      </div>
    </article>
  `;
}