import { RegisterComponent, Component, SideLoad } from './components.mjs';

class ProductListing extends Component {
    static __IDENTIFY() { return 'product-listing'; }

    constructor() {
        super(ProductListing);
    }

    async OnMount() {
        const getURL = new URL(`/api/${this.state.type}/${this.state.id}`, document.baseURI);
        const data = await fetch(getURL).then(response => response.json());
        this.setState({
            ...this.getState,
            ...data.data[0],
        });
        console.log(this.getState);
    }

    Render() {
        return {
            template: SideLoad('./components/templates/product-listing.html'),
            style: SideLoad('./components/css/product-listing.css'),
        };
    }

    OnRender() {

    }
}

RegisterComponent(ProductListing);
