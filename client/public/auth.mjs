import { NotifyNavbar } from './components/navbar.mjs';

const AUTH0CONFIG = {
    domain: 'benkyd.eu.auth0.com',
    clientId: 'WAOkscCNYD4FzXrm6pEQi3oNKNfa8l1F',
    audience: 'localhost:8080/api',
};

let auth0 = null;

async function CheckRedirect() {
    const isAuthenticated = await auth0.isAuthenticated();
    if (isAuthenticated) {
        localStorage.loggedIn = true;
        return;
    }

    const query = window.location.search;
    if (query.includes('state=')) {
        try {
            // process the login state
            await auth0.handleRedirectCallback();
        } catch (e) {
            window.alert(e.message || 'authentication error, sorry');
            localStorage.loggedIn = false;
            Signout();
        }

        // remove the query parameters
        window.history.replaceState({}, document.title, '/');
    }
}

export async function InitAuth0() {
    localStorage.loggedIn = false;
    localStorage.user = 'Guest';

    auth0 = await window.createAuth0Client({
        domain: AUTH0CONFIG.domain,
        client_id: AUTH0CONFIG.clientId,
        audience: AUTH0CONFIG.audience,
    });

    await CheckRedirect();

    const isAuthenticated = await auth0.isAuthenticated();
    if (isAuthenticated) {
        const user = await auth0.getUser();
        localStorage.user = user.given_name || user.nickname;
        NotifyNavbar('login', user);
        localStorage.loggedIn = true;

        // tell the server about the logon, so that it can make the proper
        // entry in the database, if there is for example an address
        // associated with the user
        const token = await auth0.getTokenSilently();

        const fetchOptions = {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        };

        const res = await fetch('/api/auth/login', fetchOptions).then(res => res.json());
        console.log(res);

        // do stuff
    }
}

export async function GetToken() {
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
    localStorage.loggedIn = false;
    localStorage.user = 'Guest';
    await auth0.logout({
        returnTo: window.location.origin,
    });
}
