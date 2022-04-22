import { RegisterComponent, Component } from './components.mjs';

class StoreFront extends Component {
    static __IDENTIFY() { return 'storefront'; }

    constructor() {
        super(StoreFront);
    }

    Render() {
        return {
            template: /* html */`
                <div class="main-carousel">
                    <div class="carousel-cell">
                        <img class="carousel-image" src="/res/lego-image1.jpg" alt="">
                        <div class="carousel-caption">
                            <h1>Welcome to LegoLog!</h1>
                            <a href="/featured/"><button>Shop LEGO® Now</button></a>
                        </div>
                    </div>
                    <div class="carousel-cell">
                        <img class="carousel-image" src="res/technic.png" alt="">
                        <div class="carousel-caption">
                            <h1>Check out our LEGO® Technic range</h1>
                            <a href="/search/?q=technic"><button>Shop Technic Now</button></a>
                        </div>
                    </div>
                    <div class="carousel-cell">
                        <img class="carousel-image" src="res/space.png" alt="">
                        <div class="carousel-caption">
                            <h1>NASA's Shuttle Discovery</h1>
                            <a href="/search/?q=nasa"><button>Shop Space Now</button></a>
                        </div>
                    </div>
                    <div class="carousel-cell">
                        <img class="carousel-image" src="res/builder.png" alt="">
                        <div class="carousel-caption">
                            <h1>Our Featured Bonsai Tree Set</h1>
                            <a href="/product/?type=set&id=1010&name=Lego%20Bonsai%20Tree"><button>Get It Now</button></a>
                        </div>
                    </div>
                </div>

                <product-list-component id="featured"
                                        title="Featured Lego Sets"
                                        getroute="/api/sets/featured"
                                        type="set">
                </product-list-component>
                `,
            style: `
                @import url('https://unpkg.com/flickity@2/dist/flickity.min.css');
                
                /* enable Flickity by default */
                .main-carousel:after {
                    content: 'flickity';
                    display: none; /* hide :after */
                }

                .carousel-image {
                    object-fit: cover;
                    object-position: center;

                    width: 100%;
                    height: 100%;
                }

                .carousel-cell {
                    height: 533px;
                    width: 800px;
                    margin-right : 10px;
                }

                .carousel-caption {
                    position: absolute;
                    right: 0;
                    left: 0;
                    bottom: 0;
                    text-align: center;
                    padding: 10px;
                }

                .carousel-caption h1 {
                    font-size: 2em;
                    color: #fff;
                    text-shadow: 0 0 5px #000;
                    font-weight: bold;
                }

                .carousel-caption p {
                }

                .carousel-caption button {
                    background-color: #E55744;
                    color: #fff;
                    text-shadow: 0 0 3px #000;
                    border: none;
                    padding: 10px;
                    font-size: 2em;
                    font-weight: bold;
                    border-radius: 5px;
                }

                .carousel-caption button:hover {
                    background-color: #D7331D;
                    cursor: pointer;
                }

                product-list-component {
                    z-index: 0;
                    display: block;
                    margin: 0 auto;
                }`,
        };
    }

    OnRender() {
        // setup flickity
        const carousel = this.root.querySelector('.main-carousel');
        this.flkty = new window.Flickity(carousel, {
            cellAlign: 'center',
            contain: true,
            wrapAround: true,
            watchCSS: true,
            autoPlay: true,
            prevNextButtons: true,
            pageDots: true,
        });
    }
}

RegisterComponent(StoreFront);
