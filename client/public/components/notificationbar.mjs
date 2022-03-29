import { RegisterComponent, Component, SideLoad } from './components.mjs';

class NotificationBar extends Component {
    static __IDENTIFY() { return 'notificationbar'; }

    constructor() {
        super(NotificationBar);
    }

    daysHoursMinutesSecondsUntil(time) {
        const now = new Date();
        const end = new Date(time);
        const diff = end.getTime() - now.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        return {
            days,
            hours,
            minutes,
            seconds,
        };
    }

    async OnMount() {
        const data = await fetch('/api/special').then(response => response.json());
        const { days, hours, minutes, seconds } = this.daysHoursMinutesSecondsUntil(data.data.end);

        this.setState({
            title: data.data.title,
            endTime: data.data.end,
            timePretty: `${days}d ${hours}h ${minutes}m ${seconds}s`,
        });
    }

    Update() {
        setInterval(() => {
            const { days, hours, minutes, seconds } = this.daysHoursMinutesSecondsUntil(this.state.endTime);
            this.setState({
                ...this.getState,
                timePretty: `${days}d ${hours}h ${minutes}m ${seconds}s`,
            });
        }, 1000);
    }

    Render() {
        return {
            template: SideLoad('./components/templates/notificationbar.html'),
            style: SideLoad('./components/css/notificationbar.css'),
        };
    }

    OnRender() {
        // expect only one notification bar on the dom (otherwise this won't work)
        const notificationToggler = document.querySelector('notificationbar-component').shadowRoot.querySelector('.notification-toggler');
        const notificationBar = document.querySelector('notificationbar-component').shadowRoot.querySelector('.notification-bar');

        notificationToggler.addEventListener('click', () => {
            this.setState({
                ...this.getState,
                isOpen: !this.getState.isOpen,
            });

            notificationBar.classList.add('notification-toggled');
        });
    }
}

RegisterComponent(NotificationBar);
