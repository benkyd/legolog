// Basket is stored locally only and is not persisted to the server.
// It is used to store the current basket and is used to calculate the total price of the basket.
// It is also used to store the current user's basket.
// The structure of the basket is in local storage and is as follows:
// {
//     "basket": {
//         "items": {
//             "item1~modifier": { quantity, type },
//             "item2": { quantity, type },
//             ...
//         },
//         "total": total
//     },
// }

// TODO: Does the localstorage have a problem with mutual exclusion?
// TODO: Should the basket be persisted to the server?
export function GetBasketItems() {
    if (localStorage.getItem('basket') === null || !localStorage.getItem('basket')) {
        return;
    }
    return JSON.parse(localStorage.getItem('basket')).items;
}

export function AddProductToBasket(product, type, amount, brickModifier = 'none') {
    if (localStorage.getItem('basket') === null || !localStorage.getItem('basket')) {
        localStorage.setItem('basket', JSON.stringify({
            items: {},
            total: 0,
        }));
    }

    const basket = JSON.parse(localStorage.getItem('basket'));

    if (type === 'brick') {
        product += '~' + brickModifier;
    }

    if (basket.items[product]) {
        basket.items[product].quantity += amount;
    } else {
        basket.items[product] = {
            quantity: amount,
            type,
        };
    }

    basket.total += amount;

    localStorage.setItem('basket', JSON.stringify(basket));
}

export function RemoveProductFromBasket(product, type, amount, brickModifier = 'none') {
    if (localStorage.getItem('basket') === null || !localStorage.getItem('basket')) {
        return;
    }
    const basket = JSON.parse(localStorage.getItem('basket'));

    if (type === 'brick') {
        product += '~' + brickModifier;
    }

    if (basket.items[product]) {
        if (basket.items[product].quantity > amount) {
            basket.items[product].quantity -= amount;
        } else {
            delete basket.items[product];
        }
    }

    basket.total -= amount;

    localStorage.setItem('basket', JSON.stringify(basket));
}

export function GetBasketTotal() {
    if (localStorage.getItem('basket') === null || !localStorage.getItem('basket')) {
        return 0;
    }

    const basket = JSON.parse(localStorage.getItem('basket'));

    return basket.total;
}

export async function GetBasketTotalPrice(discount = 0, type = '£', entity_type = undefined) {
    if (localStorage.getItem('basket') === null || !localStorage.getItem('basket')) {
        return 0;
    }

    const basket = JSON.parse(localStorage.getItem('basket'));

    const res = await fetch('/api/basket/price', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(basket),
    }).then(res => res.json());

    if (res.error) {
        return 0;
    }
    return res.data.subtotal;
}

export async function GetAbsoluteBasketDiscount(discount = 0, type = '£', entity_type = undefined) {
    
}
