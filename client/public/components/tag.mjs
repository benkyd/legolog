import { RegisterComponent, Component } from './components.mjs';

class Tag extends Component {
    static __IDENTIFY() { return 'tag'; }

    constructor() {
        super(Tag);
    }

    Render() {
        return {
            template: /* html */`
                <span class="tag">{this.state.name}</span>
            `,
            style: `
                .tag {
                    font-size: 0.8em;
                    padding: 0.2em 0.5em;
                    margin-right: 0.3em;
                    margin-top: 0.2em;
                    margin-bottom: 0.2em;
                    line-height: 1.3em;
                    font-weight: bold;
                    background-color: #F2CA52;
                    cursor: pointer;
                }
            `,
        };
    }

    OnRender() {
        this.root.addEventListener('click', () => {
            window.location.href = `/search?q=${this.state.name}`;
        });
    }
}

RegisterComponent(Tag);
