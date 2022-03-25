import { RegisterComponent, Component, SideLoad } from './components.mjs';

class NavBar extends Component {
    static __IDENTIFY() { return 'navbar'; }

    constructor() {
        super(NavBar);
    }

    Render() {
        return {
            template: SideLoad('./components/templates/navbar.html'),
            style: SideLoad('./components/css/navbar.css'),
        };
    }

    OnceRendered() {
        const menuToggler = document.querySelector('navbar-component').shadowRoot.querySelector('#menu-toggler');
        const navMenu = document.querySelector('navbar-component').shadowRoot.querySelector('.navbar');

        menuToggler.addEventListener('click', function () {
            menuToggler.classList.toggle('menu-active');
            navMenu.classList.toggle('menu-active');
        });
    }
}

RegisterComponent(NavBar);
