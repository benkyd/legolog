import { RegisterComponent, Component, SideLoad } from './components.mjs';

class StoreFront extends Component {
    static __IDENTIFY() { return 'storefront'; }

    constructor() {
        super(StoreFront);
    }

    Render() {
        return {
            template: SideLoad('./components/templates/storefront.html'),
            style: SideLoad('./components/css/storefront.css'),
        };
    }

    OnceRendered() {
        const items = ['item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7', 'item8', 'item9', 'item10'];
        for (const item of items) {
            const itemElement = document.createElement('compact-listing-component');
            itemElement.setAttribute('item', item);
            this.root.appendChild(itemElement);
        }
    }
}

RegisterComponent(StoreFront);
