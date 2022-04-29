import { RegisterComponent, Component, SideLoad } from './components.mjs';

class StockEditor extends Component {
    static __IDENTIFY() { return 'stock-editor'; }

    constructor() {
        super(StockEditor);
    }

    Render() {
        return {
            template: /* html */`
                <div class="stock-editor">
                    <div class="stock-header">Stock Editor</div> 
                    <div class="collapsible-menu">
                        <div class="menu-header"> 
                            <span class="menu-header-text">Remove Item</span>
                            <img class="menu-header-arrow" src="/res/back-arrow.svg" height="30em" alt="down-arrow">
                        </div>
                        <div class="menu-content">
                            <div class="menu-content-item">
                                <span class="menu-content-item-text">Remove Item</span>
                                <input class="menu-content-item-id-input" type="text" placeholder="Item ID (1010)">
                                <input class="menu-content-item-type-input" type="text" placeholder="Item Type (brick/set)">
                                <button class="menu-content-item-button stock-lookup-button">Lookup</button>
                                <div id="remove-preview">
                                    <div class="preview-text">
                                        <span class="preview-text-title">Preview</span>
                                        <super-compact-listing-component class="stock-remove-preview"></super-compact-listing-component>
                                </div>
                                <button class="menu-content-item-button remove-stock-button">Remove</button>
                            </div>
                        </div>
                    </div>
                    <div class="collapsible-menu">
                        <div class="menu-header"> 
                            <span class="menu-header-text">Add Item</span>
                            <img class="menu-header-arrow" src="/res/back-arrow.svg" height="30em" alt="down-arrow">
                        </div>
                        <div class="menu-content">
                        </div>
                    </div>
            `,
            style: SideLoad('/components/css/stock-audit.css'),
        };
    }

    OnRender() {
        const collapseButton = this.root.querySelectorAll('.menu-header');

        collapseButton.forEach(el => el.addEventListener('click', (e) => {
            const parent = e.path[2].querySelector('.collapsible-menu') ? e.path[1] : e.path[2];
            const collapseContent = parent.querySelector('.menu-content');
            const collapseArrow = parent.querySelector('.menu-header-arrow');
            collapseContent.classList.toggle('details-open');
            collapseArrow.classList.toggle('menu-header-arrow-down');
        }));

        // remove
        const removeStockLookup = this.root.querySelector('.stock-lookup-button');
        removeStockLookup.addEventListener('click', () => {
            const preview = this.root.querySelector('.stock-remove-preview');
            const id = this.root.querySelector('.menu-content-item-id-input').value;
            const type = this.root.querySelector('.menu-content-item-type-input').value;

            preview.setAttribute('id', id);
            preview.setAttribute('type', type);
        });
    }
}

RegisterComponent(StockEditor);
