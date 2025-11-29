import renderCountryInfo from './general-info.js';
import renderMapData from './maps-section.js';
import renderRegionData from './regions-section.js';
import renderDepartmentData from './departments-section.js';
import renderTourismData from './tourism-section.js';
import renderGastronomyData from './gastronomy-section.js';
import renderSpeciesData from './species-section.js';

const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const generalLink = document.getElementById("p-title");
const mapasLink = document.getElementById("mapas-link");
const regionesLink = document.getElementById("regiones-link");
const departamentosLink = document.getElementById("departamentos-link");
const turismoLink = document.getElementById("turismo-link");
const gastronomiaLink = document.getElementById("gastronomia-link");
const especiesLink = document.getElementById("especies-link");
const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");

let departmentsData = [];
let tourismData = [];

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

// Funcionalidad del menú hamburguesa
menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  mainNav.classList.toggle("active");
  body.classList.toggle("menu-open");
  
  const isExpanded = mainNav.classList.contains("active");
  menuToggle.setAttribute("aria-expanded", isExpanded);
});

// Cerrar menú
body.addEventListener("click", (e) => {
  if (body.classList.contains("menu-open") && 
      !mainNav.contains(e.target) && 
      !menuToggle.contains(e.target)) {
    menuToggle.classList.remove("active");
    mainNav.classList.remove("active");
    body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

export function updatePageTitle(title) {
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
  
  // Cerrar menú móvil
  if (window.innerWidth <= 768) {
    menuToggle.classList.remove("active");
    mainNav.classList.remove("active");
    body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
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
  fetchDepartmentData();
  setTimeout(triggerAnimation, 10);
});

turismoLink.addEventListener("click", () => {
  updatePageTitle("Turismo");
  fetchTourismData();
  setTimeout(triggerAnimation, 10);
});

gastronomiaLink.addEventListener("click", () => {
  updatePageTitle("Platos Típicos");
  fetchGastronomyData();
  setTimeout(triggerAnimation, 10);
});

especiesLink.addEventListener("click", () => {
  updatePageTitle("Especies invasoras");
  fetchSpeciesData();
  setTimeout(triggerAnimation, 10);
});

// Navegación suave y cerrar menú móvil
const navLinks = document.querySelectorAll("nav a");
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
    
    // Cerrar menú móvil al seleccionar una opción
    if (window.innerWidth <= 768) {
      menuToggle.classList.remove("active");
      mainNav.classList.remove("active");
      body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

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
    
    departmentsData = data;
    
    renderDepartmentData(data);
  } catch (error) {
    console.error("Error al obtener la información de los departamentos:", error);
    showErrorMessage();
  }
}

// Llamada a la API para la info de turismo
async function fetchTourismData() {
  try {
    const response = await fetch(
      "https://api-colombia.com/api/v1/TouristicAttraction"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    tourismData = data;
    renderTourismData(data);
  } catch (error) {
    console.error("Error al obtener la información de turismo:", error);
    showErrorMessage();
  }
}

// Llamada a la API para la info de gastronomía
async function fetchGastronomyData() {
  try {
    const response = await fetch(
      "https://api-colombia.com/api/v1/TypicalDish"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    renderGastronomyData(data);
  } catch (error) {
    console.error("Error al obtener la información de gastronomía:", error);
    showErrorMessage();
  }
}

// Llamada a la API para la info de fauna invasiva
async function fetchSpeciesData() {
  try {
    const response = await fetch(
      "https://api-colombia.com/api/v1/Invasivespecie"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    renderSpeciesData(data);
  } catch (error) {
    console.error("Error al obtener la información de fauna invasiva:", error);
    showErrorMessage();
  }
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
