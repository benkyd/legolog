// it is important that no more than content than
// neccesary is fetched from the server
const preLoadCache = [];
export function SideLoad(path) {
    console.log(preLoadCache);

    return new Promise((resolve) => {
        if (preLoadCache[path]) {
            resolve(preLoadCache[path]);
        } else {
            const fetchPromise = fetch(path).then(response => response.text());
            preLoadCache[path] = fetchPromise;
            resolve(fetchPromise);
        }
    });
}

export function RegisterComponent(componentClass) {
    const name = componentClass.__IDENTIFY();
    console.log('registering component: ' + name);
    customElements.define(`${name}-component`, componentClass);
}

export class Component extends HTMLElement {
    constructor(child) {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.state = {};
        this.child = child;

        // give components a unique identifier
        // TODO: Make this unique
        // Components[child.__IDENTIFY()] = this;
    }

    // Override these
    Render() { this.__WARN('Render'); }
    OnceRendered() { this.__WARN('Render'); }
    static __IDENTIFY() { this.__WARN('identify'); }

    connectedCallback() {
        // set up to watch all attributes for changes
        this.watchAttributeChange(this.attributeChangedCallback.bind(this));

        // if there are any attributes related to the element
        // be sure to include them in the state to be sure that
        // they can be resolved
        for (const attribute of this.attributes) {
            this.SetState({ ...this.state, [attribute.name]: attribute.value });
        }

        if (this.attributes.length === 0) {
            this.__INVOKE_RENDER();
        }
    }

    disconnectedCallback() {
        this.root.innerHTML = '';
    }

    watchAttributeChange(callback) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes') {
                    const newVal = mutation.target.getAttribute(mutation.attributeName);
                    callback(mutation.attributeName, newVal);
                }
            });
        });
        observer.observe(this, { attributes: true });
    }

    attributeChangedCallback(name, newValue) {
        console.log(`attribute changed: ${name} ${newValue}`);
        this.SetState({ ...this.state, [name]: newValue });
        this.__INVOKE_RENDER();
    }

    get GetState() {
        return this.state;
    }

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

        // if res.template is a promise, we need to wait to resolve it
        if (res.template instanceof Promise) {
            res.template = await res.template;
        }
        if (res.style instanceof Promise) {
            res.style = await res.style;
        }

        // go through and resolve all of the "state" dependancies
        let resolved = res.template;
        const parserRegex = /{(.*?)}/gm;
        for (let m; (m = parserRegex.exec(res.template)) !== null;) {
            if (m.index === parserRegex.lastIndex) {
                parserRegex.lastIndex++;
            }

            // resolve the state dependancy and replace it in the template
            if (m[1].startsWith('this.state')) {
                const stateKey = m[1].substring(11);
                const stateValue = this.state[stateKey];
                if (stateValue === undefined) {
                    continue;
                }

                console.log('replacing', m[0], 'with', stateValue);
                resolved = resolved.replace(m[0], stateValue);
            }
        }

        this.root.innerHTML = resolved;

        const style = document.createElement('style');
        style.textContent = res.style;
        this.root.appendChild(style);

        this.OnceRendered();
    }

    static __WARN(caller) {
        console.error(`WARNING: ${caller} is not implemented`);
    }

    static __ERR(msg) {
        console.error(`ERROR: idiot ${msg}`);
    }
}
