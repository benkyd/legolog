import BaseComponent from './components.js';

export default class NotificationBarComponent extends BaseComponent {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    render() {
        this.html = `
        <nav class="navbar">
            <div class="logo"><img src="res/logo.svg" height="80em" alt="logo"></div>
            
            <div class="push-right">
                <!-- https://jonsuh.com/hamburgers/ -->
                <button id="menu-toggler" class="hamburger">
                    <span class="hamburger-line hamburger-line-top"></span>
                    <span class="hamburger-line hamburger-line-middle"></span>
                    <span class="hamburger-line hamburger-line-bottom"></span>
                </button>
            
                <ul class="primary-menu menu nav-menu">
                    <li class="menu-item current-menu-item"><a class="nav-link" href="#">New</a></li>
                    <li class="menu-item dropdown"><a class="nav-link" href="#">Sets▾</a>
                        <!-- TODO: Going to need to dynamically generate this -->
                        <ul class = "sub-nav">
                            <li><a class="sub-nav-link" href="#">1</a></li>
                            <li><a class="sub-nav-link" href="#">2</a></li>
                            <li><a class="sub-nav-link" href="#">3</a></li>
                        </ul>
                    </li>
                    <li class="menu-item dropdown"><a class="nav-link"  href="#">Bricks▾</a>
                        <ul class="sub-nav" >
                            <li><a class="sub-nav-link" href="#">1</a></li>
                            <li><a class="sub-nav-link" href="#">2</a></li>
                            <li><a class="sub-nav-link" href="#">3</a></li>
                        </ul>
                    </li>
                    <li class="menu-item"><a class="nav-link" href="#">My Account</a>
                </ul>
                <ul class="secondary-menu menu push-down">
                    
                    <span class="search-wrapper">
                        <input id="search-bar" class="menu-item" type="text" placeholder="search..."/>
                    </span>

                    <img id="fave-icon" class="menu-item" src="https://www.svgrepo.com/show/25921/heart.svg" width="27px" stroke="#222" stroke-width="2px" alt="">
                    
                    <span id="cart-wrapper">
                        <img id="cart-icon" class="menu-item" src="https://www.svgrepo.com/show/343743/cart.svg" width="30px" stroke="#222" stroke-width="2px" alt="">
                        <span id="cart-number" class="menu-item">5</span>
                    </span>
                </ul>
            </div>
        </nav>`;
    }

    attatchStyle() {
        return `
        .notification-bar {
            display: inline-block;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 2em;
            background-color: #00B4F5;
            box-shadow: #222 0px 0px 5px;
            transition: all 0.3s ease-in;
        }
        
        .notification-bar-text {
            font-family: 'Josefin Sans', sans-serif;
            text-transform: uppercase;
            text-align: center;
            color: #fff;
            padding: 0px 1em;
            height: 100%;
            line-height: 35px;
            font-size: 1.3em;
            font-weight: bold;
            text-align: center;
        }
        
        .notification-bar-close {
            display: inline-block;
            padding: 0px 1em;
            height: 100%;
            line-height: 2em;
            color: #fff;
            font-size: 1.5em;
            font-weight: bold;
            text-align: center;
            font-family: 'Open Sans', sans-serif;
        }
        
        .notification-bar-close:hover {
            color: #fff;
        }
        
        .notification-bar-close:focus {
            outline: none;
        }
        
        .notification-bar-close:active {
            color: #fff;
        }
        
        .notification-bar-close:hover {
            color: #fff;
        }
        
        .notification-bar-close:focus {
            outline: none;
        }
        
        .notification-toggler {
            position: absolute;
            right: 2px;
            top: 2px;
            background: transparent;
            border: none;
            cursor: pointer;
            outline: none;
            height: 2em;
            width: 2em;
            z-index: 100;
            transition: all 0.2s ease-in;
        }
        
        .cross-line {
            background: #222;
            box-shadow: #222 0px 0px 2px;
            position: absolute;
            height: 2px;
            left: 0;
            width: 100%;
        }
        
        #notification-toggler:hover .cross-line {
            background: #777;
        }
        
        .cross-line-top {
            top: 50%;
            transform: rotate(45deg) translatey(-50%);
        }
        
        .cross-line-bottom {
            bottom: 50%;
            transform: rotate(-45deg) translatey(50%);
        }
        
        /* move it further up the screen than the mobile toggler would */
        .notification-toggled {
            transform: translatey(-200%);
        }
        
        /* don's show on mobile or 'small mode' */
        @media (pointer:none), (pointer:coarse), screen and (max-width: 900px) {
            .notification-bar {
                transform: translatey(-200%);
            }
        }`;
    }
}
