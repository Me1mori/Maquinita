document.getElementById("maquinita-pxf").onclick = function() {
    window.location.href = "./src/PXF-Gashapon.html";
}

const body = document.body;
const lightBtn = document.getElementById("lightMode");
const darkBtn = document.getElementById("darkMode");

lightBtn.addEventListener("click", () => {
    body.classList.remove("dark-theme");
    body.classList.add("light-theme");
});

darkBtn.addEventListener("click", () => {
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
});

document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("light-theme"); // Establece el tema claro al abrir la página
});

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "light-theme"; // Por defecto es claro
    document.body.classList.add(savedTheme);
});

document.getElementById("lightMode").addEventListener("click", () => {
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
    localStorage.setItem("theme", "light-theme"); // Guarda la preferencia
});

document.getElementById("darkMode").addEventListener("click", () => {
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
    localStorage.setItem("theme", "dark-theme"); // Guarda la preferencia
});