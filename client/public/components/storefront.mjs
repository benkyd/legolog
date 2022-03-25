import { RegisterComponent, Component } from './components.mjs';

class StoreFront extends Component {
    static __IDENTIFY() { return 'storefront'; }

    constructor() {
        super(StoreFront);
    }

    Render() {
        return {
            template: `
                <product-list-component id="featured"
                                        title="Featured Lego Sets"
                                        getroute="/api/sets/featured">
                </product-list-component>
                `,
            style: `
                product-list-component {
                    display: block;
                    margin: 0 auto;
                }`,
        };
    }

    OnceRendered() {

    }
}

RegisterComponent(StoreFront);
