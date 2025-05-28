document.getElementById("maquinita-pxf").onclick = function() {
    window.location.href = "PXF-Gashapon.html";
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