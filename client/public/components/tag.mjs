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
                    padding: 0.3em 1em;
                    margin-right: 0.3em;
                    margin-top: 0.3em;
                    margin-bottom: 0.3em;
                    line-height: 1.5em;
                    font-size: 0.8em;
                    font-weight: bold;
                    background-color: #F2CA52;
                    cursor: pointer;
                }
            `,
        };
    }

    OnRender() {
        this.root.addEventListener('click', () => {
            this.root.classList.toggle('tag-selected');
        });
    }
}

RegisterComponent(Tag);
