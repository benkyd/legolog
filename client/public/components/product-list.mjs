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
                <h2>{this.state.title}</h2>
                <div class="product-list">
                    ${products.data.map(product => {
                        return `<compact-listing-component name="${product.name}"
                                    image="${product.image}"
                                    price="${product.price}"
                                    discount="${product.discount || ''}"></compact-listing-component>
                        `;
                    }).join('')}
                </div>
            `,
            style: `
                h2 {
                    margin-block-start: 0;
                }
                .product-list {
                    display: flex;
                    justify-content: space-evenly;
                    flex-wrap: wrap;
                    margin: 0 auto;
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
