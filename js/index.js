// Cada objeto tiene src y probabilidad (suma total debe ser 1)
const premios = [
    // Figuras
    { src: "https://cdn-icons-png.flaticon.com/128/616/616494.png", prob: 0.18, tipo: "figura" },
    { src: "https://cdn-icons-png.flaticon.com/128/616/616495.png", prob: 0.10, tipo: "figura" },
    { src: "https://cdn-icons-png.flaticon.com/128/616/616496.png", prob: 0.07, tipo: "figura" },
    // Tarjetas
    { src: "https://cdn-icons-png.flaticon.com/128/3135/3135715.png", prob: 0.20, tipo: "tarjeta" },
    { src: "https://cdn-icons-png.flaticon.com/128/3135/3135716.png", prob: 0.10, tipo: "tarjeta" },
    { src: "https://cdn-icons-png.flaticon.com/128/3135/3135717.png", prob: 0.05, tipo: "tarjeta" },
    // Llaveros
    { src: "https://cdn-icons-png.flaticon.com/128/616/616497.png", prob: 0.15, tipo: "llavero" },
    { src: "https://cdn-icons-png.flaticon.com/128/616/616498.png", prob: 0.10, tipo: "llavero" },
    { src: "https://cdn-icons-png.flaticon.com/128/616/616499.png", prob: 0.05, tipo: "llavero" }
];

const mainVid = document.getElementById('main-img');
const randomImg = document.getElementById('random-img');
const clickMsg = document.getElementById('click-msg');
const historialList = document.getElementById('historial-list');
const toggleBtn = document.getElementById('toggle-variantes');
const variantesContainer = document.getElementById('variantes-container');
const historialToggleBtn = document.getElementById('toggle-historial');
const historialContainer = document.getElementById('historial-container');

let mostrandoPremio = false;
let esperandoPremio = false;
const contadorPremios = {};

mainVid.addEventListener('click', () => {
    // Solo permite click si NO está esperando ni mostrando premio
    if (mostrandoPremio || esperandoPremio) return;

    esperandoPremio = true; // Bloquea más clicks
    mainVid.play();
    clickMsg.classList.add('hidden');
    randomImg.classList.add('hidden');

    setTimeout(() => {
        const premio = elegirPremio();
        randomImg.src = premio;
        randomImg.classList.remove('hidden');
        setTimeout(() => {
            randomImg.classList.add('show');
            clickMsg.classList.remove('hidden');
            clickMsg.classList.add('show');
            mostrandoPremio = true;
            esperandoPremio = false; // Ya no está esperando, pero sí mostrando
        }, 100);
    }, 5000);
});

// Click en cualquier parte de la pantalla para aceptar el premio y agregar al historial
document.body.addEventListener('click', (e) => {
    // Solo permite aceptar si el premio está visible y no fue click en el video
    if (!mostrandoPremio || e.target === mainVid) return;

    randomImg.classList.remove('show');
    clickMsg.classList.remove('show');
    setTimeout(() => {
        randomImg.classList.add('hidden');
        clickMsg.classList.add('hidden');
        mostrandoPremio = false; // Ahora sí se puede volver a hacer click

        // Agrega al historial
        const premio = randomImg.src;
        contadorPremios[premio] = (contadorPremios[premio] || 0) + 1;
        const contadorMostrado = Math.min(contadorPremios[premio], 6);

        // Busca si ya existe la imagen en el historial
        let encontrado = false;
        for (let li of historialList.children) {
            const img = li.querySelector('img');
            if (img && img.src === premio) {
                let span = li.querySelector('span');
                if (!span) {
                    span = document.createElement('span');
                    span.style.marginLeft = "8px";
                    span.style.fontWeight = "bold";
                    li.appendChild(span);
                }
                span.textContent = `P${contadorMostrado}`;
                historialList.insertBefore(li, historialList.firstChild);
                encontrado = true;
                break;
            }
        }
        if (!encontrado) {
            const li = document.createElement('li');
            const img = document.createElement('img');
            img.src = premio;
            img.alt = "Premio";
            li.appendChild(img);
            if (contadorMostrado > 1) {
                const span = document.createElement('span');
                span.textContent = `P${contadorMostrado}`;
                span.style.marginLeft = "8px";
                span.style.fontWeight = "bold";
                li.appendChild(span);
            }
            historialList.insertBefore(li, historialList.firstChild);
            while (historialList.children.length > 10) {
                historialList.removeChild(historialList.lastChild);
            }
        }
        // Reinicia el video para el siguiente intento
        mainVid.currentTime = 0;
    }, 300);

    // Marca la estrella de la variante correspondiente
    const premioObj = premios.find(p => p.src === randomImg.src);
    if (premioObj) {
        ['estrella-figura', 'estrella-tarjeta', 'estrella-llavero'].forEach(id => {
            document.getElementById(id).classList.remove('activa');
        });
        document.getElementById('estrella-' + premioObj.tipo).classList.add('activa');
    }
});

toggleBtn.addEventListener('click', () => {
    const isMobile = window.innerWidth <= 700;
    if (variantesContainer.classList.contains('show')) {
        variantesContainer.classList.remove('show');
        variantesContainer.classList.add('hide');
    } else {
        variantesContainer.classList.remove('hide');
        variantesContainer.classList.add('show');
        // Si es móvil, cierra historial
        if (isMobile && historialContainer.classList.contains('show')) {
            historialContainer.classList.remove('show');
            historialContainer.classList.add('hide');
        }
    }
});

historialToggleBtn.addEventListener('click', () => {
    const isMobile = window.innerWidth <= 700;
    if (historialContainer.classList.contains('show')) {
        historialContainer.classList.remove('show');
        historialContainer.classList.add('hide');
    } else {
        historialContainer.classList.remove('hide');
        historialContainer.classList.add('show');
        // Si es móvil, cierra variantes
        if (isMobile && variantesContainer.classList.contains('show')) {
            variantesContainer.classList.remove('show');
            variantesContainer.classList.add('hide');
        }
    }
});

function elegirPremio() {
    const r = Math.random();
    let acumulado = 0;
    for (let i = 0; i < premios.length; i++) {
        acumulado += premios[i].prob;
        if (r < acumulado) return premios[i].src;
    }
    return premios[premios.length - 1].src;
}