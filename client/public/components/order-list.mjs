import { RegisterComponent, Component, SideLoad } from './components.mjs';
import * as Auth from '../auth.mjs';

class OrderList extends Component {
    static __IDENTIFY() { return 'order-list'; }

    constructor() {
        super(OrderList);
    }

    async OnMount() {
        const doStaffList = this.state.staff !== undefined;

        const options = {
            method: 'GET',
            headers: { Authorization: `Bearer ${await Auth.GetToken()}` },
        };
        if (doStaffList) {
            const res = await fetch('/api/auth/staff/orders', options).then(res => res.json());

            this.setState({
                ...this.getState,
                orders: res.data,
                title: 'Orders left to fufill',
                none: 'All done :)',
            }, false);
        } else {
            const res = await fetch('/api/auth/orders', options).then(res => res.json());

            this.setState({
                ...this.getState,
                orders: res.data,
                title: 'Your Orders',
                none: 'You have no orders',
            }, false);
        }
    }

    Render() {
        return {
            template: /* html */`
                <div class="order-header">
                    <span class="order-header-title">{this.state.title}</span>
                </div>

                <div class="orders-list-body">
                    ${this.state.orders.length === 0
                        ? /* html */`
                        <div class="orders-list-item">
                            <span class="order-list-item-header-title">{this.state.none}</span>
                        </div>
                    `
                    : ''}
                    ${this.state.orders.map(order => /* html */`
                        <div class="orders-list-item">
                            <a href="/orders/order?id=${order.id}"><div class="order-list-item">
                                <div class="order-list-item-header">
                                    <span class="order-list-item-header-title">Order #${order.id}</span>
                                    <span class="order-list-item-header-subtitle">Placed on ${new Date(order.date_placed).toDateString()}</span>
                                </div>
                                <div class="order-list-item-body">
                                    <span class="order-list-item-body-item-title">Paid: £${parseFloat(order.subtotal_paid).toFixed(2)}</span>
                                    <span class="order-list-item-body-item-title">Shipped? ${order.shipped ? 'Yes' : 'No'}</span>
                                    ${this.state.staff !== undefined
                                    ? /* html */`
                                        <span class="order-list-item-ship">Posted? <input type="checkbox" class="order-list-item-shipped-checker" ${order.shipped ? 'checked disabled' : ''} /></span>
                                        <span class="order-list-item-done">Done & Recieved? <input type="checkbox" class="order-list-item-done-checker" ${order.recieved ? 'checked disabled' : ''} /></span>
                                    `
                                    : ''}
                                </div>
                            </div></a>
                        </div>
                    `).join('')}
                </div>
            `,
            style: SideLoad('/components/css/order.css'),
        };
    }

    OnRender() {
        this.root.querySelectorAll('.order-list-item-shipped-checker').forEach(checkbox => {
            checkbox.addEventListener('click', async (event) => {
                const orderID = checkbox.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('.order-list-item-header-title').innerText.split('#')[1];
                const options = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${await Auth.GetToken()}`,
                    },
                    body: JSON.stringify({
                        status: {
                            shipped: true,
                        },
                    }),
                };
                const orderUpdate = await fetch(`/api/auth/staff/order/${orderID}`, options).then(res => res.json());

                const getOptions = {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${await Auth.GetToken()}` },
                };
                const res = await fetch('/api/auth/staff/orders', getOptions).then(res => res.json());

                this.setState({
                    ...this.getState,
                    orders: res.data,
                    title: 'Orders left to fufill',
                    none: 'All done :)',
                });
            });
        });

        this.root.querySelectorAll('.order-list-item-done-checker').forEach(checkbox => {
            checkbox.addEventListener('click', async (event) => {
                const orderID = checkbox.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('.order-list-item-header-title').innerText.split('#')[1];
                const options = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${await Auth.GetToken()}`,
                    },
                    body: JSON.stringify({
                        status: {
                            completed: true,
                        },
                    }),
                };
                const orderUpdate = await fetch(`/api/auth/staff/order/${orderID}`, options).then(res => res.json());

                const getOptions = {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${await Auth.GetToken()}` },
                };
                const res = await fetch('/api/auth/staff/orders', getOptions).then(res => res.json());

                this.setState({
                    ...this.getState,
                    orders: res.data,
                    title: 'Orders left to fufill',
                    none: 'All done :)',
                });
            });
        });
    }
}

RegisterComponent(OrderList);
