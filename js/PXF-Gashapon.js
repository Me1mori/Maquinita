// --- Configuración de premios ---
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

// --- Elementos DOM ---
const mainVid = document.getElementById('main-img');
const randomImg = document.getElementById('random-img');
const clickMsg = document.getElementById('click-msg');
const historialList = document.getElementById('historial-list');
const variantesBtn = document.getElementById('toggle-variantes');
const historialBtn = document.getElementById('toggle-historial');
const variantesContainer = document.getElementById('variantes-container');
const historialContainer = document.getElementById('historial-container');

// --- Estado ---
let mostrandoPremio = false;
let esperandoPremio = false;
const contadorPremios = {};

// --- Función para elegir premio según probabilidad ---
function elegirPremio() {
    const r = Math.random();
    let acumulado = 0;
    for (let i = 0; i < premios.length; i++) {
        acumulado += premios[i].prob;
        if (r < acumulado) return premios[i];
    }
    return premios[premios.length - 1];
}

// --- Evento: Click en la máquina ---
mainVid.addEventListener('click', () => {
    if (mostrandoPremio || esperandoPremio) return;
    esperandoPremio = true;
    mainVid.play();
    clickMsg.classList.add('hidden');
    randomImg.classList.add('hidden');
    randomImg.style.opacity = 0;
    const animacionPremio = document.getElementById('animacion-premio');
    animacionPremio.innerHTML = '';

    // Elegir el premio antes de la animación
    const premioElegido = elegirPremio();
    randomImg.src = premioElegido.src;

    // Espera 5 segundos antes de mostrar la animación de la bola
    setTimeout(() => {
        // Crea la estructura de la bolita
        const bolitaContainer = document.createElement('div');
        bolitaContainer.className = 'bolita-anim-container';

        bolitaContainer.innerHTML = `
          <div class="bolita-container">
            <div class="circle-half left"></div>
            <div class="circle-half right"></div>
            <div class="flash"></div>
          </div>
        `;

        animacionPremio.appendChild(bolitaContainer);

        // Inicia la animación de apertura
        setTimeout(() => {
            bolitaContainer.querySelector('.bolita-container').classList.add('open');
        }, 300);

        // Espera a que termine la animación (~1.5s), luego muestra el premio
        setTimeout(() => {
            animacionPremio.innerHTML = '';
            randomImg.classList.remove('hidden');
            randomImg.classList.add('show');
            randomImg.style.opacity = 1;
            mostrandoPremio = true;
            esperandoPremio = false;
            setTimeout(() => {
                clickMsg.classList.remove('hidden');
                clickMsg.classList.add('show');
            }, 300);
        }, 1800);
    }, 5000); // <-- 5 segundos de espera antes de la animación
});

// --- Evento: Reclamar premio (click fuera del video) ---
document.body.addEventListener('click', (e) => {
    if (!mostrandoPremio || e.target === mainVid) return;

    randomImg.classList.remove('show');
    setTimeout(() => {
        randomImg.classList.add('hidden');
        clickMsg.classList.add('hidden');
        mostrandoPremio = false;
        document.getElementById('animacion-premio').innerHTML = '';

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
        // Reinicia el video y lo pausa al instante
        mainVid.currentTime = 0;
        mainVid.pause();
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

// --- Evento: Toggle Coleccionables ---
variantesBtn.addEventListener('click', () => {
    const isMobile = window.innerWidth <= 700;
    if (variantesContainer.classList.contains('show')) {
        variantesContainer.classList.remove('show');
        variantesContainer.classList.add('hide');
    } else {
        variantesContainer.classList.remove('hide');
        variantesContainer.classList.add('show');
        // Al abrir, asegúrate de que todas estén plegadas
        document.querySelectorAll('.variante-list').forEach(list => {
            list.classList.remove('show');
            list.classList.add('hide');
        });
        // Si es móvil, cierra historial
        if (isMobile && historialContainer.classList.contains('show')) {
            historialContainer.classList.remove('show');
            historialContainer.classList.add('hide');
        }
    }
});

// --- Evento: Toggle Historial ---
historialBtn.addEventListener('click', () => {
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

// --- Evento: Toggle sub-secciones de coleccionables ---
document.querySelectorAll('.toggle-variante').forEach(btn => {
    btn.addEventListener('click', function() {
        // Pliega todas las listas primero
        document.querySelectorAll('.variante-list').forEach(list => {
            list.classList.remove('show');
            list.classList.add('hide');
        });
        // Abre solo la seleccionada si estaba cerrada
        const target = document.getElementById('variante-' + btn.dataset.target);
        if (target && !target.classList.contains('show')) {
            target.classList.add('show');
            target.classList.remove('hide');
        }
    });
});

// --- Paneles móviles ---
const variantesBtnM = document.getElementById('toggle-variantes-m');
const historialBtnM = document.getElementById('toggle-historial-m');
const variantesContainerM = document.getElementById('variantes-container-m');
const historialContainerM = document.getElementById('historial-container-m');
const historialListM = document.getElementById('historial-list-m');

// Mostrar/ocultar Coleccionables en móvil
if (variantesBtnM && variantesContainerM) {
    variantesBtnM.addEventListener('click', () => {
        if (variantesContainerM.classList.contains('show')) {
            variantesContainerM.classList.remove('show');
            variantesContainerM.classList.add('hide');
        } else {
            variantesContainerM.classList.remove('hide');
            variantesContainerM.classList.add('show');
            // Cierra historial si está abierto
            if (historialContainerM.classList.contains('show')) {
                historialContainerM.classList.remove('show');
                historialContainerM.classList.add('hide');
            }
            // Pliega sublistas
            variantesContainerM.querySelectorAll('.variante-list').forEach(list => {
                list.classList.remove('show');
                list.classList.add('hide');
            });
        }
    });
}

// Mostrar/ocultar Historial en móvil
if (historialBtnM && historialContainerM) {
    historialBtnM.addEventListener('click', () => {
        if (historialContainerM.classList.contains('show')) {
            historialContainerM.classList.remove('show');
            historialContainerM.classList.add('hide');
        } else {
            historialContainerM.classList.remove('hide');
            historialContainerM.classList.add('show');
            // Cierra variantes si está abierto
            if (variantesContainerM.classList.contains('show')) {
                variantesContainerM.classList.remove('show');
                variantesContainerM.classList.add('hide');
            }
        }
    });
}

// --- Actualiza historial en móvil también ---
function agregarAlHistorialMovil(premio, contadorActual) {
    if (!historialListM) return;
    // El contador inicia en P0
    const contadorMostrado = contadorActual - 1;
    let encontrado = false;
    for (let li of historialListM.children) {
        const img = li.querySelector('img');
        if (img && img.src === premio) {
            let span = li.querySelector('span');
            if (!span) {
                span = document.createElement('span');
                span.style.marginLeft = "8px";
                span.style.fontWeight = "bold";
                li.appendChild(span);
            }
            // Solo muestra si es P2 o mayor
            span.textContent = contadorMostrado >= 2 ? `P${contadorMostrado}` : "";
            historialListM.insertBefore(li, historialListM.firstChild);
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
        if (contadorMostrado >= 2) {
            const span = document.createElement('span');
            span.textContent = `P${contadorMostrado}`;
            span.style.marginLeft = "8px";
            span.style.fontWeight = "bold";
            li.appendChild(span);
        }
        historialListM.insertBefore(li, historialListM.firstChild);
        while (historialListM.children.length > 10) {
            historialListM.removeChild(historialListM.lastChild);
        }
    }
}

// Modifica el evento de reclamar premio para actualizar ambos historiales
document.body.addEventListener('click', (e) => {
    if (!mostrandoPremio || e.target === mainVid) return;

    randomImg.classList.remove('show');
    setTimeout(() => {
        randomImg.classList.add('hidden');
        clickMsg.classList.add('hidden');
        mostrandoPremio = false;
        document.getElementById('animacion-premio').innerHTML = '';

        // Agrega al historial (PC)
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
        // También agrega al historial móvil
        agregarAlHistorialMovil(premio, contadorPremios[premio]);

        // Reinicia el video y lo pausa al instante
        mainVid.currentTime = 0;
        mainVid.pause();
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

// --- Sublistas de coleccionables en móvil ---
document.querySelectorAll('.toggle-variante').forEach(btn => {
    btn.addEventListener('click', function() {
        // Pliega todas las listas primero SOLO en el contenedor correspondiente
        let parentContainer = btn.closest('.variantes-container');
        if (!parentContainer) return;
        parentContainer.querySelectorAll('.variante-list').forEach(list => {
            list.classList.remove('show');
            list.classList.add('hide');
        });
        // Abre solo la seleccionada si estaba cerrada
        const target = parentContainer.querySelector('#variante-' + btn.dataset.target);
        if (target && !target.classList.contains('show')) {
            target.classList.add('show');
            target.classList.remove('hide');
        }
    });
});