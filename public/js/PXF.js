document.querySelector('.btn-lateral').onclick = function() {
    document.getElementById('modalColeccion').style.display = 'flex';
};
document.getElementById('closeColeccion').onclick = function() {
    document.getElementById('modalColeccion').style.display = 'none';
};
document.querySelector('.btn-historial').onclick = function() {
    const seccion = document.getElementById('historialSection');
    seccion.style.display = seccion.style.display === 'none' ? 'block' : 'none';
};
// Opcional: cerrar modal al hacer click fuera del contenido
window.onclick = function(event) {
    const modal = document.getElementById('modalColeccion');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};