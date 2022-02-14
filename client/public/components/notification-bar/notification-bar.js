const notificationToggler = document.querySelector('notification-bar-component').shadowRoot.querySelector('.notification-toggler');
const notificationBar = document.querySelector('notification-bar-component').shadowRoot.querySelector('.notification-bar');

notificationToggler.addEventListener('click', () => {
    notificationBar.classList.add('notification-toggled');
});
