import { RegisterComponent, Component, SideLoad } from './components.mjs';

class NotificationBar extends Component {
    static __IDENTIFY() { return 'notificationbar'; }

    constructor() {
        super(NotificationBar);
    }

    Render() {
        return {
            template: SideLoad('./components/templates/notificationbar.html'),
            style: SideLoad('./components/css/notificationbar.css'),
        };
    }

    OnceRendered() {
        // expect only one notification bar on the dom (otherwise this won't work)
        const notificationToggler = document.querySelector('notificationbar-component').shadowRoot.querySelector('.notification-toggler');
        const notificationBar = document.querySelector('notificationbar-component').shadowRoot.querySelector('.notification-bar');

        notificationToggler.addEventListener('click', () => {
            notificationBar.classList.add('notification-toggled');
        });
    }
}

RegisterComponent(NotificationBar);
