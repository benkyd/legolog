import { RegisterComponent, Component, SideLoad } from './components.mjs';

class CompactProductListing extends Component {
    static __IDENTIFY() { return 'compact-listing'; }

    constructor() {
        super(CompactProductListing);
    }

    Render() {
        return {
            template: `
                <img src="{this.state.image}"></img>
                {this.state.name} <p>
                {this.state.desc} <p>
                £{this.state.price}
            `,
            style: `
                compact-listing-component {
                    display: flex;
                    text-align: center;
                    width: 200px;
                    flex-direction: column;
                    margin: 10px;
                }
            `,
        };
    }

    OnceRendered() {

    }
}

RegisterComponent(CompactProductListing);
