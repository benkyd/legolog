import { RegisterComponent, Component, SideLoad } from './components.mjs';

class CompactProductListing extends Component {
    static __IDENTIFY() { return 'compact-listing'; }

    constructor() {
        super(CompactProductListing);
    }

    Render() {
        return {
            template: `
                {this.state.name}
                {this.state.desc}
                £{this.state.price}
                <img src="{this.state.image}"></img>
            `,
            style: `
                compact-listing-component {    
                    display: flex;        
                }
            `,
        };
    }

    OnceRendered() {

    }
}

RegisterComponent(CompactProductListing);
