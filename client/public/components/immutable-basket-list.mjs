import { RegisterComponent, Component } from './components.mjs';
import { GetBasketTotalPrice } from './basket-popout.mjs';
import * as LocalStorageListener from '../localstorage-listener.mjs';

class ImmutableBasketList extends Component {
    static __IDENTIFY() { return 'immutable-basket-list'; }

    constructor() {
        super(ImmutableBasketList);
    }

    async OnLocalBasketUpdate() {
        const basket = localStorage.getItem('basket');

        if (basket) {
            try {
                const basketJSON = JSON.parse(basket);
                const subtotal = await GetBasketTotalPrice();
                this.setState({
                    ...this.getState,
                    items: basketJSON.items,
                    total: basketJSON.total,
                    subtotal,
                });
            } catch (e) {
                console.log(e);
            }
        } else {
            this.setState({
                ...this.getState,
                items: {},
                total: 0,
                subtotal: 0,
            });
        }
    }


    OnMount() {
        LocalStorageListener.ListenOnKey('basket', () => {
            this.OnLocalBasketUpdate(Object.bind(this));
        });

        this.setState({
           ...this.getState,
            items: {},
            total: 0,
            subtotal: 0,
        }, false);

        this.OnLocalBasketUpdate(Object.bind(this));
    }

    Render() {
        return {
            template: /* html */`
                <div class="popup-content">
                    ${this.state.items
                        ? Object.keys(this.state.items).map((key) => {
                        const item = this.state.items[key];
                        return /* html */`
                            <div class="popup-content-item">
                                <span class="popup-content-item-quantity">x${item.quantity}</span>
                                <super-compact-listing-component class="sc-listing" 
                                                                    id="${key.split('~')[0]}"
                                                                    type="${item.type}"
                                                                    quantity="${item.quantity}"
                                                                    modifier="${key.split('~')[1] || ''}">
                                </super-compact-listing-component>
                            </div>
                        `;
                    }).join('')
                    : ''}
                </div>
            `,
            style: `
                .popup-content {
                    display: flex;
                    flex-direction: column;
                    flex-wrap: nowrap;
                    justify-content: left;
                    height: ${this.state.w || '100%'};
                    height: ${this.state.h || 'auto'};
                    overflow-y: scroll;
                    overflow-x: hidden;
                    justify-content: space-between;
                }

                .popup-content-item {
                    background-color: #F5F6F6;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    justify-content: space-between;
                    align-items: center;
                }

                .popup-content-item-quantity {
                    font-size: 2em;
                    flex-grow: 1;
                }

                .sc-listing {
                    flex-basis: 100%;
                    flex-grow: 3;
                }
            `,
        };
    }

    OnRender() {

    }
}

RegisterComponent(ImmutableBasketList);
