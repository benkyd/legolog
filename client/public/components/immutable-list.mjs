import { RegisterComponent, Component } from './components.mjs';
import * as LocalStorageListener from '../localstorage-listener.mjs';

// This was changed to be generic from the original: ImmutableBasketList
// so it acts now on a local storage "source" instead of just basket
// works i guess /shrug
class ImmutableList extends Component {
    static __IDENTIFY() { return 'immutable-list'; }

    constructor() {
        super(ImmutableList);
    }

    OnLocalStorageListener() {
        const itemsList = localStorage.getItem(this.state.source);

        if (itemsList) {
            try {
                const itemsJson = JSON.parse(itemsList);
                this.setState({
                    ...this.getState,
                    items: itemsJson.items,
                });
            } catch (e) {
                console.log(e);
            }
        } else {
            this.setState({
                ...this.getState,
                items: {},
            });
        }
    }


    OnMount() {
        LocalStorageListener.ListenOnKey(this.state.source, () => {
            this.OnLocalStorageListener(Object.bind(this));
        });

        this.OnLocalStorageListener(Object.bind(this));
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
                    height: 100%;
                    width: 100%;
                    max-width: ${this.state.w || '100%'};
                    max-height: ${this.state.h || 'auto'};
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

RegisterComponent(ImmutableList);
