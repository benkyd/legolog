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
                    <div class="menu">
                        <div class="menu-header"> 
                            <span class="menu-header-text">Remove Item</span>
                        </div>
                        <div class="menu-content">
                            <div class="menu-content-item">
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
                    <div class="menu">
                        <div class="menu-header"> 
                            <span class="menu-header-text">Add Item</span>
                        </div>
                        <div class="menu-content">
                            <div class="menu-content-item drop-area">
                                <input type="file" class="file-select" id="file" accept="image/*">
                                <div class="selected-img"></div>
                                <div class="preview-img"></div>
                        </div>
                    </div>
            `,
            style: SideLoad('/components/css/stock-audit.css'),
        };
    }

    OnRender() {
        // remove
        const removeStockLookup = this.root.querySelector('.stock-lookup-button');
        removeStockLookup.addEventListener('click', () => {
            const preview = this.root.querySelector('.stock-remove-preview');
            const id = this.root.querySelector('.menu-content-item-id-input').value;
            const type = this.root.querySelector('.menu-content-item-type-input').value;

            preview.setAttribute('id', id);
            preview.setAttribute('type', type);
        });

        const removeStockButton = this.root.querySelector('.remove-stock-button');
        removeStockButton.addEventListener('click', () => {
            const preview = this.root.querySelector('.stock-remove-preview');
            const id = preview.getAttribute('id');
            const type = preview.getAttribute('type');

            preview.removeAttribute('id');
            preview.removeAttribute('type');
        });


        // add stock
        const dropArea = this.root.querySelector('.drop-area');
        const selectedImage = this.root.querySelector('.selected-img');
        const previewImage = this.root.querySelector('.preview-img');
        const fileSelect = this.root.querySelector('.file-select');

        let file = null;

        const handleDrag = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };

        const updateSelected = () => {
            selectedImage.innerText = 'Selected image: ' + file.name;
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const img = this.root.createElement('img');
                img.src = reader.result;
                previewImage.append(img);
            };
        };

        const handleSelect = (images) => {
            console.log(images);
            if (images.length) {
                file = images[0];
                updateSelected();
                return;
            }
            file = images;
            updateSelected();
        };

        document.onpaste = (event) => {
            const items = (event.clipboardData || event.originalEvent.clipboardData).items;
            let blob = null;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') === 0) {
                    blob = items[i].getAsFile();
                }
            }
            handleSelect(blob);
        };

        const handleDrop = (e) => {
            const dt = e.dataTransfer;
            file = dt.files[0];
            updateSelected();
        };

        fileSelect.addEventListener('onchange', handleSelect, false);
        dropArea.addEventListener('dragenter', handleDrag, false);
        dropArea.addEventListener('dragleave', handleDrag, false);
        dropArea.addEventListener('dragover', handleDrag, false);
        dropArea.addEventListener('drop', handleDrag, false);
        dropArea.addEventListener('drop', handleDrop, false);
    }
}

RegisterComponent(StockEditor);
