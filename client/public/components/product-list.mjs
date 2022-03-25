import { RegisterComponent, Component } from './components.mjs';

class ProductList extends Component {
    static __IDENTIFY() { return 'product-list'; }

    constructor() {
        super(ProductList);
    }

    async Render() {
        const route = this.state.getroute;
        const products = await fetch(route).then(response => response.json());

        return {
            template: `
                <h1>{this.state.title}</h1>
                <div class="product-list">
                    ${products.data.map(product => {
                        return `<compact-listing-component name="${product.name}"
                                    desc="${product.description}"
                                    image="${product.image}"
                                    price="${product.price}"></compact-listing-component>`;
                    })}
                </div>
            `,
            style: `
                .product-list {
                    display: flex;
                    flex-wrap: wrap;
                    margin: 0 auto;
                    max-width: 800px;
                }
            `,
            state: {
                ...this.getState,
                products,
            },
        };
    }


    OnceRendered() {


    }
}

RegisterComponent(ProductList);
