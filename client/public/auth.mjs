import { NotifyNavbar } from './components/navbar.mjs';

const AUTH0CONFIG = {
    domain: 'benkyd.eu.auth0.com',
    clientId: 'WAOkscCNYD4FzXrm6pEQi3oNKNfa8l1F',
    audience: 'localhost:8080/api',
};

let auth0 = null;
let ready = false;

async function CheckRedirect() {
    const isAuthenticated = await auth0.isAuthenticated();
    if (isAuthenticated) {
        localStorage.setItem('loggedIn', true);
        ready = true;
        return;
    }

    const query = window.location.search;
    if (query.includes('state=')) {
        try {
            // process the login state
            await auth0.handleRedirectCallback();
        } catch (e) {
            window.alert(e.message || 'authentication error, sorry');
            localStorage.setItem('loggedIn', false);
            ready = false;
            Signout();
        }

        // remove the query parameters
        window.history.replaceState({}, document.title, '/');
    }
}

export async function InitAuth0() {
    ready = false;

    auth0 = await window.createAuth0Client({
        domain: AUTH0CONFIG.domain,
        client_id: AUTH0CONFIG.clientId,
        audience: AUTH0CONFIG.audience,
    });

    await CheckRedirect();

    const isAuthenticated = await auth0.isAuthenticated();
    if (isAuthenticated) {
        const user = await auth0.getUser();
        localStorage.setItem('user', user.given_name || user.nickname);
        NotifyNavbar('login', user);
        localStorage.setItem('loggedIn', true);
        ready = true;

        // tell the server about the logon, so that it can make the proper
        // entry in the database, if there is for example an address
        // associated with the user
        const token = await auth0.getTokenSilently();

        const fetchOptions = {
            method: 'GET',
            // bear hug
            headers: { Authorization: `Bearer ${token}` },
        };

        const res = await fetch('/api/auth/login', fetchOptions).then(res => res.json());

        localStorage.setItem('admin', res.user.admin);
    }
}

export async function GetToken() {
    /* eslint-disable-next-line */
    while (!ready) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    const token = await auth0.getTokenSilently();
    return token;
}

export async function LoginSignup() {
    const isAuthenticated = await auth0.isAuthenticated();
    if (isAuthenticated) {
        return;
    }

    const options = {
        redirect_uri: window.location.origin,
        response_type: 'code',
        scope: 'openid profile email',
    };

    auth0.loginWithRedirect(options);
}

export async function Signout() {
    localStorage.setItem('loggedIn', false);
    ready = false;
    localStorage.setItem('user', 'Guest');
    localStorage.setItem('admin', false);
    await auth0.logout({
        returnTo: window.location.origin,
    });
}
