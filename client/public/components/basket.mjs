import { RegisterComponent, Component } from './components.mjs';

// Basket is stored locally only and is not persisted to the server.
// It is used to store the current basket and is used to calculate the total price of the basket.
// It is also used to store the current user's basket.
// The structure of the basket is in local storage and is as follows:
// {
//     "basket": {
//         "items": {
//             "item1~modifier": { quantity, type },
//             "item2": { quantity, type },
//             ...
//         },
//         "total": total
//     },
// }

let basketCallback = null;


// TODO: Does the localstorage have a problem with mutual exclusion?
// TODO: Should the basket be persisted to the server?
export function AddProductToBasket(product, type, amount, brickModifier = 'none') {
    if (localStorage.getItem('basket') === null || !localStorage.getItem('basket')) {
        localStorage.setItem('basket', JSON.stringify({
            items: {},
            total: 0,
        }));
    }

    const basket = JSON.parse(localStorage.getItem('basket'));

    if (type === 'brick') {
        product += '~' + brickModifier;
    }

    if (basket.items[product]) {
        basket.items[product].quantity += amount;
    } else {
        basket.items[product] = {
            quantity: amount,
            type,
        };
    }

    basket.total += amount;

    localStorage.setItem('basket', JSON.stringify(basket));

    if (basketCallback) {
        basketCallback();
    }
}

export function RemoveProductFromBasket(product, type, amount, brickModifier = 'none') {
    if (localStorage.getItem('basket') === null || !localStorage.getItem('basket')) {
        return;
    }
    const basket = JSON.parse(localStorage.getItem('basket'));

    if (type === 'brick') {
        product += '~' + brickModifier;
    }

    if (basket.items[product] > amount) {
        basket.items[product] -= amount;
    } else {
        delete basket.items[product];
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
            template: /* html */`
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
                        <div class="popup-footer">
                            <button class="popup-footer-button">View Basket</button>
                        </div
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
                    background-color: #AB8FFF;
                    right: 0;
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

            popup.addEventListener('click', (e) => {
                if (e.target.classList.contains('popup-close')) {
                    popup.classList.remove('show');
                }
            });

            // allow "click off to close"
            // document.addEventListener('click', (e) => {
            //     if (!popup.contains(e.target)) {
            //         popup.classList.remove('show');
            //     }
            // });
        });
    }
}

RegisterComponent(Basket);
