import { RegisterComponent, Component } from './components.mjs';

// super compact listing is interoperable through types which makes it exteremeely poggers and also portable

class SuperCompactProductListing extends Component {
    static __IDENTIFY() { return 'super-compact-listing'; }

    constructor() {
        super(SuperCompactProductListing);
    }

    Render() {
        return {
            template: /* html */`
                <span class="product-listing">
                    <span class="product-listing-image">
                        <img class="product-image" 
                            title="Image of {this.state.name}" 
                            alt="Image of {this.state.name}"     
                            src="/api/cdn/${this.state.id}-thumb.png">
                    </span>
                    <span class="product-listing-info">
                        <span class="product-listing-name">{this.state.name}</span>
                        <tag-component name="{this.state.tag}"></tag-component>
                    </span>
                    <span class="product-pricing">
                        £${parseFloat(this.state.price).toFixed(2)}
                    </span>
                </span>
            `,
            style: `
                .product-listing {
                    width: 95%;
                    background-color: #F5F6F6;
                    position: relative;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    padding-left: 10px;
                    padding-right: 15px;
                    margin: 7px;
                    z-index: 0;
                    cursor: pointer;
                }
                
                .product-listing-image {
                    display: block;
                    margin: 0 auto;
                    margin-bottom: 7px;
                    max-width: 100%;
                    flex-grow: 1
                }
                
                .product-image {
                    object-fit: scale-down;
                    object-position: center;
                }
                
                .product-image:hover {
                    cursor: hand;
                }
                
                .product-listing-info {
                    border-left: 1px solid #ccc;
                    border-right: 1px solid #ccc;
                    padding-left: 7px;
                    padding-right: 7px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    flex-grow: 50
                }

                .product-pricing {
                    flex-grow: 1;
                    text-align: right;
                    font-size: 0.8em;
                    font-weight: bold;
                    color: #E55744;
                }
            `,
        };
    }

    OnRender() {
        this.root.addEventListener('click', () => {
            window.location.href = `/product/?type=${this.state.type}&id=${this.state.id}&name=${encodeURIComponent(this.state.name)}`;
        });
    }
}

RegisterComponent(SuperCompactProductListing);
