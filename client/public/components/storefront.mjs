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
                                        getroute="/api/sets/featured"
                                        type="set">
                </product-list-component>
                `,
            style: `
                product-list-component {
                    z-index: 0;
                    display: block;
                    margin: 0 auto;
                }`,
        };
    }

    OnRender() {

    }
}

RegisterComponent(StoreFront);
