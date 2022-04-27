import { GetBasketTotalPrice } from './basket-popout.mjs';
import { RegisterComponent, Component, SideLoad } from './components.mjs';

class Checkout extends Component {
    static __IDENTIFY() { return 'checkout'; }

    constructor() {
        super(Checkout);
    }

    async OnMount() {
        this.setState({
            total: parseFloat(await GetBasketTotalPrice()).toFixed(2),
        });
    }

    Render() {
        return {
            template: /* html */`
                <div class="checkout-header">
                    <span class="checkout-header-title">Checkout</span>
                </div>
                <div class="checkout">
                    <div class="checkout-body-left">
                        <div class="checkout-delivery-form">
                            <div class="checkout-delivery-form-title section-title">Shipping Details</div>
                            <input class="checkout-form-row-input" type="text" autocomplete="address-line1" name="address" placeholder="Shipping Address"/>
                            <input class="checkout-form-row-input" type="text" autocomplete="postal-code" name="postcode" placeholder="Postcode"/>
                        </div>

                        <div class="checkout-delivery-form-title section-title">Payment Details</div>
                        <div class="checkout-payment-form">
                            <div class="payment-row">
                                <span class="form-item">
                                    <label class="checkout-form-row-label"> Card Number </label>
                                    <input class="checkout-form-row-input" type="text" autocomplete="cc-number" name="cc-number" placeholder="0000 0000 0000 0000"/>
                                </span>
                                <span class="form-item">
                                    <label class="checkout-form-row-label"> Cardholder Post Code </label>
                                    <input class="checkout-form-row-input" type="text" autocomplete="postal-code" name="postal-code" placeholder="e.g AB12 CD3"/>
                                </span>
                            </div>
                            <div class="payment-row">
                                <span class="form-item">
                                    <label class="checkout-form-row-label"> Expiry Date </label>
                                    <input class="checkout-form-row-input" type="text" autocomplete="cc-exp" name="cc-exp" placeholder="MM/YY"/>
                                </span>
                                <span class="form-item">
                                    <label class="checkout-form-row-label"> CVV / CSC </label>
                                    <input class="checkout-form-row-input" type="text" autocomplete="cc-csc" name="cc-csc" placeholder="CCV"/>
                                </span>
                            </div>
                        </div>

                        <div class="checkout-place-order">
                            <button class="checkout-place-order-button">Buy £${this.state.total}</button>
                        </div>
                    </div>
                    <div class="checkout-body-right">
                    <div class="checkout-summary-title section-title">Your Order <a href="/basket"><span class="edit-basket">edit basket</span><a> </div>
                        <div class="checkout-summary">
                            <immutable-basket-list-component h="300px"></immutable-basket-list-component>
                            <div class="checkout-summary-total">Subtotal ${this.state.total}</div>
                            <div class="checkout-summary-total">Shipping (UK Only) ${this.state.total}</div>
                            <div class="checkout-summary-total">Total ${this.state.total}</div>
                            <input type="text" class="offer-text" placeholder="LEGO10"/><button class="offer-button">Apply Offer Code</button>
                        </div>
                    </div>
                </div>
            `,
            style: SideLoad('/components/css/checkout.css'),
        };
    }

    OnRender() {
        // card number
        let lastCardNumber = '';
        this.root.querySelector('input[name="cc-number"]').addEventListener('keyup', (e) => {
            if (e.target.value !== lastCardNumber) {
                // remove non-numeric characters
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                // space every 4 digits
                e.target.value = e.target.value.replace(/(\d{4})/g, '$1 ');
                // not longer than 4 sets of 4 numbers
                e.target.value = e.target.value.trim().substring(0, 19);
                lastCardNumber = e.target.value;

                // perform validation on card number and determine if valid AND card type
                // please not this is NOT a checksum
                let cardType = 'unknown';
                this.root.querySelector('input[name="cc-number"]').classList.remove('visa', 'mastercard', 'amex', 'unknown');
                const cardNumber = e.target.value.replace(/\s/g, '');
                if (cardNumber.match(/^4[0-9]{12}(?:[0-9]{3})?$/)) {
                    cardType = 'visa';
                } else if (cardNumber.match(/^5[1-5][0-9]{14}$/)) {
                    cardType = 'mastercard';
                }
                // update card type
                this.root.querySelector('input[name="cc-number"]').classList.add(cardType);

                if (e.target.value.length === 19) {
                    this.root.querySelector('input[name="postal-code"]').focus();
                }
            }

            if (e.keyCode === 13) {
                this.root.querySelector('input[name="postal-code"]').focus();
            }
        });

        // postal code
        let lastPostalCode = '';
        this.root.querySelector('input[name="postal-code"]').addEventListener('keyup', (e) => {
            if (e.target.value !== lastPostalCode) {
                // make uppercase
                e.target.value = e.target.value.toUpperCase();
                // not longer than 4 sets of 4 numbers
                lastPostalCode = e.target.value;
            }

            if (e.keyCode === 13) {
                this.root.querySelector('input[name="cc-exp"]').focus();
            }
        });

        // expiry date
        let lastExpiryDate = '';
        this.root.querySelector('input[name="cc-exp"]').addEventListener('keyup', (e) => {
            if (e.target.value !== lastExpiryDate) {
                // remove non-numeric characters
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                // space every 2 digits
                e.target.value = e.target.value.replace(/(\d{2})/g, '$1 / ');
                // not longer than 2 sets of 2 numbers
                e.target.value = e.target.value.trim().substring(0, 7);
                lastExpiryDate = e.target.value;

                if (e.target.value.length === 7) {
                    this.root.querySelector('input[name="cc-csc"]').focus();
                }
            }

            if (e.keyCode === 13) {
                this.root.querySelector('input[name="cc-csc"]').focus();
            }
        });

        // cvv
        let lastCvv = '';
        this.root.querySelector('input[name="cc-csc"]').addEventListener('keyup', (e) => {
            if (e.target.value !== lastCvv) {
                // remove non-numeric characters
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                // not longer than 3 numbers
                e.target.value = e.target.value.trim().substring(0, 3);
                lastCvv = e.target.value;
            }
        });
    }
}

RegisterComponent(Checkout);
