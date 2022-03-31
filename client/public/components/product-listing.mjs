import { RegisterComponent, Component, SideLoad } from './components.mjs';
import * as Helpers from '../helpers.mjs';

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
        const backButton = this.root.querySelector('.back-button-svg');

        backButton.addEventListener('click', async () => {
            await Helpers.SwapActivePage('current-open-listing', 'store');
            // clean up
            const location = document.querySelector('#current-open-listing');
            location.removeChild(location.lastChild);
        });
    }
}

RegisterComponent(ProductListing);
