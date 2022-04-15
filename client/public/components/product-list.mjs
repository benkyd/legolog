import { RegisterComponent, Component } from './components.mjs';

class ProductList extends Component {
    static __IDENTIFY() { return 'product-list'; }

    constructor() {
        super(ProductList);
    }

    async FetchListings(from) {
        const products = await fetch(from).then(response => response.json());
        const productsList = this.state.products || [];
        // concat the new products to the existing products
        const newProducts = productsList.concat(products.data);
        this.setState({
            ...this.getState,
            products: newProducts,
            page: products.page.page,
            per_page: products.page.per_page,
            total: products.page.total,
        });
    }

    OnMount() {
        this.loading = false;
        this.keepLoading = false;

        const route = this.state.getroute;
        this.FetchListings(route);
        this.state.products = [];
    }

    Render() {
        if (this.state.page * this.state.per_page >= this.state.total) {
            this.keepLoading = false;
            this.loadingBar = '';
        } else {
            this.keepLoading = true;
            this.loadingBar = `
            <!--Infinite Loading-->
            <div class="product-list-loader">
                <!-- https://loading.io/css/ -->
                <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
            `;
        }

        return {
            template: /* html */`
                <h2>{this.state.title}</h2>
                <div class="product-list">
                    ${this.state.products.map(product => {
                        return `<compact-listing-component name="${product.name}"
                                    id="${product.id}"
                                    listing="${product.listing}"
                                    price="${product.price}"
                                    type="${product.type}"
                                    discount="${product.discount || ''}"></compact-listing-component>
                        `;
                    }).join('')}
                </div>
                ${this.loadingBar}
            `,
            style: `
                .product-list {
                    display: flex;
                    justify-content: space-evenly;
                    flex-wrap: wrap;
                    margin: 0 auto;
                    z-index: 0;
                }

                .product-list-buttons {
                    display: flex;
                    justify-content: space-evenly;
                    margin: 0 auto;
                }

                .product-list-button {
                    max-width: 100px;
                    padding: 5px;
                    font-size: 1em;
                    font-weight: bold;
                    background-color: #85DEFF;
                    color: #fff;
                    border: none;
                }

                .product-list-loader {
                    display: flex;
                    justify-content: center;
                }

                .lds-ellipsis {
                    display: inline-block;
                    position: relative;
                    width: 80px;
                    height: 80px;
                    z-index: 0;
                }
                .lds-ellipsis div {
                    position: absolute;
                    top: 33px;
                    width: 13px;
                    height: 13px;
                    border-radius: 50%;
                    background: #7F5CFF;
                    animation-timing-function: cubic-bezier(0, 1, 1, 0);
                }
                .lds-ellipsis div:nth-child(1) {
                    left: 8px;
                    animation: lds-ellipsis1 0.6s infinite;
                }
                .lds-ellipsis div:nth-child(2) {
                    left: 8px;
                    animation: lds-ellipsis2 0.6s infinite;
                }
                .lds-ellipsis div:nth-child(3) {
                    left: 32px;
                    animation: lds-ellipsis2 0.6s infinite;
                }
                .lds-ellipsis div:nth-child(4) {
                    left: 56px;
                    animation: lds-ellipsis3 0.6s infinite;
                }
                @keyframes lds-ellipsis1 {
                    0% {
                        transform: scale(0);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
                @keyframes lds-ellipsis3 {
                    0% {
                        transform: scale(1);
                    }
                    100% {
                        transform: scale(0);
                    }
                }
                @keyframes lds-ellipsis2 {
                    0% {
                        transform: translate(0, 0);
                    }
                    100% {
                        transform: translate(24px, 0);
                    }
                }
                            
                @media (pointer:none), (pointer:coarse), screen and (max-width: 900px) {
                    .product-list {
                        /*justify-content: space-between;*/
                    }
                }
            `,
            state: {
                ...this.getState,
                ...this.products,
            },
        };
    }

    OnRender() {
        this.loading = false;
        // scroll to bottom event listener
        if (this.keepLoading) {
            window.addEventListener('scroll', async () => {
                // start loading 200px before the bottom of the page
                if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
                    if (this.loading) return;
                    if (this.state.page * this.state.per_page >= this.state.total) {
                        this.keepLoading = false;
                        this.loadingBar = '';
                        return;
                    }

                    this.loading = true;

                    // parse the getRoute as a query string
                    const getRoute = this.state.getroute;
                    // split into query and location
                    const [locationStr, queryStr] = getRoute.split('?');

                    const query = new URLSearchParams(queryStr);
                    query.append('page', parseInt(this.state.page) + 1);

                    await this.FetchListings(`${locationStr}?${query.toString()}`);
                }
            });
        }
    }
}

RegisterComponent(ProductList);
