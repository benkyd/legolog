import { RegisterComponent, Component } from './components.mjs';

class Search extends Component {
    static __IDENTIFY() { return 'search'; }

    constructor() {
        super(Search);
    }

    Render() {
        return {
            template: `
                <input id="search-bar" class="menu-item" type="text" placeholder="search..."/>
            `,
            style: `
                /* Modified version of https://codepen.io/mihaeltomic/pen/vmwMdm */
                #search-bar {
                    width: 100%;
                    height: 100%;
                    padding: 12px 14px;
                    background-color: transparent;
                    transition: transform 250ms ease-in-out;
                    font-family: 'Josefin Sans', sans-serif;
                    font-size: 0.5em;
                    color: #222;
                    background-color: transparent;
                    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-size: 27px 27px;
                    background-position: 97.5% center;
                    border-radius: 10px;
                    border: 4px solid #222;
                    transition: all 250ms ease-in-out;
                    backface-visibility: hidden;
                    transform-style: preserve-3d;
                }
                
                .search__input::placeholder {
                    color: rgba(87, 87, 86, 0.8);
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                }
                
                #search-bar:hover, #search-bar:focus {
                    padding: 12px 0;
                    outline: 0;
                    border: 2px solid transparent;
                    border-bottom: 4px solid #222;
                    border-radius: 0;
                    background-position: 100% center;
                }
            
                @media (pointer:none), (pointer:coarse), screen and (max-width: 900px) {
                    #search-bar {
                        width: 100%;
                        margin: 0;
                    }
                }
            `,
        };
    }
}

RegisterComponent(Search);
