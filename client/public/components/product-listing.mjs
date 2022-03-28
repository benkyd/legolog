import { RegisterComponent, Component } from './components.mjs';

class ProductListing extends Component {
    static __IDENTIFY() { return 'product-listing'; }

    constructor() {
        super(ProductListing);
    }

    async Render() {
        const route = this.state.getroute;
        const productDetails = await fetch(route).then(response => response.json());
    }


    OnceRendered() {


    }
}

RegisterComponent(ProductListing);
