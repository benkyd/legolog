import { RegisterComponent, Component } from './components.mjs';
import * as BasketMaster from '../basket.mjs';

class Basket extends Component {
    static __IDENTIFY() { return 'basket'; }

    constructor() {
        super(Basket);
    }

    OnMount() {
        const basket = localStorage.getItem('basket');
        if (basket) {
            const basketItems = JSON.parse(basket);
            this.setState({
                ...basketItems,
            }, false);
        } else {
            this.setState({
                items: {},
                total: 0,
            }, false);
        }
    }

    Render() {
        return {
            template: /* html */`
                <div class="basket">
                    <div class="basket-header">
                        <div class="basket-header-title">
                            Your Basket
                        </div>
                        <div class="basket-header-total">
                            Total: <span class="basket-total">{this.state.total}</span> items
                        </div>
                    </div>
                    <div class="basket-items">
                        <div class="basket-items-list">
                            ${Object.keys(this.state.items).map((key) => {
                                const item = this.state.items[key];
                                const modifier = key.includes('~');
                                return /* html */`
                                    <div class="basket-item">
                                        <super-compact-listing-component class="basket-item-listing"
                                            id="${key.split('~')[0]}"
                                            type="${item.type}"
                                            bigimage="true"
                                            ${modifier ? `modifier="${key.split('~')[1]}"` : ''}>
                                        </super-compact-listing-component>
                                        <div class="basket-item-content">
                                            <div class="product-quantity-selector">
                                                <button class="product-quantity-button reduce-quantity" type="button">-</button>
                                                <input class="quantity-input" type="number" value="${item.quantity}" min="0" max="{item.stock}">
                                                <button class="product-quantity-button increase-quantity" type="button">+</button>
                                                <span class="product-quantity">&nbsp;<span class="stock-number">0</span> in stock</span>
                                                </div>
                                            <button class="product-quantity-button remove-quantity" type="button">Remove</button>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                    </div>
                    <div class="basket-footer">
                        <!-- subtotal -->
                        <div class="basket-footer-subtotal">
                            Subtotal: £<span class="basket-subtotal">0.00</span>
                        </div>
                        <!-- checkout button -->
                        <div class="basket-footer-checkout">
                            <a href="/checkout"><button class="basket-footer-button checkout-button" type="button">Checkout as ${localStorage.user}</button></a>
                        </div>
                    </div>
            `,
            style: `
                .basket {
                    padding-top: 10px;
                }

                .basket-header {
                    display: flex;
                    font-size: 2em;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    border-bottom: 1px solid #ccc;
                }

                .basket-item {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
                
                .basket-item-listing {
                    font-size: 1.2em;
                    flex-basis: 65%;
                    flex-grow: 4;
                }

                @media (pointer:none), (pointer:coarse), screen and (max-width: 900px) {
                    .basket-item {
                        flex-direction: column;
                    }

                    .basket-item-listing {
                        font-size: 1.3em;
                        width: 100%;
                        flex-basis: 100%;
                        flex-grow: 4;
                    }
                }

                .basket-item-content {
                    flex-basis: 35%;
                    flex-grow: 1;
                    width: 100%;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                    align-items: center;
                }

                .product-quantity-selector {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    font-size: 1em;
                }
                
                .product-quantity-button {
                    cursor: pointer;
                    font-size: 1.7em;
                    border: #1A1A1A solid 1px;
                    background-color: #F5F6F6;
                    border-radius: 0.2em;
                    width: 1.5em;
                    height: 1.5em;
                }

                .remove-quantity {
                    font-size: 1em;
                    width: fit-content;
                }
                
                /* https://www.w3schools.com/howto/howto_css_hide_arrow_number.asp */
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                  -webkit-appearance: none;
                  margin: 0;
                }
                input[type=number] {
                  -moz-appearance: textfield;
                }
                
                .quantity-input {
                    height: 2.2em;
                    width: 3.7em;
                    background-color: #F5F6F6;
                    border-top: #1A1A1A solid 1px;
                    border-bottom: #1A1A1A solid 1px;
                    border-right: none;
                    border-left: none;
                    text-align: center;
                    font-size: 1.2em;
                }

                .basket-footer {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    border-top: 1px solid #ccc;
                }

                .basket-footer-subtotal {
                    font-size: 1.5em;
                }

                .basket-footer-checkout {
                    flex-basis: 70%;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                    align-items: center;
                }

                .basket-footer-button {
                    cursor: pointer;
                    background-color: #222;
                    border: none;
                    color: #F5F6F6;
                    padding: 0.5em;
                    margin-left: 1em;
                    font-size: 1.4em;
                    transition: all 0.2s ease-in;
                }
                
                .basket-footer-button:hover {
                    background-color: #F5F6F6;
                    outline: 2px solid #222;
                    color: #222;
                }

                .button-disabled {
                    background-color: #ccc;
                    color: #222;
                    cursor: not-allowed;
                    pointer-events: all !important;
                }
            `,
        };
    }

    async UpdateSubtotal() {
        const subtotal = await BasketMaster.GetBasketTotalPrice();
        const basketSubtotal = this.root.querySelector('.basket-subtotal');
        if (basketSubtotal) {
            basketSubtotal.innerText = parseFloat(subtotal).toFixed(2);
        }
        if (parseFloat(basketSubtotal.innerText) === 0.0) {
            // gray out checkout button
            const checkoutButton = this.root.querySelector('.checkout-button');
            checkoutButton.classList.add('button-disabled');
            checkoutButton.disabled = true;
        } else {
            // un-gray checkout button
            const checkoutButton = this.root.querySelector('.checkout-button');
            checkoutButton.classList.remove('button-disabled');
            checkoutButton.disabled = false;
        }
    }

    OnRender() {
        this.UpdateSubtotal();
        this.root.querySelectorAll('.basket-item-listing').forEach((listing) => {
            // listen to mutations on the attribute stock because the stock is updated once the
            // super compact listing is loaded and the stock is updated
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'stock') {
                        const stock = parseInt(mutation.target.getAttribute('stock'));

                        const itemCompositeId = mutation.target.getAttribute('id') + (mutation.target.getAttribute('modifier') ? '~' + mutation.target.getAttribute('modifier') : '');
                        const item = this.state.items[itemCompositeId];
                        if (item) {
                            item.stock = stock;
                            this.setState({
                                items: {
                                    ...this.state.items,
                                    [itemCompositeId]: item,
                                },
                                ...this.state,
                            }, false);
                        }
                        // update the stock number
                        const stockNumber = mutation.target.parentElement.querySelector('.stock-number');
                        stockNumber.innerText = stock;
                        const stockMax = mutation.target.parentElement.querySelector('.quantity-input');
                        stockMax.setAttribute('max', stock);
                    }
                });
            });
            observer.observe(listing, {
                attributes: true,
                attributeFilter: ['stock'],
            });
        });


        // set up each button to update the quantity and remove if it is zero
        this.root.querySelectorAll('.product-quantity-button').forEach((button) => {
            button.addEventListener('click', (event) => {
                let clickedItem = event.target.parentElement;
                let listing = clickedItem.querySelector('.basket-item-listing');
                while (listing === null) {
                    clickedItem = clickedItem.parentElement;
                    listing = clickedItem.querySelector('.basket-item-listing');
                }

                const id = listing.getAttribute('id');
                const modifier = listing.getAttribute('modifier');
                const compositeId = id + (modifier ? `~${modifier}` : '');
                const item = this.state.items[compositeId];

                // update the quantity
                if (event.target.classList.contains('reduce-quantity')) {
                    if (item.quantity > 0) {
                        item.quantity--;
                        BasketMaster.RemoveProductFromBasket(id, item.type, 1, modifier);
                    }
                    if (item.quantity === 0) {
                        BasketMaster.RemoveProductFromBasket(id, item.type, item.quantity, modifier);
                        this.UpdateSubtotal();

                        return this.setState({
                            ...this.state,
                            total: BasketMaster.GetBasketTotal(),
                            items: {
                                ...BasketMaster.GetBasketItems(),
                            },
                        });
                    }
                } else if (event.target.classList.contains('increase-quantity')) {
                    if (item.quantity < item.stock) {
                        item.quantity++;
                        BasketMaster.AddProductToBasket(id, item.type, 1, modifier);
                    }
                } else if (event.target.classList.contains('remove-quantity')) {
                    BasketMaster.RemoveProductFromBasket(id, item.type, item.quantity, modifier);
                    this.UpdateSubtotal();

                    return this.setState({
                        ...this.state,
                        total: BasketMaster.GetBasketTotal(),
                        items: {
                            ...BasketMaster.GetBasketItems(),
                        },
                    });
                }

                // update the total
                this.setState({
                    ...this.state,
                    total: BasketMaster.GetBasketTotal(),
                    items: {
                        ...this.state.items,
                        [compositeId]: item,
                    },
                }, false);

                // update the total so it doesn't need to be rendered again
                const total = this.root.querySelector('.basket-total');
                total.innerText = this.state.total;
                // and the same on the item
                const itemTotal = clickedItem.querySelector('.quantity-input');
                itemTotal.value = parseInt(item.quantity);
                this.UpdateSubtotal();
            });
        });


        // do the same but with the input field
        this.root.querySelectorAll('.quantity-input').forEach((input) => {
            input.addEventListener('change', (event) => {
                let clickedItem = event.target.parentElement;
                let listing = clickedItem.querySelector('.basket-item-listing');
                while (listing === null) {
                    clickedItem = clickedItem.parentElement;
                    listing = clickedItem.querySelector('.basket-item-listing');
                }

                const id = listing.getAttribute('id');
                const modifier = listing.getAttribute('modifier');
                const compositeId = id + (modifier ? `~${modifier}` : '');
                const item = this.state.items[compositeId];

                // update the quantity
                if (event.target.value < 0) {
                    event.target.value = 0;
                }
                if (event.target.value > item.stock) {
                    event.target.value = item.stock;
                }

                if (parseInt(event.target.value) === 0) {
                    BasketMaster.RemoveProductFromBasket(id, item.type, item.quantity, modifier);

                    return this.setState({
                        ...this.state,
                        total: BasketMaster.GetBasketTotal(),
                        items: {
                            ...BasketMaster.GetBasketItems(),
                        },
                    });
                }

                // if has gone up in quantity then add it
                if (item.quantity < event.target.value) {
                    BasketMaster.AddProductToBasket(id, item.type, event.target.value - item.quantity, modifier);
                    item.quantity = parseInt(event.target.value);
                } else if (item.quantity > event.target.value) {
                    BasketMaster.RemoveProductFromBasket(id, item.type, item.quantity - event.target.value, modifier);
                    item.quantity = parseInt(event.target.value);
                }

                this.UpdateSubtotal();

                // update the total
                this.setState({
                    ...this.state,
                    total: BasketMaster.GetBasketTotal(),
                    items: {
                        ...this.state.items,
                        [compositeId]: item,
                    },
                }, false);


                // update the total so it doesn't need to be rendered again
                const total = this.root.querySelector('.basket-total');
                total.innerText = this.state.total;
            });
        });
    }
}

RegisterComponent(Basket);
