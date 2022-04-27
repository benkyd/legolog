import { GetBasketTotalPrice } from './basket-popout.mjs';
import { RegisterComponent, Component } from './components.mjs';

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
                <div class="checkout">
                    <div class="checkout-header">
                        <span class="checkout-header-title">Checkout</span>
                        <span class="checkout-header-total">Total: £{this.state.total}</span>
                    </div>
                    <div class="checkout-delivery-form">
                        <div class="checkout-form-row">
                            <input class="checkout-form-row-input" type="text" name="name" placeholder="name"/>
                        </div>
                        <div class="checkout-form-row">
                            <input class="checkout-form-row-input" type="text" name="address" placeholder="address"/>
                        </div>
                        <div class="checkout-form-row">
                            <input class="checkout-form-row-input" type="text" name="postcode" placeholder="postcode"/>
                        </div>
                    </div>

                    <div class="checkout-payment-form">
                        <div class="checkout-form-row">
                        <input class="checkout-form-row-input" type="text" name="card_number" placeholder="Card Number"/>
                        <input class="checkout-form-row-input" type="text" name="cvv" placeholder="CCV"/>
                        <input class="checkout-form-row-input" type="text" name="exp" placeholder="MM/YY"/>
                        
                </div>
            `,
            style: `
                .checkout {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                }


                .checkout-form-row-input {
                    border: 1px solid #79747E;
                    box-sizing: border-box;
                    border-radius: 4px;
                }
            `,
        };
    }


    OnRender() {
    }
}

RegisterComponent(Checkout);
