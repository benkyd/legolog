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

        const getProductURL = new URL(`/api/${type}/${id}`, document.baseURI);
        const productData = await fetch(getProductURL).then(response => response.json());

        let setContents = [];
        if (productData.data.type === 'set') {
            const allPieces = [];
            Object.keys(productData.data.includedPieces).forEach(key => {
                allPieces.push(key);
            });

            const bulkSets = await fetch('/api/bulk/brick', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ids: allPieces,
                }),
            }).then(response => response.json());
            setContents = bulkSets.data;
        }

        this.setState({
            ...this.getState,
            ...productData.data,
            setContents,
        }, false);
    }

    Render() {
        let setContents = '';
        console.log(this.state)
        if (this.state.type === 'set') {
            setContents = /* html */`
            <div class="collapsible-menu">
                <div class="menu-header"> 
                    <span class="menu-header-text">Set Contents</span>
                    <img class="menu-header-arrow" src="/res/back-arrow.svg" height="30em" alt="down-arrow">
                </div>
                <div class="menu-content scrollable-container">
                    ${this.state.setContents.map(piece => /* html */`
                        <div class="set-piece-container">
                            <span class="set-piece-amount">x${this.state.includedPieces[piece.id]}</span>
                            <super-compact-listing-component class="sc-listing" id="${piece.id}"
                                                             name="${piece.name}"
                                                             tag="${piece.tag}"
                                                             type="piece"
                                                             price="${piece.price || piece.discount}">
                            </super-compact-listing-component>
                        </div>
                    `).join('')}
                </div>
            </div>
            `;
        }

        return {
            template: /* html */`
                <div class="product-page">
                    <div class="back-button">
                        <img class="back-button-svg" src="/res/back-arrow.svg" height="60em" alt="back-arrow">
                    </div>

                    <div class="product-display">

                        <div class="product-image-container">
                            <img class="active-image" src="{this.state.image}" alt="Image of {this.state.name}" title="Image of {this.state.name}">
                        </div>
                        
                        <div class="product-info">
                            <div class="product-tags">
                                ${this.state.tags.map(tag => {
                                    return `<tag-component name="${tag}"></tag-component>`;
                                }).join('')}
                            </div>

                            <div class="product-name">{this.state.name} {this.state.id}</div>
                            ${this.state.discount
                                ? '<span class="product-listing-price-full">£{this.state.price}</span><span class="product-listing-price-new">£{this.state.discount}</span>'
                                : '<span class="product-listing-price">£{this.state.price}</span>'}
                            <div class="product-description">{this.state.description}</div>

                            <div class="product-quantity-selector">
                                <button class="product-quantity-button reduce-quantity" type="button">-</button>
                                <input class="quantity-input" type="number" value="1" min="1" max="{this.state.stock}">
                                <button class="product-quantity-button increase-quantity" type="button">+</button>
                                <span class="product-quantity">&nbsp;{this.state.stock} in stock</span>
                            </div>

                            <div class="product-add-to-basket">
                                <button class="add-to-basket-button">Add to Basket</button>
                                <img class="add-to-favorites-button" src="https://www.svgrepo.com/show/25921/heart.svg" width="45px" stroke="#222" stroke-width="2px" alt="Add to Favorites" title="Add to Favorites">
                            </div>

                            <div class="collapsible-menu">
                                <div class="menu-header">
                                    <span class="menu-header-text">Product Details</span>
                                    <img class="menu-header-arrow" src="/res/back-arrow.svg" height="30em" alt="down-arrow">
                                </div>
                                <div class="menu-content">
                                    <div class="product-details-content-item">Released in {this.state.date_released}</div>
                                    <div class="product-details-content-item">Dimensions: {this.state.dimensions_x} x {this.state.dimensions_y} x {this.state.dimensions_z}</div>
                                    <div class="product-details-content-item">Weight: {this.state.weight}g</div>
                                    <div class="product-details-content-item">Not suitable for children under the age of 3 years old, small parts are a choking hazard.</div>
                                    <div class="product-details-content-item">Not for individual resale.</div>
                                </div>
                            </div>

                            ${setContents}
                        </div>
                    
                    </div>
                </div>
            `,
            style: SideLoad('/components/css/product-listing.css'),
        };
    }

    OnRender() {
        const backButton = this.root.querySelector('.back-button-svg');

        backButton.addEventListener('click', () => {
            window.history.back();
        });

        // TODO: add event listeners for quantity buttons
        const quantityInput = this.root.querySelector('.quantity-input');
        const increaseQuantityButton = this.root.querySelector('.increase-quantity');
        const reduceQuantityButton = this.root.querySelector('.reduce-quantity');

        quantityInput.value = 1;

        quantityInput.addEventListener('change', () => {
            if (typeof quantityInput.value !== 'number') {
                quantityInput.value = 1;
            }
            if (quantityInput.value > this.state.stock) {
                quantityInput.value = this.state.stock;
            }
        });

        increaseQuantityButton.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);
            if (quantity < this.state.stock) {
                quantityInput.value = quantity + 1;
            }
        });

        reduceQuantityButton.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);
            if (quantity > 1) {
                quantityInput.value = quantity - 1;
            }
        });

        // product details, collapsable
        const collapseButton = this.root.querySelectorAll('.menu-header');

        collapseButton.forEach(el => el.addEventListener('click', (e) => {
            const parent = e.path[2].querySelector('.collapsible-menu') ? e.path[1] : e.path[2];
            const collapseContent = parent.querySelector('.menu-content');
            const collapseArrow = parent.querySelector('.menu-header-arrow');
            collapseContent.classList.toggle('details-open');
            collapseArrow.classList.toggle('menu-header-arrow-down');
        }));

        // add quantity to basket and then update the basket count
        const addToBasket = this.root.querySelector('.add-to-basket-button');

        addToBasket.addEventListener('click', () => {
            AddProductToBasket(this.state.id, Math.abs(parseInt(quantityInput.value)));
            quantityInput.value = 1;
        });
    }
}

RegisterComponent(ProductListing);
