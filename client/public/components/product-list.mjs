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

        const augmentable = this.state.augmentable === 'true';

        this.setState({
            ...this.getState,
            augmentable,
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

    GenerateAugmentPanel(augmentable) {
        if (!augmentable) {
            return '';
        }
        return /* html */`
            <div class="augment-panel">
                <div class="augment-panel-header">
                    <span class="augment-panel-header-text">Refine search results</span>
                </div>
                <div class="augment-panel-body">
                    <div class="augment-panel-body-row">
                        <span class="augment-panel-body-row-text">Weight</span>
                        <span class="augment-panel-body-row-text">Tag</span>
                        <span class="augment-panel-body-row-text"></span>
                    </div>
                </div>
            </div>
        `;
    }

    Render() {
        const augmentPanel = this.GenerateAugmentPanel(this.state.augmentable);
        console.log(augmentPanel);

        if (this.state.page * this.state.per_page >= this.state.total) {
            this.keepLoading = false;
            this.loadingBar = '';
        } else {
            this.keepLoading = true;
            this.loadingBar = `
            <!--Infinite Loading-->
            <div class="product-list-loader-container-container">
                <div class="product-list-loader-container">
                    <div class="product-list-loader">
                        <img src="/res/loading.gif" height="100" alt="Loading...">
                    </div>
                </div>
            </div>
            `;
        }

        return {
            template: /* html */`
                <h2>{this.state.title}</h2>
                ${augmentPanel}
                <div class="product-list">
                    ${this.state.products.map(product => {
                        return `<compact-listing-component name="${product.name}"
                                    id="${product.id}"
                                    listing="${product.listing}"
                                    price="${product.price}"
                                    type="${product.type}"
                                    tags="${JSON.stringify(product.tags).replace(/"/g, '&quot;')}"
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

                .product-list-loader-container-container {
                    display: flex;
                    justify-content: center;
                }

                @keyframes grow-shrink {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.4);
                    }
                    100% {
                        transform: scale(1);
                    }
                }

                @keyframes shrink-grow {
                    0% {
                        transform: scale(1.4);
                    }
                    50% {
                        transform: scale(0.9);
                    }
                    100% {
                        transform: scale(1.4);
                    }
                }

                .product-list-loader-container {
                    display: flex;
                    justify-content: center;
                    width: 100px;
                    border-radius: 50%;
                    background-color: #D7C2FF;
                    /* grow and shrink sine wave */
                    animation-timing-function: ease-in-out;
                    animation: grow-shrink 1s infinite;
                }

                .product-list-loader {
                    animation-timing-function: ease-in-out;
                    animation: shrink-grow 1s infinite;
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
