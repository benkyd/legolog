import { RenderComponent, BaseComponent, SideLoad } from './components.mjs';

class SearchBar extends BaseComponent {

}

class NavBar extends BaseComponent {
    static __IDENTIFY() { return 'navbar'; }

    Render() {
        return {
            template: SideLoad('./components/navbar.html'),
            style: SideLoad('./components/css/navbar.css'),
        };
    }
}

RenderComponent(NavBar);
