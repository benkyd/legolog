import { RegisterComponent, Component } from './components.mjs';

// Basket is stored locally only and is not persisted to the server.
// It is used to store the current basket and is used to calculate the total price of the basket.
// It is also used to store the current user's basket.
// The structure of the basket is in local storage and is as follows:
// {
//     "basket": {
//         "items": {
//             "item1": amount,
//             "item2": amount,
//             ...
//         },
//         "total": total
//     },
// }

let basketCallback = null;

// TODO: Does the localstorage have a problem with mutual exclusion?
// TODO: Should the basket be persisted to the server?
export function AddProductToBasket(product, amount) {
    if (localStorage.getItem('basket') === null || !localStorage.getItem('basket')) {
        localStorage.setItem('basket', JSON.stringify({
            items: {},
            total: 0,
        }));
    }

    const basket = JSON.parse(localStorage.getItem('basket'));
    console.log(basket);

    if (basket.items.product) {
        basket.items.product += amount;
    } else {
        basket.items.product = amount;
    }
    console.log(basket);

    basket.total += amount;
    console.log(basket);

    console.log(JSON.stringify(basket, null, 4));
    localStorage.setItem('basket', JSON.stringify(basket));

    if (basketCallback) {
        basketCallback();
    }
}

export function RemoveProductFromBasket(item, amount) {
    if (localStorage.getItem('basket') === null || !localStorage.getItem('basket')) {
        return;
    }
    const basket = JSON.parse(localStorage.getItem('basket'));

    if (basket.items.item > amount) {
        basket.items.item -= amount;
    } else {
        delete basket.items.item;
    }

    basket.total -= amount;

    localStorage.setItem('basket', JSON.stringify(basket));

    if (basketCallback) {
        basketCallback();
    }
}


class Basket extends Component {
    static __IDENTIFY() { return 'basket'; }

    constructor() {
        super(Basket);
    }

    OnLocalBasketUpdate() {
        const basket = localStorage.getItem('basket');

        if (basket) {
            try {
                const basketJSON = JSON.parse(basket);
                this.setState({
                    items: basketJSON.items,
                    total: basketJSON.total,
                });
            } catch (e) {
                console.log(e);
            }
        } else {
            this.setState({
                items: {},
                total: 0,
            });
        }
    }

    OnMount() {
        this.OnLocalBasketUpdate(Object.bind(this));

        basketCallback = this.OnLocalBasketUpdate.bind(this);
    }

    Render() {
        return {
            template: `
                <span id="basket-wrapper">
                    <div class="basket">
                        <img id="basket-icon" class="menu-item" src="https://www.svgrepo.com/show/343743/cart.svg" width="50px" stroke="#222" stroke-width="2px" alt="">
                        <span id="basket-count" class="menu-item">{this.state.total}</span>
                    </div>
                    
                    <div id="basket-popup" class="popup">
                        <div class="popup-header">
                            <span class="popup-title">Basket</span>
                            <span class="popup-close">&times;</span>
                        </div>
                        <div class="popup-content">
                            <div class="popup-content-item">
                                <span class="popup-content-item-title">Total</span>
                                <span class="popup-content-item-value">{this.state.total}</span>
                            </div>
                            <div class="popup-content-item">
                                <span class="popup-content-item-title">Items</span>
                                <span class="popup-content-item-value">{this.state.items}</span>
                            </div>
                        </div>
                    </div>
                </span>
            `,
            style: `
                #basket-wrapper {
                    flex-basis: 4%;
                }
                
                .basket {
                    display: flex;
                    justify-content: space-between;
                    padding-bottom: 2px;
                }

                .basket:hover {
                    opacity: 0.5;
                }
                                
                #basket-icon {
                    padding-top: 2px;
                    cursor: pointer;
                }

                #basket-count {
                    padding-top: 9px;
                    font-size: 1em;
                    font-weight: 100;
                    cursor: pointer;
                }
                
                .popup {
                    display: none;
                }

                .show {
                    display: flex;
                }

                #basket-popup {
                    position: absolute;
                    background-color: #EC914B;
                    width: 200px;
                    height: 200px;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    z-index: 100;
                }

            `,
        };
    }

    OnRender() {
        // set up basket
        const basketToggler = this.root.querySelector('.basket');

        basketToggler.addEventListener('click', () => {
            const popup = this.root.querySelector('.popup');
            popup.classList.toggle('show');
        });
    }
}

RegisterComponent(Basket);
