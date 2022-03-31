import { RegisterComponent, Component } from './components.mjs';
import * as Helpers from '../helpers.mjs';

class CompactProductListing extends Component {
    static __IDENTIFY() { return 'compact-listing'; }

    constructor() {
        super(CompactProductListing);
    }

    Render() {
        return {
            template: `
                <div class="product-listing">
                    <div class="product-listing-image">
                        <img class="product-image" 
                            title="Image of {this.state.name}" 
                            alt="Image of {this.state.name}"     
                            src="{this.state.image}">
                    </div>
                    <div class="product-listing-info">
                        <div class="product-listing-name">{this.state.name}</div>
                        </a>
                        ${this.state.discount
                            ? '<span class="product-listing-price-full">£{this.state.price}</span><span class="product-listing-price-new">£{this.state.discount}</span>'
                            : '<span class="product-listing-price">£{this.state.price}</span>'}
                    </div>
                </div>
            `,
            style: `
                .product-listing {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    margin: 7px;
                    max-width: 320px;
                    z-index: 0;
                }
                
                .product-listing-image {
                    display: block;
                    margin: 0 auto;
                    margin-bottom: 7px;
                    max-width: 100%;
                }
                
                .product-image:hover {
                    cursor: hand;
                }
                
                .product-listing-info {
                    display: flex;
                    align-items: flex-start;
                    flex-direction: column;
                    max-width: 100%;
                }

                .product-listing-name {
                    font-size: 1.2em;
                    font-weight: bold;
                }

                .product-listing-name:hover {
                    cursor: hand;
                    text-decoration: underline;
                }

                .product-listing-price {
                    font-size: 1.1em;
                }

                .product-listing-price-full {
                    text-decoration: line-through;
                    font-size: 0.9em;
                }
                .product-listing-price-new {
                    font-weight: bold;
                    color: red;
                    font-size: 1.1em;
                }

                @media (pointer:none), (pointer:coarse), screen and (max-width: 900px) {
                    .product-listing {
                        margin: 3px;
                        width: 400px;
                    }
                    .product-listing-image {
                        display: block;
                    }
                    .product-image {
                        max-width: 100%;
                        max-height: 100%;
                    }
                }
            `,
        };
    }

    OpenProductListing() {
        const location = document.querySelector('#current-open-listing');

        // Open the product listing
        const productListing = document.createElement('product-listing-component');
        productListing.setAttribute('id', this.state.id);
        productListing.setAttribute('type', this.state.type);
        location.appendChild(productListing);

        Helpers.SwapActivePage('store', 'current-open-listing');
    }

    OnRender() {
        const image = this.root.querySelector('.product-image');
        const name = this.root.querySelector('.product-listing-name');
        image.addEventListener('click', () => {
            this.OpenProductListing(Object.bind(this));
        });
        name.addEventListener('click', () => {
            this.OpenProductListing(Object.bind(this));
        });
    }
}

RegisterComponent(CompactProductListing);
