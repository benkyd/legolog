import { RegisterComponent, Component } from './components.mjs';

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
                            Total: {this.state.total} items
                        </div>
                    </div>
                    <div class="basket-items">
                        <div class="basket-items-list">
                            ${Object.keys(this.state.items).map((key) => {
                                const item = this.state.items[key];
                                console.log(key, item);
                                const modifier = key.includes('~');
                                return /* html */`
                                    <div class="basket-item">
                                        <super-compact-listing-component class="basket-item-listing"
                                            id="${key.split('~')[0]}"
                                            type="${item.type}"
                                            bigimage="true"
                                            ${modifier ? `modifier="${key.split('~')[1]}"` : ''}>
                                        </super-compact-listing-component>
                                        <div class="product-quantity-selector">
                                            <button class="product-quantity-button reduce-quantity" type="button">-</button>
                                            <input class="quantity-input" type="number" value="${item.quantity}" min="0" max="{item.stock}">
                                            <button class="product-quantity-button increase-quantity" type="button">+</button>
                                            <span class="product-quantity">&nbsp;<span class="stock-number">0</span> in stock</span>
                                            </div>
                                        <button class="product-quantity-button remove-quantity" type="button">Remove</button>
                                    </div>
                                `;
                            }).join('')}
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
                    width: 100%;
                    margin: 0 auto;
                    font-size: 1.3em;
                }
                
                .product-quantity-selector {
                    flex-basis: 40%;
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
            `,
        };
    }

    OnRender() {
        this.root.querySelectorAll('.basket-item-listing').forEach((listing) => {
            // listen to mutations on the attribute stock because the stock is updated once the
            // super compact listing is loaded and the stock is updated
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'stock') {
                        const stock = parseInt(mutation.target.getAttribute('stock'));

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
                const item = event.target.parentElement.parentElement;
                const id = item.getAttribute('id');
                const type = item.getAttribute('type');
                const modifier = item.getAttribute('modifier');
                const quantity = parseInt(item.querySelector('.quantity-input').value);
                const stock = parseInt(item.querySelector('.stock-number').innerText);

                // update the quantity
                if (event.target.classList.contains('reduce-quantity')) {
                    if (quantity > 0) {
                        item.querySelector('.quantity-input').value = quantity - 1;
                    }
                } else if (event.target.classList.contains('increase-quantity')) {
                    if (quantity < stock) {
                        item.querySelector('.quantity-input').value = quantity + 1;
                    }
                } else if (event.target.classList.contains('remove-quantity')) {
                    // remove the item from the basket
                    // delete this.state.items[id];
                    // this.setState({
                    //     items: this.state.items,
                    // }, true);
                }

                // update the total
                this.setState({
                    total: Object.keys(this.state.items).reduce((total, key) => {
                        const item = this.state.items[key];
                        return total + (item.quantity * item.price);
                    }, 0),
                }, true);

                // update the basket in local storage
                // localStorage.setItem('basket', JSON.stringify(this.state));
            });
        });
    }
}

RegisterComponent(Basket);
