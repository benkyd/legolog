import { RegisterComponent, Component, SideLoad } from './components.mjs';

class CompactProductListing extends Component {
    static __IDENTIFY() { return 'compact-listing'; }

    constructor() {
        super(CompactProductListing);
    }

    Render() {
        return {
            template: SideLoad('./components/templates/compact-listing.html'),
            style: SideLoad('./components/css/compact-listing.css'),
        };
    }

    OnceRendered() {

    }
}

RegisterComponent(CompactProductListing);
