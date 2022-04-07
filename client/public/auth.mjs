import { NotifyNavbar } from './components/navbar.mjs';

const AUTH0CONFIG = {
    domain: 'benkyd.eu.auth0.com',
    clientId: 'WAOkscCNYD4FzXrm6pEQi3oNKNfa8l1F',
};

let auth0 = null;

async function CheckRedirect() {
    const isAuthenticated = await auth0.isAuthenticated();
    if (isAuthenticated) {
        return;
    }

    const query = window.location.search;
    if (query.includes('state=')) {
        try {
            // process the login state
            await auth0.handleRedirectCallback();
        } catch (e) {
            window.alert(e.message || 'authentication error, sorry');
            Signout();
        }

        // remove the query parameters
        window.history.replaceState({}, document.title, '/');
    }
}

export async function InitAuth0() {
    auth0 = await window.createAuth0Client({
        domain: AUTH0CONFIG.domain,
        client_id: AUTH0CONFIG.clientId,
    });

    await CheckRedirect();

    const isAuthenticated = await auth0.isAuthenticated();
    if (isAuthenticated) {
        const user = await auth0.getUser();
        NotifyNavbar('login', user);

        // tell the server about the logon, so that it can make the proper
        // entry in the database, if there is for example an address
        // associated with the user
        const token = await auth0.getTokenSilently();

        const fetchOptions = {
            credentials: 'same-origin',
            method: 'GET',
            headers: { Authorization: 'Bearer ' + token },
        };
        const res = await fetch('/api/auth/login', fetchOptions);
        if (!res.ok) {
            throw new Error('failed to login with the server');
        }
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
    await auth0.logout({
        returnTo: window.location.origin,
    });
}
