export async function SideLoad(path) {
    return await fetch(path).then(response => response.text());
}

const Components = [];


export function RenderComponent(componentClass) {
    const name = componentClass.__IDENTIFY();
    if (!Components[name]) {
        const newComponent = new componentClass();
        Components[name] = newComponent;
        customElements.define(`${name}-component`, newComponent);
    }

    Components[name].__INVOKE_RENDER();
}

export class BaseComponent extends HTMLElement {
    constructor(name) {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.state = {};
        RegisterComponent(name, this);
    }

    // Override this
    Render() { this.__WARN('Render'); }

    SetState(newState) {
        this.state = newState;
        this.__INVOKE_RENDER(Object.bind(this));
    }

    async __INVOKE_RENDER() {
        const res = this.Render(Object.bind(this));
        if (!res.template || !res.style) {
            this.__ERR('no template or style');
            return;
        }
        if (res.template.PromiseState) {
            res.template = await res.template;
        }
        if (res.style.PromiseState) {
            res.style = await res.style;
        }

        // go through and resolve all of the "state" dependancies
        const parserRegex = /{.*?}/;
        for (let m; (m = parserRegex.exec(res.template)) !== null;) {
            if (m.index === parserRegex.lastIndex) {
                parserRegex.lastIndex++;
            }

            console.log(m[2]);
        }
    }

    static __IDENTIFY() { this.__WARN('identify'); }

    __WARN(caller) {
        console.error(`WARNING: ${caller} is not implemented`);
    }

    __ERR(msg) {
        console.error(`ERROR: idiot ${msg}`);
    }
}
