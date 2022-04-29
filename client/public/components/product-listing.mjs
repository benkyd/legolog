import { RegisterComponent, Component, SideLoad } from './components.mjs';
import * as Basket from '../basket.mjs';
import * as LocalStorageListener from '../local-storage-listener.mjs';
import * as Auth from '../auth.mjs';

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

        this.state.image = `/api/cdn/${productData.data.id}.png`;

        if (productData.data.type !== 'set') {
            this.setState({
                ...this.getState,
                ...productData.data,
            }, false);
            return;
        }

        let setContents = [];
        const allBricks = [];
        Object.keys(productData.data.includedBricks).forEach(key => {
            allBricks.push(key);
        });

        const bulkSets = await fetch('/api/bulk/brick', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ids: allBricks,
            }),
        }).then(response => response.json());
        setContents = bulkSets.data;
        this.setState({
            ...this.getState,
            ...productData.data,
            setContents,
        }, false);
    }

    Render() {
        // set contents for sets
        let setContents = '';
        if (this.state.type === 'set') {
            setContents = /* html */`
            <div class="collapsible-menu">
                <div class="menu-header"> 
                    <span class="menu-header-text">Set Contents</span>
                    <img class="menu-header-arrow" src="/res/back-arrow.svg" height="30em" alt="down-arrow">
                </div>
                <div class="menu-content scrollable-container">
                    ${this.state.setContents.map(brick => /* html */`
                        <div class="set-brick-container">
                            <span class="set-brick-amount">x${this.state.includedBricks[brick.id]}</span>
                            <super-compact-listing-component class="sc-listing" id="${brick.id}"
                                                             name="${brick.name}"
                                                             tag="${brick.tag}"
                                                             type="brick"
                                                             price="${brick.discount || brick.price}">
                            </super-compact-listing-component>
                        </div>
                    `).join('')}
                </div>
            </div>
            `;
        }

        // brick colour availability for bricks
        let brickColourAvailability = '';
        let brickColourSelector = '';
        if (this.state.type === 'brick') {
            brickColourAvailability = /* html */`
            <div class="collapsible-menu">
                <div class="menu-header"> 
                    <span class="menu-header-text">Colour Availability</span>
                    <img class="menu-header-arrow" src="/res/back-arrow.svg" height="30em" alt="down-arrow">
                </div>
                <div class="menu-content scrollable-container">
                    ${this.state.colours.map(colour => /* html */`
                        <div class="brick-colour-container">
                            <span class="brick-colour-demonstrator" style="background-color: #${colour.hexrgb}"></span>
                            <span class="brick-colour-name">${colour.name}</span>
                            <span class="brick-colour-types">&nbsp;In: ${colour.type}</span>
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>
            `;
            brickColourSelector = /* html */`
            <div class="brick-colour-selector">
                Select Brick Colour&nbsp;   
                <select class="brick-colour-selector-select">
                    ${this.state.colours.map(colour => /* html */`
                        <option value="${colour.id}">
                            ${colour.type} ${colour.name}
                        </option>
                    `).join('')}
                </select>
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
                                ? `<span class="product-listing-price-full">£${parseFloat(this.state.price).toFixed(2)}</span><span class="product-listing-price-new">£${parseFloat(this.state.discount).toFixed(2)}</span>`
                                : `<span class="product-listing-price">£${parseFloat(this.state.price).toFixed(2)}</span>`}
                            <div class="product-description">${this.state.description || this.state.name + ' ' + this.state.tag}</div>

                            ${brickColourSelector}

                            <div class="product-quantity-selector">
                                <button class="product-quantity-button reduce-quantity" type="button">-</button>
                                <input class="quantity-input" type="number" value="${this.state.stock < 1 ? '0' : '1'}" min="0" max="{this.state.stock}">
                                <button class="product-quantity-button increase-quantity" type="button">+</button>
                                <span class="product-quantity">&nbsp;{this.state.stock} in stock</span>
                            </div>

                            <br>
                            <div class="amount-in-basket">0 In Basket</div>

                            ${localStorage.getItem('stock-mode') === 'true'
                                ? /* html */`
                                    <div class="product-stock-mode">
                                        <span class="product-stock-mode-text">Change Stock</span>
                                        <input class="product-stock-mode-input" type="number" value="{this.state.stock}" min="0">
                                        <button class="product-stock-mode-button" type="button">Update</button>
                                    </div>
                                `
                                : ''
                            }

                            <div class="product-add-to-basket">
                                <button class="add-to-basket-button">Add to Basket</button>
                                <!-- <img class="add-to-favorites-button" src="https://www.svgrepo.com/show/25921/heart.svg" width="45px" stroke="#222" stroke-width="2px" alt="Add to Favorites" title="Add to Favorites"> -->
                            </div>

                            <div class="collapsible-menu">
                                <div class="menu-header">
                                    <span class="menu-header-text">Product Details</span>
                                    <img class="menu-header-arrow" src="/res/back-arrow.svg" height="30em" alt="down-arrow">
                                </div>
                                <div class="menu-content">
                                    ${this.state.date_released ? /* html */'<div class="product-details-content-item">Released in {this.state.date_released}</div>' : ''}
                                    <div class="product-details-content-item">Dimensions: {this.state.dimensions_x}mm x {this.state.dimensions_y}mm x {this.state.dimensions_z}mm</div>
                                    <div class="product-details-content-item">Weight: {this.state.weight}g</div>
                                    <div class="product-details-content-item">Not suitable for children under the age of 3 years old, small parts are a choking hazard.</div>
                                    <div class="product-details-content-item">Not for individual resale.</div>
                                </div>
                            </div>

                            ${setContents}
                            ${brickColourAvailability}
                        </div>
                    
                    </div>
                </div>
            `,
            style: SideLoad('/components/css/product-listing.css'),
        };
    }

    OnRender() {
        LocalStorageListener.ListenOnKey('stock-mode', () => {
            this.__INVOKE_RENDER();
        });

        if (localStorage.getItem('stock-mode') === 'true') {
            const updateStockButton = this.root.querySelector('.product-stock-mode-button');
            updateStockButton.addEventListener('click', async () => {
                const input = this.root.querySelector('.product-stock-mode-input');
                const stock = parseInt(input.value);
                this.state.stock = stock;
                this.__INVOKE_RENDER();

                // tell the server to update the stock
                const productId = this.state.id;
                const productType = this.state.type;

                const params = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${await Auth.GetToken()}`,
                    },
                    body: JSON.stringify({
                        new_stock_level: stock,
                    }),
                };

                fetch(`/api/auth/staff/stock/${productType}/${productId}`, params).then(response => response.json()).then(data => console.log(data));
            });
        }

        const backButton = this.root.querySelector('.back-button-svg');

        backButton.addEventListener('click', () => {
            window.history.back();
        });

        // TODO: add event listeners for quantity buttons
        const quantityInput = this.root.querySelector('.quantity-input');
        const increaseQuantityButton = this.root.querySelector('.increase-quantity');
        const reduceQuantityButton = this.root.querySelector('.reduce-quantity');
        const addToBasket = this.root.querySelector('.add-to-basket-button');
        this.root.querySelector('.amount-in-basket').innerText = `${Basket.GetItemAmountBasket(this.state.id)} In Basket`;

        quantityInput.value = 1;
        if (this.state.stock - Basket.GetItemAmountBasket(this.state.id) < 1) {
            quantityInput.value = 0;
        }

        if (this.state.stock === 0 || parseInt(quantityInput.value) === 0) {
            quantityInput.value = 0;
            increaseQuantityButton.disabled = true;
            reduceQuantityButton.disabled = true;
            addToBasket.disabled = true;
            addToBasket.innerText = 'Out of Stock';
        }

        quantityInput.addEventListener('change', () => {
            quantityInput.value = parseInt(quantityInput.value);

            if (quantityInput.value > this.state.stock + Basket.GetItemAmountBasket(this.state.id)) {
                quantityInput.value = this.state.stock;
            }
        });

        increaseQuantityButton.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);
            if (quantity + Basket.GetItemAmountBasket(this.state.id) < this.state.stock) {
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
        addToBasket.addEventListener('click', () => {
            // if it is a brick, get potential modifier from the drop down menu
            const brick = this.state.type === 'brick';
            const modifier = brick ? this.root.querySelector('.brick-colour-selector-select').value : undefined;

            Basket.AddProductToBasket(this.state.id, this.state.type, Math.abs(parseInt(quantityInput.value)), modifier);
            this.root.querySelector('.amount-in-basket').innerText = `${Basket.GetItemAmountBasket(this.state.id)} In Basket`;
            quantityInput.value = 1;
            if (this.state.stock - Basket.GetItemAmountBasket(this.state.id) < 1) {
                quantityInput.value = 0;
                quantityInput.value = 0;
                increaseQuantityButton.disabled = true;
                reduceQuantityButton.disabled = true;
                addToBasket.disabled = true;
                addToBasket.innerText = 'Out of Stock';
            }
        });
    }
}

RegisterComponent(ProductListing);
