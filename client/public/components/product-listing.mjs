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
            template: `
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
                                    return `<span class="tag">${tag}</span>`;
                                }).join('')}
                            </div>

                            <div class="product-name">{this.state.name} [{this.state.date_released}]</div>
                            ${this.state.discount
                                ? '<span class="product-listing-price-full">£{this.state.price}</span><span class="product-listing-price-new">£{this.state.discount}</span>'
                                : '<span class="product-listing-price">£{this.state.price}</span>'}
                            <div class="product-description">{this.state.description}</div>

                            <div class="product-quantity-selector">
                                <button class="product-quantity-button" type="button">-</button>
                                <input class="quantity-input" type="number" value="1" min="1" max="{this.state.quantity}">
                                <button class="product-quantity-button" type="button">+</button>
                            </div>

                            <div class="product-add-to-basket">
                                <button class="add-to-basket-button">Add to Basket</button>
                                <img class="add-to-favorites-button" src="https://www.svgrepo.com/show/25921/heart.svg" width="45px" stroke="#222" stroke-width="2px" alt="Add to Favorites" title="Add to Favorites">
                            </div>

                            <div class="product-details-collapsible">
                                <div class="product-details-header">
                                    <span class="product-details-header-text">Product Details</span>
                                    <img class="product-details-header-arrow" src="/res/back-arrow.svg" height="30em" alt="down-arrow">
                                </div>
                                <div class="product-details-content">
                                    <div class="product-details-content-item">
                                        <span class="product-details-date">Released in {this.state.date_released}</span>
                                    </div>
                                    <div class="product-details-content-item">
                                        <span class="product-details-dimensions">Dimensions:&nbsp;</span>
                                        <span class="product-details-dimensions-value">
                                            {this.state.dimensions_x} x {this.state.dimensions_y} x {this.state.dimensions_z}
                                        </span>
                                    </div>
                                    <div class="product-details-content-item">
                                        <span class="product-details-weight">Weight:&nbsp;</span>
                                        <span class="product-details-weight-value">{this.state.weight}</span>
                                        <span class="product-details-weight-unit">g</span>
                                    </div>
                                    <div class="product-details-content-item">
                                        Not suitable for children under the age of 3 years old, small parts are a choking hazard.
                                    </div>
                                    <div class="product-details-content-item">
                                        Not for individual resale.
                                    </div>
                                </div>
                            </div>
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

        // product details, collapsable
        const collapseButton = this.root.querySelector('.product-details-header');
        const collapseContent = this.root.querySelector('.product-details-content');
        const collapseArrow = this.root.querySelector('.product-details-header-arrow');

        collapseButton.addEventListener('click', () => {
            collapseContent.classList.toggle('details-open');
            collapseArrow.classList.toggle('product-details-header-arrow-down');
        });

        // add quantity to basket and then update the basket count
        const addToBasket = this.root.querySelector('.add-to-basket-button');
        const basketCount = this.root.querySelector('.quantity-input');

        addToBasket.addEventListener('click', () => {
            AddProductToBasket(this.state.id, Math.abs(parseInt(basketCount.value)));
            basketCount.value = 1;
        });
    }
}

RegisterComponent(ProductListing);
