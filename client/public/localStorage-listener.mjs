// this was made for the purpose of being able to listen to changes in localStorage
// because i needed that to see if the user was admin or not to display certain elements
// in the navbar
// HOWEVERRRRRRRRRRRRRRRRR it would have been like SUPER SUPER useful when making the
// basket. hey whatever it's done now. TODO for a future refractor i guess...
const CallbackKeyArray = [];

const OldSetItem = localStorage.setItem;

export function ListenOnKey(key, callback) {
    CallbackKeyArray.push({
        key,
        callback,
    });
}

function OnStorage(event) {
    CallbackKeyArray.forEach((callback) => {
        if (callback.key === event.key) {
            callback.callback(event);
        }
    });
}

export function Init() {
    // WHAAAAAAAAAAAAAAAAAAAAAT
    localStorage.setItem = function (key, value) {
        OldSetItem.apply(this, arguments);
        OnStorage({
            key,
            value,
        });
    };
}
