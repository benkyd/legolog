async function sideLoad(path) {
    return await fetch(path).then(response => response.text());
}

class Component extends HTMLElement {
    constructor() {
        super();
    }
}

// some not-so-scalable way to load all the components
async function loadComponents() {
    // because of "sECuRItY" i can't simply just find everything in the components folder
    // there is a way to sideload this with express and have it do all that stuff
    // TODO: implement this
    const components = [ 
        'navbar'
    ];
    for (let i = 0; i < components.length; i++) {
        const path = `./components/${components[i]}.html`;
        const component = await sideLoad(path);
        const stylePath = `./components/${components[i]}.css`;
        const styleComponent = await sideLoad(stylePath);

        const Template = class extends Component {
            constructor() {
                super();
            }
            async connectedCallback() {
                const shadow = this.attachShadow({mode: 'open'});

                shadow.innerHTML = component;
                
                const style = document.createElement('style');
                style.textContent = styleComponent;
                shadow.appendChild(style);
            }
        }
        Object.defineProperty(Template, 'name', {value: components[i]});
        customElements.define(`${components[i]}-component`, Template);
    }
}

loadComponents();
