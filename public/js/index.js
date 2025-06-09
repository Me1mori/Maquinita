document.getElementById("maquinita-pxf")?.addEventListener("click", () => {
    window.location.href = "../src/PXF-Gashapon.html";
});

// Seleccionar elementos del DOM con verificación de existencia
const body = document.body;
const lightBtn = document.getElementById("lightMode");
const darkBtn = document.getElementById("darkMode");

// Función para cambiar el tema y guardar la preferencia
function cambiarTema(nuevoTema) {
    body.classList.remove("light-theme", "dark-theme");
    body.classList.add(nuevoTema);
    localStorage.setItem("theme", nuevoTema);
}

// Verificar si los botones existen antes de agregar eventos
if (lightBtn && darkBtn) {
    lightBtn.addEventListener("click", () => cambiarTema("light-theme"));
    darkBtn.addEventListener("click", () => cambiarTema("dark-theme"));
}

// Aplicar el tema guardado en `localStorage` al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "light-theme"; // Tema por defecto
    cambiarTema(savedTheme);
});