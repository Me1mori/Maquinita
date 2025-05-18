// Cada objeto tiene src y probabilidad (suma total debe ser 1)
const premios = [
    { src: "https://placekitten.com/100/100", prob: 0.5 },
    { src: "https://placebear.com/100/100", prob: 0.2 },
    { src: "https://placebeard.it/100x100", prob: 0.15 },
    { src: "https://placehold.co/100x100", prob: 0.1 },
    { src: "https://picsum.photos/100/100", prob: 0.05 }
];

const mainImg = document.getElementById('main-img');
const randomImg = document.getElementById('random-img');
const clickMsg = document.getElementById('click-msg');
const historialList = document.getElementById('historial-list');

let mostrandoPremio = false;
const contadorPremios = {}; // Nuevo: objeto para contar repeticiones

// Función para elegir premio según probabilidad
function elegirPremio() {
    const r = Math.random();
    let acumulado = 0;
    for (let i = 0; i < premios.length; i++) {
        acumulado += premios[i].prob;
        if (r < acumulado) return premios[i].src;
    }
    // fallback
    return premios[premios.length - 1].src;
}

mainImg.addEventListener('click', () => {
    if (mostrandoPremio) {
        randomImg.classList.remove('show');
        clickMsg.classList.remove('show');
        setTimeout(() => {
            randomImg.classList.add('hidden');
            clickMsg.classList.add('hidden');
            mostrandoPremio = false;
        }, 500);
        return;
    }

    // Agita la imagen principal
    mainImg.classList.add('shake');
    // Selecciona imagen aleatoria con probabilidad
    const premio = elegirPremio();
    randomImg.src = premio;
    randomImg.classList.remove('hidden');

    // Actualiza el contador
    contadorPremios[premio] = (contadorPremios[premio] || 0) + 1;
    const contadorMostrado = Math.min(contadorPremios[premio], 6);

    setTimeout(() => {
        randomImg.classList.add('show');
        clickMsg.classList.remove('hidden');
        clickMsg.classList.add('show');
        mostrandoPremio = true;

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
            // Limita historial a 10 elementos
            while (historialList.children.length > 10) {
                historialList.removeChild(historialList.lastChild);
            }
        }
    }, 200);

    setTimeout(() => {
        mainImg.classList.remove('shake');
    }, 500);
});