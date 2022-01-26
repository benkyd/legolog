const menuToggler = document.querySelector('navbar-component').shadowRoot.querySelector('#menu-toggler');
const navMenu = document.querySelector('navbar-component').shadowRoot.querySelector('.navbar');

menuToggler.addEventListener('click', function() {
    menuToggler.classList.toggle('menu-active');
    navMenu.classList.toggle('menu-active');
});
