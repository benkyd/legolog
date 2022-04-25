import { RegisterComponent, Component } from './components.mjs';

class Basket extends Component {
    static __IDENTIFY() { return 'basket'; }

    constructor() {
        super(Basket);
    }

    OnMount() {
        const basket = localStorage.getItem('basket');
        if (basket) {
            const basketItems = JSON.parse(basket);
            this.setState({
                ...basketItems,
            }, false);
            console.log(basketItems, this.state);
        }

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
            this.root.classList.toggle('tag-selected');
        });
    }
}

RegisterComponent(Basket);
