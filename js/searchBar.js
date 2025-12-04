export function createDepartmentSearchBar() {
  return `
    <div class="search-container">
      <div class="search-wrapper">
        <i class="fas fa-search search-icon" aria-hidden="true"></i>
        <input 
          type="text" 
          id="department-search" 
          class="search-input" 
          placeholder="Buscar departamento..."
          aria-label="Buscar departamento"
        >
        <button id="clear-department-search" class="clear-btn" aria-label="Limpiar búsqueda" style="display: none;">
          <i class="fas fa-times" aria-hidden="true"></i>
        </button>
      </div>
      <div id="department-search-results" class="search-results" style="display: none;"></div>
    </div>
  `;
}

export function createGastronomySearchBar() {
  return `
    <div class="search-container">
      <div class="search-wrapper">
        <i class="fas fa-search search-icon" aria-hidden="true"></i>
        <input 
          type="text" 
          id="gastronomy-search" 
          class="search-input" 
          placeholder="Buscar plato típico..."
          aria-label="Buscar plato típico"
        >
        <button id="clear-gastronomy-search" class="clear-btn" aria-label="Limpiar búsqueda" style="display: none;">
          <i class="fas fa-times" aria-hidden="true"></i>
        </button>
      </div>
      <div id="gastronomy-search-results" class="search-results" style="display: none;"></div>
    </div>
  `;
}

let searchTimeout;

// Función para normalizar texto
function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// BÚSQUEDA DE DEPARTAMENTOS CON API
export async function searchDepartments(keyword) {
  if (!keyword || keyword.length < 2) {
    return [];
  }

  try {
    const response = await fetch(`https://api-colombia.com/api/v1/Department/search/${keyword}`);
    if (!response.ok) throw new Error('Error en la búsqueda');
    const data = await response.json();
    
    return sortDepartmentsByRelevance(data, keyword);
  } catch (error) {
    console.error('Error buscando departamentos:', error);
    return [];
  }
}

// Ordenar departamentos por relevancia
function sortDepartmentsByRelevance(departments, keyword) {
  const searchTerm = normalizeText(keyword.trim());
  
  return departments.sort((a, b) => {
    const scoreA = calculateRelevanceScore(a, searchTerm);
    const scoreB = calculateRelevanceScore(b, searchTerm);
    
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    
    return a.name.localeCompare(b.name);
  });
}

// Calcular puntuación de relevancia
function calculateRelevanceScore(department, searchTerm) {
  const name = normalizeText(department.name);
  const description = normalizeText(department.description || '');
  const capital = normalizeText(department.cityCapital?.name || '');
  
  let score = 0;
  
  if (name === searchTerm) {
    score += 1000;
  }
  else if (name.startsWith(searchTerm)) {
    score += 500;
  }
  else if (name.includes(searchTerm)) {
    score += 250;
  }
  
  if (capital === searchTerm) {
    score += 150;
  } else if (capital.includes(searchTerm)) {
    score += 75;
  }
  
  if (description.includes(searchTerm)) {
    score += 50;
  }
  
  if (name.includes(searchTerm)) {
    score += Math.max(0, 100 - name.length);
  }
  
  return score;
}

// BÚSQUEDA DE PLATOS TÍPICOS CON API
export async function searchGastronomy(keyword) {
  if (!keyword || keyword.length < 2) {
    return [];
  }

  try {
    const response = await fetch(`https://api-colombia.com/api/v1/TypicalDish/search/${keyword}`);
    if (!response.ok) throw new Error('Error en la búsqueda');
    const data = await response.json();
    
    return sortGastronomyByRelevance(data, keyword);
  } catch (error) {
    console.error('Error buscando platos típicos:', error);
    return [];
  }
}

// Ordenar platos típicos por relevancia
function sortGastronomyByRelevance(dishes, keyword) {
  const searchTerm = normalizeText(keyword.trim());
  
  return dishes.sort((a, b) => {
    const scoreA = calculateGastronomyRelevanceScore(a, searchTerm);
    const scoreB = calculateGastronomyRelevanceScore(b, searchTerm);
    
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    
    return a.name.localeCompare(b.name);
  });
}

// Calcular puntuación de relevancia para gastronomía
function calculateGastronomyRelevanceScore(dish, searchTerm) {
  const name = normalizeText(dish.name);
  const description = normalizeText(dish.description || '');
  const category = normalizeText(dish.category?.name || '');
  
  let score = 0;
  
  if (name === searchTerm) {
    score += 1000;
  }
  else if (name.startsWith(searchTerm)) {
    score += 500;
  }
  else if (name.includes(searchTerm)) {
    score += 250;
  }
  
  if (category === searchTerm) {
    score += 150;
  } else if (category.includes(searchTerm)) {
    score += 75;
  }
  
  if (description.includes(searchTerm)) {
    score += 50;
  }
  
  if (name.includes(searchTerm)) {
    score += Math.max(0, 100 - name.length);
  }
  
  return score;
}

// BÚSQUEDA DE DEPARTAMENTOS
export function initDepartmentSearch() {
  const searchInput = document.getElementById('department-search');
  const clearBtn = document.getElementById('clear-department-search');
  const resultsContainer = document.getElementById('department-search-results');

  if (!searchInput) return;

  searchInput.addEventListener('input', async (e) => {
    const keyword = e.target.value.trim();
    
    clearBtn.style.display = keyword ? 'flex' : 'none';

    clearTimeout(searchTimeout);

    if (keyword.length < 2) {
      resultsContainer.style.display = 'none';
      resultsContainer.innerHTML = '';
      return;
    }

    searchTimeout = setTimeout(async () => {
      resultsContainer.innerHTML = '<div class="search-loading"><i class="fas fa-spinner fa-spin"></i> Buscando...</div>';
      resultsContainer.style.display = 'block';

      const results = await searchDepartments(keyword);

      if (results.length === 0) {
        resultsContainer.innerHTML = `
          <div class="search-no-results">
            <i class="fas fa-search"></i>
            <p>No se encontraron departamentos</p>
            <small>Intenta con otro término de búsqueda</small>
          </div>
        `;
      } else {
        resultsContainer.innerHTML = `
          <div class="search-results-header">
            <small>${results.length} ${results.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}</small>
          </div>
          ${results.map(dept => `
            <div class="search-result-item" data-department-id="${dept.id}">
              <div class="result-icon">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <div class="result-content">
                <h4>${dept.name}</h4>
                <p>${dept.description.substring(0, 100)}...</p>
              </div>
            </div>
          `).join('')}
        `;

        document.querySelectorAll('.search-result-item').forEach(item => {
          item.addEventListener('click', () => {
            const deptId = parseInt(item.dataset.departmentId);
            window.showDepartmentDetails(deptId);
            resultsContainer.style.display = 'none';
            searchInput.value = '';
            clearBtn.style.display = 'none';
          });
        });
      }
    }, 300);
  });

  // Botón limpiar
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    resultsContainer.style.display = 'none';
    resultsContainer.innerHTML = '';
    searchInput.focus();
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      resultsContainer.style.display = 'none';
    }
  });
}

// BÚSQUEDA DE GASTRONOMÍA
export function initGastronomySearch() {
  const searchInput = document.getElementById('gastronomy-search');
  const clearBtn = document.getElementById('clear-gastronomy-search');
  const resultsContainer = document.getElementById('gastronomy-search-results');

  if (!searchInput) return;

  searchInput.addEventListener('input', async (e) => {
    const keyword = e.target.value.trim();
    
    clearBtn.style.display = keyword ? 'flex' : 'none';

    clearTimeout(searchTimeout);

    if (keyword.length < 2) {
      resultsContainer.style.display = 'none';
      resultsContainer.innerHTML = '';
      return;
    }

    searchTimeout = setTimeout(async () => {
      resultsContainer.innerHTML = '<div class="search-loading"><i class="fas fa-spinner fa-spin"></i> Buscando...</div>';
      resultsContainer.style.display = 'block';

      const results = await searchGastronomy(keyword);

      if (results.length === 0) {
        resultsContainer.innerHTML = `
          <div class="search-no-results">
            <i class="fas fa-utensils"></i>
            <p>No se encontraron platos típicos</p>
            <small>Intenta con otro término de búsqueda</small>
          </div>
        `;
      } else {
        resultsContainer.innerHTML = `
          <div class="search-results-header">
            <small>${results.length} ${results.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}</small>
          </div>
          ${results.map((dish, index) => `
            <div class="search-result-item gastronomy-result" data-dish-id="${dish.id}">
              <div class="result-content">
                <h4>${dish.name}</h4>
                <p class="result-category"><i class="fas fa-map-marker-alt"></i> ${dish.department?.name || 'Sin departamento'}</p>
                <p>${dish.description.substring(0, 100)}...</p>
              </div>
            </div>
          `).join('')}
        `;
        
        document.querySelectorAll('.search-result-item.gastronomy-result').forEach((item) => {
          item.addEventListener('click', () => {
            const dishId = parseInt(item.dataset.dishId);
            window.showDishDetails(dishId);
            resultsContainer.style.display = 'none';
            searchInput.value = '';
            clearBtn.style.display = 'none';
          });
        });
      }
    }, 300);
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    resultsContainer.style.display = 'none';
    resultsContainer.innerHTML = '';
    searchInput.focus();
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      resultsContainer.style.display = 'none';
    }
  });
}