import { RegisterComponent, Component, SideLoad } from './components.mjs';
import { AddProductToBasket } from './basket.mjs';

class ProductListing extends Component {
    static __IDENTIFY() { return 'product-listing'; }

    constructor() {
        super(ProductListing);
    }

    async OnMount() {
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        const id = urlParams.get('id');

        const getURL = new URL(`/api/${type}/${id}`, document.baseURI);
        const data = await fetch(getURL).then(response => response.json());
        console.log(data);
        this.setState({
            ...this.getState,
            ...data.data,
        });
    }

    Render() {
        return {
            template: SideLoad('/components/templates/product-listing.html'),
            style: SideLoad('/components/css/product-listing.css'),
        };
    }

    OnRender() {
        const backButton = this.root.querySelector('.back-button-svg');

        backButton.addEventListener('click', () => {
            window.history.back();
        });

        // add quantity to basket and then update the basket count
        const addToBasket = this.root.querySelector('.add-to-cart-button');
        const basketCount = this.root.querySelector('.quantity-input');

        addToBasket.addEventListener('click', () => {
            AddProductToBasket(this.state.id, Math.abs(parseInt(basketCount.value)));
            basketCount.value = 1;
        });
    }
}

RegisterComponent(ProductListing);
