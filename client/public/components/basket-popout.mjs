import { RegisterComponent, Component } from './components.mjs';
import * as Basket from '../basket.mjs';
import * as LocalStorageListener from '../localstorage-listener.mjs';

class BasketPopout extends Component {
    static __IDENTIFY() { return 'basket-popout'; }

    constructor() {
        super(BasketPopout);
    }

    async OnLocalBasketUpdate() {
        const basket = localStorage.getItem('basket');

        if (basket) {
            try {
                const basketJSON = JSON.parse(basket);
                const subtotal = await Basket.GetBasketTotalPrice();
                this.setState({
                    items: basketJSON.items,
                    total: basketJSON.total,
                    subtotal,
                });
            } catch (e) {
                console.log(e);
            }
        } else {
            this.setState({
                items: {},
                total: 0,
                subtotal: 0,
            });
        }
    }

    OnMount() {
        this.setState({
            items: {},
            total: 0,
            subtotal: 0,
        }, false);

        this.OnLocalBasketUpdate(Object.bind(this));

        LocalStorageListener.ListenOnKey('basket', this.OnLocalBasketUpdate.bind(this));
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
                            <button class="toggler">
                                <span class="cross-line cross-line-top"></span>
                                <span class="cross-line cross-line-bottom"></span>
                                </button>
                        </div>
                        <div class="popup-content-header">
                            {this.state.total} Items
                        </div>
                        <div class="popup-content">
                            <immutable-basket-list-component h="400px" class="basket-list"></immutable-basket-list-component>
                        </div>
                        <div class="popup-footer">
                            <span class="popup-footer-total">Subtotal: £${parseFloat(this.state.subtotal).toFixed(2)}</span>
                            <a href="/basket"><button class="popup-footer-button">View Basket</button></a>
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
                    font-size: 0.5em;
                    position: absolute;
                    background-color: #AB8FFF;
                    border: 1px solid #222;
                    right: 0;
                    width: 60%;
                    max-height: 550px;
                    max-width: 500px;
                    padding-top: 10px;
                    padding-bottom: 5px;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    z-index: 100;
                }

                @media (pointer:none), (pointer:coarse), screen and (max-width: 900px) {
                    #basket-popup {
                        position: absolute;
                        left: 0;
                        max-width: 100%;
                        width: 100%;
                    }
                }

                .popup-header {
                    display: flex;
                    justify-content: space-between;
                    padding-bottom: 2px;
                    font-size: 1.5em;
                    font-weight: bold;
                }

                .toggler {
                    position: absolute;
                    right: 2px;
                    top: 2px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    outline: none;
                    height: 2em;
                    width: 2em;
                    z-index: 50;
                    transition: all 0.2s ease-in;
                }
                
                .cross-line {
                    background: #222;
                    box-shadow: #222 0px 0px 2px;
                    position: absolute;
                    height: 2px;
                    left: 0;
                    width: 100%;
                }
                
                #toggler:hover .cross-line {
                    background: #777;
                }
                
                .cross-line-top {
                    top: 50%;
                    transform: rotate(45deg) translatey(-50%);
                }
                
                .cross-line-bottom {
                    bottom: 50%;
                    transform: rotate(-45deg) translatey(50%);
                }

                .popup-content {
                    width: 100%;
                    height: 100%;
                }

                .basket-list {
                    width: 100%;
                }

                .popup-footer {
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    justify-content: space-around;
                    align-items: center;
                    padding-top: 7px;
                    padding-bottom: 2px;
                }

                .popup-footer-total {
                    font-size: 1em;
                    font-weight: bold;
                }

                .popup-footer-button {
                    font-size: 1.4em;
                    font-weight: bold;
                    background-color: #AB8FFF;
                    border: 1px solid #222;
                    color: #222;
                    padding: 5px;
                    cursor: pointer;
                    outline: none;
                    transition: all 0.2s ease-in;
                }

                .popup-footer-button:hover {
                    background-color: #222;
                    color: #AB8FFF;
                }
            `,
        };
    }

    OnRender() {
        const basketWrapper = this.root.querySelector('#basket-wrapper');
        const basketToggler = this.root.querySelector('.basket');
        const popup = this.root.querySelector('.popup');
        const closeButton = this.root.querySelector('.toggler');

        basketToggler.addEventListener('click', () => {
            popup.classList.toggle('show');
        });

        closeButton.addEventListener('click', () => {
            popup.classList.remove('show');
        });

        const toggler = this.root.querySelector('.toggler');
        toggler.addEventListener('click', () => {
            popup.classList.remove('show');
        });

        // allow "click off to close", allowing for the users mouse to start clicking and dragging inside the popup
        // without closing it if the mouse leaves the popup
        let isMouseInside = true;

        basketWrapper.addEventListener('mouseleave', () => {
            isMouseInside = false;
        });

        basketWrapper.addEventListener('mouseenter', () => {
            isMouseInside = true;
        });

        window.addEventListener('mouseup', () => {
            if (!isMouseInside) {
                popup.classList.remove('show');
            }
        });
    }
}

RegisterComponent(BasketPopout);
