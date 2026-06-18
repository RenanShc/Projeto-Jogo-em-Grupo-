const botaoIniciar = document.getElementById('iniciar');
const headerInicio = document.querySelectorW('header');

botaoIniciar.addEventListener('click', () => {
    headerInicio.style.opacity = 0;
    headerInicio.style.backgroundColor = 'transparent';
});