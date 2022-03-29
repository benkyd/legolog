import { RegisterComponent, Component, SideLoad } from './components.mjs';

class ProductListing extends Component {
    static __IDENTIFY() { return 'product-listing'; }

    constructor() {
        super(ProductListing);
    }

    OnMount() {
        console.log(this.state);
    }

    async Render() {
        const route = this.getState.getroute;
        // const productDetails = await fetch(route).then(response => response.json());

        return {
            template: SideLoad('./components/templates/product-listing.html'),
            style: SideLoad('./components/css/product-listing.css'),
        };
    }

    OnRender() {

    }
}

RegisterComponent(ProductListing);
