import { RegisterComponent, Component } from './components.mjs';

// super compact listing is interoperable through types which makes it exteremeely poggers and also portable
class SuperCompactProductListing extends Component {
    static __IDENTIFY() { return 'super-compact-listing'; }

    constructor() {
        super(SuperCompactProductListing);
    }

    async OnMount() {
        if (!this.state.name || !this.state.price) {
            const product = (await fetch(`/api/${this.state.type}/${this.state.id}`).then(res => res.json())).data;
            const name = product.name;
            const price = product.discount || product.price;
            const tag = product.tag;
            const tags = product.tags;
            const colours = product.colours;

            this.setAttribute('stock', product.stock);

            this.setState({
                ...this.getState,
                name,
                price,
                tag,
                tags,
                colours,
                quantity: product.quantity,
            }, false);
        } else if (this.state.tags) {
            const tags = JSON.parse(this.state.tags);
            this.setState({
                ...this.getState,
                tags,
            }, false);
        }
    }

    Update(attributeChanged, newState) {
        // console.log(attributeChanged, newState);
        // if (attributeChanged === 'stock') {
        //     return;
        // }
        // if (newState.id !== this.state.id || newState.type !== this.state.type) {
        //     this.OnMount();
        // }
    }

    Render() {
        let modifierPreview = '';
        if (this.state.modifier) {
            if (this.state.modifier !== '0') {
                modifierPreview = /* html */`
                    <span class="brick-colour-demonstrator" style="background-color: #${this.state.colours[this.state.modifier].hexrgb}"></span>                
                `;
            }
        }

        return {
            template: /* html */`
                <span class="product-listing">
                    <span class="product-listing-image">
                        <img class="product-image" 
                            title="Image of {this.state.name}" 
                            alt="Image of {this.state.name}"     
                            src="/api/cdn/${this.state.id}${this.state.bigimage ? '' : '-thumb'}.png">
                        </span>
                        ${modifierPreview}
                    <span class="product-listing-info">
                        <span class="product-listing-name">{this.state.name}</span>
                        <div class="product-listing-modifier">${this.state.modifier ? `Colour: ${this.state.colours[this.state.modifier].name}` : ''}</div>
                        <span class="product-listing-tags">
                            ${this.state.tags
                                    ? this.state.tags.map(tag => `<tag-component name="${tag}"></tag-component>`).join('')
                                    : `<tag-component name="${this.state.tag}"></tag-component>`}
                        </span>
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
                    padding-top: 5px;
                    padding-bottom: 5px;
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

                .brick-colour-demonstrator {
                    position: absolute;
                    margin: 0 auto;
                    margin-bottom: 7px;
                    align-self: flex-start;
                    left: 0;
                    width: 30px;
                    height: 30px;
                    margin-right: 0.5em;
                    border: #1A1A1A solid 1px;
                }
                
                .product-image {
                    max-height: 110px;
                    max-width: 110px;
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

                .product-listing-modifier {
                    font-size: 0.8em;
                    font-style: italic;
                    color: #999;
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
