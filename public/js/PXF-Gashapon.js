// --- Configuración de premios ---
const premios = [
    { src: "https://cdn-icons-png.flaticon.com/128/616/616494.png", prob: 0.18, tipo: "figura" },
    { src: "https://cdn-icons-png.flaticon.com/128/616/616495.png", prob: 0.10, tipo: "figura" },
    { src: "https://cdn-icons-png.flaticon.com/128/616/616496.png", prob: 0.07, tipo: "figura" },
    { src: "https://cdn-icons-png.flaticon.com/128/3135/3135715.png", prob: 0.20, tipo: "tarjeta" },
    { src: "https://cdn-icons-png.flaticon.com/128/3135/3135716.png", prob: 0.10, tipo: "tarjeta" },
    { src: "https://cdn-icons-png.flaticon.com/128/3135/3135717.png", prob: 0.05, tipo: "tarjeta" },
    { src: "https://cdn-icons-png.flaticon.com/128/616/616497.png", prob: 0.15, tipo: "llavero" },
    { src: "https://cdn-icons-png.flaticon.com/128/616/616498.png", prob: 0.10, tipo: "llavero" },
    { src: "https://cdn-icons-png.flaticon.com/128/616/616499.png", prob: 0.05, tipo: "llavero" }
];

// --- Elementos DOM ---
const mainVid = document.getElementById('main-img');
const randomImg = document.getElementById('random-img');
const clickMsg = document.getElementById('click-msg');
const historialList = document.getElementById('historial-list');
const historialListM = document.getElementById('historial-list-m');
const btnVariantes = document.getElementById('toggle-variantes');
const contVariantes = document.getElementById('variantes-container');
const btnHistorial = document.getElementById('toggle-historial');
const contHistorial = document.getElementById('historial-container');
const btnVariantesM = document.getElementById('toggle-variantes-m');
const contVariantesM = document.getElementById('variantes-container-m');
const btnHistorialM = document.getElementById('toggle-historial-m');
const contHistorialM = document.getElementById('historial-container-m');

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
        animacionPremio.innerHTML = ''; // Aquí puedes agregar animación si quieres
        randomImg.classList.remove('hidden');
        randomImg.classList.add('show');
        randomImg.style.opacity = 1;
        mostrandoPremio = true;
        esperandoPremio = false;
        setTimeout(() => {
            clickMsg.classList.remove('hidden');
            clickMsg.classList.add('show');
        }, 300);
    }, 5000);
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

        // Incrementa SOLO una vez
        const premio = randomImg.src;
        contadorPremios[premio] = (contadorPremios[premio] || 0) + 1;
        const contadorActual = contadorPremios[premio];

        actualizarHistorial(historialList, premio, contadorActual);
        if (historialListM && historialListM !== historialList) {
            actualizarHistorial(historialListM, premio, contadorActual);
        }

        mainVid.currentTime = 0;
        mainVid.pause();
    }, 300);
});

// --- Función única para actualizar historial (PC y móvil) ---
function actualizarHistorial(historialList, premio, contadorActual) {
    const contadorMostrado = contadorActual;
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
            span.textContent = contadorMostrado >= 2 ? `P${contadorMostrado}` : "";
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
        if (contadorMostrado >= 2) {
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
}

// --- Cuando se cierra el panel de coleccionables, pliega todas las sub-secciones ---
function plegarSubsecciones() {
    document.querySelectorAll('.variante-list').forEach(list => {
        list.classList.remove('show');
        list.classList.add('hide');
    });
}

// --- Mostrar/Ocultar paneles de variantes y historial ---

// PC - Toggle variantes
if (btnVariantes && contVariantes) {
    btnVariantes.addEventListener('click', () => {
        contVariantes.classList.toggle('show');
        contVariantes.classList.toggle('hide');
        // Si se cierra el panel, pliega sub-secciones
        if (!contVariantes.classList.contains('show')) {
            plegarSubsecciones();
        }
    });
}

// PC - Toggle historial
if (btnHistorial && contHistorial) {
    btnHistorial.addEventListener('click', () => {
        contHistorial.classList.toggle('show');
        contHistorial.classList.toggle('hide');
    });
}

// Móvil - Toggle variantes (solo uno abierto a la vez)
if (btnVariantesM && contVariantesM && contHistorialM) {
    btnVariantesM.addEventListener('click', () => {
        contHistorialM.classList.remove('show');
        contHistorialM.classList.add('hide');
        contVariantesM.classList.toggle('show');
        contVariantesM.classList.toggle('hide');
        // Si se cierra el panel, pliega sub-secciones
        if (!contVariantesM.classList.contains('show')) {
            plegarSubsecciones();
        }
    });
}

// Móvil - Toggle historial (solo uno abierto a la vez)
if (btnHistorialM && contHistorialM && contVariantesM) {
    btnHistorialM.addEventListener('click', () => {
        contVariantesM.classList.remove('show');
        contVariantesM.classList.add('hide');
        contHistorialM.classList.toggle('show');
        contHistorialM.classList.toggle('hide');
    });
}

// --- Toggle variantes (solo una sub-sección abierta a la vez, SOLO móvil) ---
document.querySelectorAll('.toggle-variante').forEach(btn => {
    btn.addEventListener('click', function() {
        // Solo ejecutar en móvil
        if (window.innerWidth <= 700) {
            const target = this.getAttribute('data-target');
            const ul = document.getElementById('variante-' + target);

            // Cierra todas las sub-secciones primero
            document.querySelectorAll('.variante-list').forEach(list => {
                list.classList.remove('show');
                list.classList.add('hide');
            });

            // Abre/cierra solo la seleccionada
            if (ul) {
                if (!ul.classList.contains('show')) {
                    ul.classList.add('show');
                    ul.classList.remove('hide');
                } else {
                    ul.classList.remove('show');
                    ul.classList.add('hide');
                }
            }
        }
    });
});

// --- Submenú lateral variantes (solo PC, solo con click) ---
if (window.innerWidth > 700) {
    let submenuLateral = document.createElement('div');
    submenuLateral.className = 'submenu-lateral';
    document.querySelector('.variantes-toggle').appendChild(submenuLateral);

    // SOLO selecciona los botones y listas de PC (sin -m)
    const variantesMap = {
        figuras: {
            btn: document.querySelector('.variantes-container .toggle-variante[data-target="figuras"]'),
            ul: document.getElementById('variante-figuras'),
            clase: 'figuras',
            titulo: 'Figuras'
        },
        tarjetas: {
            btn: document.querySelector('.variantes-container .toggle-variante[data-target="tarjetas"]'),
            ul: document.getElementById('variante-tarjetas'),
            clase: 'tarjetas',
            titulo: 'Tarjetas'
        },
        llaveros: {
            btn: document.querySelector('.variantes-container .toggle-variante[data-target="llaveros"]'),
            ul: document.getElementById('variante-llaveros'),
            clase: 'llaveros',
            titulo: 'Llaveros'
        }
    };

    let submenuAbierto = null;

    function mostrarSubmenuLateral(tipo) {
        submenuLateral.innerHTML = '';
        submenuLateral.className = 'submenu-lateral show ' + variantesMap[tipo].clase;

        const h3 = document.createElement('h3');
        h3.textContent = variantesMap[tipo].titulo;
        h3.style.marginBottom = '10px';
        submenuLateral.appendChild(h3);

        const ulClon = variantesMap[tipo].ul.cloneNode(true);
        ulClon.classList.remove('hide', 'show');
        ulClon.removeAttribute('style');
        ulClon.style.display = 'block';
        submenuLateral.appendChild(ulClon);

        // Ya no necesitas setear .style.top o .style.left aquí
        submenuLateral.style.display = 'block';

        submenuAbierto = tipo;
    }

    function ocultarSubmenuLateral() {
        submenuLateral.className = 'submenu-lateral';
        submenuLateral.style.display = 'none';
        submenuAbierto = null;
    }

    // Click en botón: abre/cierra submenú lateral
    Object.keys(variantesMap).forEach(tipo => {
        if (variantesMap[tipo].btn) {
            variantesMap[tipo].btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (submenuAbierto === tipo) {
                    ocultarSubmenuLateral();
                } else {
                    mostrarSubmenuLateral(tipo);
                }
            });
        }
    });

    // Click fuera: cierra submenú lateral
    document.addEventListener('click', (e) => {
        if (!submenuLateral.contains(e.target)) {
            ocultarSubmenuLateral();
        }
    });

    // Evita que el submenú se cierre si haces click dentro de él
    submenuLateral.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Oculta el submenú si haces scroll o cambias de tamaño
    window.addEventListener('scroll', ocultarSubmenuLateral);
    window.addEventListener('resize', ocultarSubmenuLateral);
}