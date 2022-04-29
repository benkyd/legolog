import { RegisterComponent, Component, SideLoad } from './components.mjs';

class Order extends Component {
    static __IDENTIFY() { return 'order'; }

    constructor() {
        super(Order);
    }

    async OnMount() {
        // get order id from search param
        const query = new URLSearchParams(window.location.search);
        const id = query.get('id');

        const res = (await fetch(`/api/order/${id}`).then(res => res.json())).data;

        this.setState({
            ...this.getState,
            id,
            ...res,
        }, false);

        console.log(this.state);
        localStorage.setItem('viewing-order', JSON.stringify({ items: res.items }));
    }

    Render() {
        return {
            template: /* html */`
                <div class="order-header">
                    <span class="order-header-title">Thank You For Your Order!</span>
                    <span class="order-header-subtitle">Your order number is <span class="monospace">{this.state.id}</span></span>
                </div>

                <div class="order-body">
                    <div class="order-body-item">
                        <span class="order-body-date-placed">Placed on ${new Date(this.state.date_placed).toDateString()} at ${new Date(this.state.date_placed).toLocaleTimeString()}</span>
                    </div>
                    <div class="order-body-item">
                        <div class="order-breakdown-table">
                            <div class="order-breakdown-table-item">
                                <div class="order-breakdown-table-header">Address</div>
                                <div class="order-breakdown-table-row">
                                    <span class="order-breakdown-table-row-value">John Doe</span>
                                    <span class="order-breakdown-table-row-value">123 Example Av,</span>
                                    <span class="order-breakdown-table-row-value">Portsmouth,</span>
                                    <span class="order-breakdown-table-row-value">PO1 1EA</span>
                                </div>
                            </div>
                            <div class="order-breakdown-table-item">
                                <div class="order-breakdown-table-header">Payment Card</div>
                                <div class="order-breakdown-table-row">
                                    <span class="order-breakdown-table-row-value">**** **** **** 1111</span>
                                    <span class="order-breakdown-table-row-value">Expires: 01/20</span>
                                </div>
                            </div>
                            <div class="order-breakdown-table-item">
                                <div class="order-price-table">
                                    <div class="order-breakdown-table-header">Payment Breakdown</div>
                                    <div class="order-price-table-row">
                                        <span class="order-price-table-row-title">Discount Applied</span>
                                        <span class="order-price-table-row-price">£${parseFloat(this.state.discount).toFixed(2)}</span>
                                    </div>
                                    <div class="order-price-table-row">
                                        <span class="order-price-table-row-title">Total Paid</span>
                                        <span class="order-price-table-row-price">£${parseFloat(this.state.subtotal_paid).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="order-body-item">
                        <div class="order-body-item-table">
                            <div class="order-body-item-left">
                                <div class="order-body-header">Order Status</div>
                                <div class="order-track">
                                    <div class="order-track-step">
                                        <span class="order-track-status">
                                            <div class="order-track-step-icon completed"></div>
                                            <div class="order-track-step-line completed"></div>
                                        </span>
                                        <div class="order-track-text">
                                            <span class="order-body-status-title">Ordered</span>
                                            <span class="when">${new Date(this.state.date_placed).toDateString()}</span>
                                        </div>
                                    </div>
                                    <div class="order-track-step">
                                        <span class="order-track-status">
                                            <div class="order-track-step-icon"></div>
                                            <div class="order-track-step-line"></div>
                                        </span>
                                        <div class="order-track-text">
                                            <span class="order-body-status-title">Posted</span>
                                            <span class="when"></span>
                                        </div>
                                    </div>
                                    <div class="order-track-step">
                                        <span class="order-track-status">
                                            <div class="order-track-step-icon"></div>
                                            <div class="order-track-step-line"></div>
                                        </span>
                                        <div class="order-track-text">
                                            <span class="order-body-status-title">Delivered</span>
                                            <span class="when"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="order-body-item-right">
                                <div class="order-body-header">Your LegoLog Order</div>
                                <immutable-list-component source="viewing-order" h="400px" class="order-list"></immutable-list-component>
                            </div>
                        </div>
                    </div>
            `,
            style: SideLoad('/components/css/order.css'),
        };
    }

    OnRender() {
        // todo: add order tracking, the data is already there
    }

    OnUnMount() {
        localStorage.removeItem('viewing-order');
    }
}

RegisterComponent(Order);
