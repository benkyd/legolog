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
        console.log(user);
        NotifyNavbar('login', user);
    }
}

export async function LoginSignup(context) {
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
