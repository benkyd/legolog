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
                                    id="${product.id}"
                                    listing="${product.listing}"
                                    image="${product.image}"
                                    price="${product.price}"
                                    discount="${product.discount || ''}"></compact-listing-component>
                        `;
                    }).join('')}
                </div>
                <!--Infinite Loading-->
                <div class="product-list-loader">
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
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

                .product-list-buttons {
                    display: flex;
                    justify-content: space-evenly;
                    margin: 0 auto;
                }

                .product-list-button {
                    max-width: 100px;
                    padding: 5px;
                    font-size: 1em;
                    font-weight: bold;
                    background-color: #85DEFF;
                    color: #fff;
                    border: none;
                }

                .lds-ring {
                    display: inline-block;
                    position: relative;
                    width: 80px;
                    height: 80px;
                }
                .lds-ring div {
                    box-sizing: border-box;
                    display: block;
                    position: absolute;
                    width: 64px;
                    height: 64px;
                    margin: 8px;
                    border: 8px solid #fff;
                    border-radius: 50%;
                    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                    border-color: #fff transparent transparent transparent;
                }
                .lds-ring div:nth-child(1) {
                    animation-delay: -0.45s;
                }
                .lds-ring div:nth-child(2) {
                    animation-delay: -0.3s;
                }
                .lds-ring div:nth-child(3) {
                    animation-delay: -0.15s;
                }
                @keyframes lds-ring {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
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
