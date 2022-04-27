import { RegisterComponent, Component, SideLoad } from './components.mjs';
import * as Basket from '../basket.mjs';

class Checkout extends Component {
    static __IDENTIFY() { return 'checkout'; }

    constructor() {
        super(Checkout);
    }

    async OnMount() {
        this.setState({
            subtotal: parseFloat(await Basket.GetBasketTotalPrice()).toFixed(2),
            total: parseFloat(await Basket.GetBasketTotalPrice()).toFixed(2),
            discount: 0,
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
                        <div class="checkout-delivery-form-title section-title">Shipping Details</div>
                        <div class="checkout-delivery-form">
                            <span class="form-item full-width">
                                <label class="checkout-form-row-label">Email</label>
                                <input class="checkout-form-row-input" type="text" autocomplete="email" name="email" placeholder="Email"/>
                            </span>
                            <span class="form-item full-width">
                                <label class="checkout-form-row-label">Address Line 1</label>
                                <input class="checkout-form-row-input" type="text" autocomplete="address-line1" name="address" placeholder="House Name or Number"/>
                            </span>
                            <span class="form-item full-width">
                                <label class="checkout-form-row-label">Post Code</label>
                                <input class="checkout-form-row-input" type="text" autocomplete="postal-code" name="postcode" placeholder="e.g AB12 CD3"/>
                            </span>
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
                                    <input class="checkout-form-row-input" type="text" autocomplete="cc-exp" name="cc-exp" placeholder="MM / YY"/>
                                </span>
                                <span class="form-item">
                                    <label class="checkout-form-row-label"> CVV / CSC </label>
                                    <input class="checkout-form-row-input" type="text" autocomplete="cc-csc" name="cc-csc" placeholder="CCV"/>
                                </span>
                            </div>
                        </div>

                        <div class="checkout-place-order">
                            <button class="checkout-place-order-button">Buy £${this.state.subtotal - this.state.discount}</button>
                        </div>
                    </div>
                    <div class="checkout-body-right">
                    <div class="checkout-summary-title section-title">Your Order <a href="/basket"><span class="edit-basket">edit basket</span><a> </div>
                        <div class="checkout-summary">
                            <immutable-basket-list-component h="300px"></immutable-basket-list-component>

                            <div class="checkout-summary-prices">
                                <div class="checkout-summary-prices-row">
                                    <span class="checkout-summary-prices-row-label">Subtotal</span>
                                    <span class="checkout-summary-prices-row-value">£${this.state.subtotal}</span>
                                </div>
                                <div class="checkout-summary-prices-row">
                                    <span class="checkout-summary-prices-row-label">Delivery</span>
                                    <span class="checkout-summary-prices-row-value">£0.00</span>
                                </div>
                                <div class="checkout-summary-prices-row discount-row" style="display: ${this.state.discount > 0 ? 'flex;' : 'none;'}">
                                    <span class="checkout-summary-prices-row-label">Discount</span>
                                    <span class="checkout-summary-prices-row-value">£-${parseFloat(this.state.discount).toFixed(2)}</span>
                                </div>
                                <div class="checkout-summary-prices-row">
                                    <span class="checkout-summary-prices-row-label">Total</span>
                                    <span class="checkout-summary-prices-row-value">£${parseFloat(this.state.subtotal - this.state.discount).toFixed(2)}</span>
                                </div>
                            </div>
                            <div><label class="checkout-form-row-label"> Discount Code </label></div>
                            <div class="checkout-summary-discount-code">
                                <input type="text" class="offer-text" name="offer-text" placeholder="LEGO10"/><button class="offer-button">Apply</button>
                            </div>
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

        // discount code
        this.root.querySelector('.offer-button').addEventListener('click', async () => {
            // get discount code
            const offerText = this.root.querySelector('input[name="offer-text"]').value;
            const offerTextBox = this.root.querySelector('.offer-text');

            // check if valid
            if (offerText.length === 0 || offerTextBox.classList.contains('code-applied')) {
                // show error
                offerTextBox.classList.add('error');
                setTimeout(() => {
                    offerTextBox.classList.remove('error');
                }, 1000);
                return;
            }

            // ask server for discount
            const req = await fetch(`/api/discount?code=${encodeURIComponent(offerText)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((res) => res.json());

            if (req.error) {
                // show error
                offerTextBox.classList.add('error');
                setTimeout(() => {
                    offerTextBox.classList.remove('error');
                }, 1000);
                return;
            }

            const offer = req.data;

            if ((await Basket.GetBasketTotalPrice()) < parseFloat(offer.min_value)) {
                // show error
                offerTextBox.classList.add('error');
                setTimeout(() => {
                    offerTextBox.classList.remove('error');
                }, 1000);
                return;
            }

            offerTextBox.classList.add('code-applied');
            offerTextBox.disabled = true;

            this.setState({
                subtotal: parseFloat(await Basket.GetBasketTotalPrice()).toFixed(2),
                total: parseFloat(await Basket.GetBasketTotalPrice(offer.discount, offer.type, offer.entity_type)).toFixed(2),
                discount: await Basket.GetAbsoluteBasketDiscount(offer.discount, offer.type, offer.entity_type),
            });
        });
    }
}

RegisterComponent(Checkout);
