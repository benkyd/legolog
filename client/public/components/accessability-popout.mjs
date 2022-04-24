import { RegisterComponent, Component } from './components.mjs';

class AccessabilityPopout extends Component {
    static __IDENTIFY() { return 'accessability-popout'; }

    constructor() {
        super(AccessabilityPopout);
    }

    OnMount() {
        const size = localStorage.getItem('font-size');

        // https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device
        this.isMobile = false;
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            this.isMobile = true;
        }

        switch (size) {
            case 'Small':
                this.setSmallFontSize();
                break;
            case 'Large':
                this.setLargeFontSize();
                break;
            case 'Normal':
            default:
                this.setNormalFontSize();
                break;
        }

        this.setState({
            fontSize: size,
        });
    }

    Render() {
        return {
            template: /* html */`
                <span id="accessability-wrapper">
                    <div class="accessability">
                        <svg id="accessability-icon" class="menu-item" stroke-width="2px" width="45px" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88"><title>accessibility</title><path d="M61.44,0A61.46,61.46,0,1,1,18,18,61.21,61.21,0,0,1,61.44,0Zm-.39,74.18L52.1,98.91a4.94,4.94,0,0,1-2.58,2.83A5,5,0,0,1,42.7,95.5l6.24-17.28a26.3,26.3,0,0,0,1.17-4,40.64,40.64,0,0,0,.54-4.18c.24-2.53.41-5.27.54-7.9s.22-5.18.29-7.29c.09-2.63-.62-2.8-2.73-3.3l-.44-.1-18-3.39A5,5,0,0,1,27.08,46a5,5,0,0,1,5.05-7.74l19.34,3.63c.77.07,1.52.16,2.31.25a57.64,57.64,0,0,0,7.18.53A81.13,81.13,0,0,0,69.9,42c.9-.1,1.75-.21,2.6-.29l18.25-3.42A5,5,0,0,1,94.5,39a5,5,0,0,1,1.3,7,5,5,0,0,1-3.21,2.09L75.15,51.37c-.58.13-1.1.22-1.56.29-1.82.31-2.72.47-2.61,3.06.08,1.89.31,4.15.61,6.51.35,2.77.81,5.71,1.29,8.4.31,1.77.6,3.19,1,4.55s.79,2.75,1.39,4.42l6.11,16.9a5,5,0,0,1-6.82,6.24,4.94,4.94,0,0,1-2.58-2.83L63,74.23,62,72.4l-1,1.78Zm.39-53.52a8.83,8.83,0,1,1-6.24,2.59,8.79,8.79,0,0,1,6.24-2.59Zm36.35,4.43a51.42,51.42,0,1,0,15,36.35,51.27,51.27,0,0,0-15-36.35Z"></path></svg>
                    </div>
                    
                    <div id="accessability-popup" class="popup">
                        <div class="popup-header">
                            <span class="popup-title">Accessability Settings</span>
                            <button class="toggler">
                                <span class="cross-line cross-line-top"></span>
                                <span class="cross-line cross-line-bottom"></span>
                            </button>
                        </div>
                        <div class="popup-content">
                            <div class="popup-content-item">
                                Text size: <span class="text-size">{this.state.fontSize}</span>
                                <div class="text-size-controls">
                                    <button class="text-size-control small">aa</button>
                                    <button class="text-size-control normal">aA</button>
                                    <button class="text-size-control large">AA</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </span>
            `,
            style: `
                #accessability-wrapper {
                    flex-basis: 4%;
                }
                
                .accessability {
                    display: flex;
                    justify-content: space-between;
                    padding-bottom: 2px;
                }

                .accessability:hover {
                    opacity: 0.5;
                }
                                
                #accessability-icon {
                    padding-top: 2px;
                    cursor: pointer;
                }

                .popup {
                    display: none;
                }

                .show {
                    display: flex;
                }

                #accessability-popup {
                    font-size: 0.5em;
                    position: absolute;
                    background-color: #AB8FFF;
                    border: 1px solid #222;
                    right: 0;
                    width: 400px;
                    padding-top: 10px;
                    padding-bottom: 10px;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    z-index: 100;
                }

                @media (pointer:none), (pointer:coarse), screen and (max-width: 900px) {
                    #accessability-popup {
                        position: absolute;
                        left: 0;
                        width: 100%;
                    }
                }

                .popup-header {
                    display: flex;
                    justify-content: space-between;
                    padding-bottom: 2px;
                    font-size: 1.5em;
                    font-weight: bold;
                }

                .toggler {
                    position: absolute;
                    right: 2px;
                    top: 2px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    outline: none;
                    height: 2em;
                    width: 2em;
                    z-index: 50;
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
                
                #toggler:hover .cross-line {
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

                .popup-content {
                    display: flex;
                    flex-direction: column;
                    flex-wrap: nowrap;
                    justify-content: left;
                    width: 100%;
                    height: 100%;
                    justify-content: space-between;
                }

                .popup-content-item {
                    padding: 10px;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    justify-content: space-between;
                    align-items: center;
                }

                .text-size-controls {
                    flex-basis: 50%;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    justify-content: space-around;
                    align-items: center;
                }

                .text-size-control {
                    padding: 5px;
                    cursor: pointer;
                    outline: none;
                    border: none;
                    background: #222;
                    color: #fff;
                    font-size: 1.5em;
                    font-weight: bold;
                    transition: all 0.2s ease-in;
                }

                .text-size-control:hover {
                    background: #777;
                }

                .text-size-control.small {
                    font-size: 0.7em;
                }

                .text-size-control.normal {
                    font-size: 1em;
                }

                .text-size-control.large {
                    font-size: 1.5em;
                }
            `,
        };
    }

    setSmallFontSize() {
        localStorage.setItem('font-size', 'Small');
        // check if screen is mobile first
        if (!this.isMobile) {
            document.body.style.fontSize = '12px';
        } else {
            document.body.style.fontSize = '16px';
        }
    }

    setNormalFontSize() {
        localStorage.setItem('font-size', 'Normal');
        if (!this.isMobile) {
            document.body.style.fontSize = '16px';
        } else {
            document.body.style.fontSize = '25px';
        }
    }

    setLargeFontSize() {
        localStorage.setItem('font-size', 'Large');
        if (!this.isMobile) {
            document.body.style.fontSize = '24px';
        } else {
            document.body.style.fontSize = '40px';
        }
    }


    OnRender() {
        const accessabilityWrapper = this.root.querySelector('#accessability-wrapper');
        const accessabilityToggler = this.root.querySelector('.accessability');
        const popup = this.root.querySelector('.popup');
        const closeButton = this.root.querySelector('.toggler');

        accessabilityToggler.addEventListener('click', () => {
            popup.classList.toggle('show');
        });

        closeButton.addEventListener('click', () => {
            popup.classList.remove('show');
        });

        const toggler = this.root.querySelector('.toggler');
        toggler.addEventListener('click', () => {
            popup.classList.remove('show');
        });

        // allow "click off to close", allowing for the users mouse to start clicking and dragging inside the popup
        // without closing it if the mouse leaves the popup
        let isMouseInside = true;

        accessabilityWrapper.addEventListener('mouseleave', () => {
            isMouseInside = false;
        });

        accessabilityWrapper.addEventListener('mouseenter', () => {
            isMouseInside = true;
        });

        window.addEventListener('click', () => {
            if (!isMouseInside) {
                popup.classList.remove('show');
            }
        });

        // text size controls
        const small = this.root.querySelector('.small');
        const normal = this.root.querySelector('.normal');
        const large = this.root.querySelector('.large');

        small.addEventListener('click', () => {
            this.setSmallFontSize();
            this.setState({ fontSize: 'Small' });
        });

        normal.addEventListener('click', () => {
            this.setNormalFontSize();
            this.setState({ fontSize: 'Normal' });
        });

        large.addEventListener('click', () => {
            this.setLargeFontSize();
            this.setState({ fontSize: 'Large' });
        });
    }
}

RegisterComponent(AccessabilityPopout);
