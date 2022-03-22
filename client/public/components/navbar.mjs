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
    }
}

RegisterComponent(NavBar);
