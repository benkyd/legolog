
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
    localStorage.setItem = function (key, value) {
        OldSetItem.apply(this, arguments);
        OnStorage({
            key,
            value,
        });
    };
}
