import { RegisterComponent, Component } from './components.mjs';

class CompactProductListing extends Component {
    static __IDENTIFY() { return 'compact-listing'; }

    constructor() {
        super(CompactProductListing);
    }

    OnMount() {
        if (this.state.tags) {
            const tags = JSON.parse(this.state.tags);
            this.setState({
                ...this.getState,
                tags,
            }, false);
        }
    }

    Render() {
        return {
            template: /* html */`
                <div class="product-listing">
                    <div class="product-listing-image">
                        <img class="product-image" 
                            title="Image of {this.state.name}" 
                            alt="Image of {this.state.name}"     
                            src="/api/cdn/${this.state.id}.png">
                    </div>
                    <div class="product-listing-info">
                        <div class="product-listing-name">{this.state.name} {this.state.id}</div>
                        </a>
                        <span class="product-listing-tags">
                            ${this.state.tags
                                ? this.state.tags.map(tag => `<tag-component name="${tag}"></tag-component>`).join('') 
                                : ''}
                        </span>
                        ${this.state.discount
                            ? `<span class="product-listing-price-full">£${parseFloat(this.state.price).toFixed(2)}</span><span class="product-listing-price-new">£${parseFloat(this.state.discount).toFixed(2)}</span>`
                            : `<span class="product-listing-price">£${parseFloat(this.state.price).toFixed(2)}</span>`}
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

                .product-image {
                    width: 320px;
                    height: 320px;
                    object-fit: scale-down;
                    object-position: center;
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

                .product-listing-tags {
                    padding-top: 5px;
                    padding-bottom: 5px;
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
        window.location.href = `/product/?type=${this.state.type}&id=${this.state.id}&name=${encodeURIComponent(this.state.name)}`;
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
