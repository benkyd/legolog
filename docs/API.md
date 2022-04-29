# API Documentation

ALL API REQUESTS WILL BE PREFIXED WITH /api/

ALL AUTHENTICATION RELATED REQUESTS WILL BE PREFIXED WITH /api/auth/
this is because the API has no state so middleware will authenticate
automatically every request

## Routes

| Type | Route | Queries | Auth? | Notes |
| --- | --- | --- | - | --- |
| GET   | /api/special/                   |                 | ❌ | |
| GET   | /api/search/                    | query (q), page | ❌ | Query endpoint |
| GET   | /api/sets/featured              | page            | ❌ | |
| GET   | /api/sets/new                   | page            | ❌ | |
| GET   | /api/brick/:id                  |                 | ❌ | |
| POST  | /api/bulk/brick                 | array           | ❌ | POST due to bulk nature |
| GET   | /api/set/:id                    |                 | ❌ | |
| GET   | /api/cdn/:id                    |                 | ❌ | |
| GET   | /api/basket/price/              |                 | ❌ | |
| GET   | /api/discount/                  | offer code      | ❌ | |
| POST  | /api/order/                     |                 | ❌ | IF user is authenticated, auth/bearer will be sent and done manually without middleware |
| GET   | /api/auth/order/:id             |                 | ❌ | Security By Obscurity |
| GET   | /api/auth/login/                |                 | ✔️ | |
| GET   | /api/auth/orders/               |                 | ✔️ | |
| GET   | /api/auth/staff/orders/         |                 | ✔️ | All unshipped orders |
| PUT   | /api/auth/staff/order/:id       |                 | ✔️ | Update order to shipped, recieved (carrier) |
| PUT   | /api/auth/staff/stock/:type/:id |                 | ✔️ | Update stock on item |
| POST  | /api/auth/staff/stock/          | NOT IMPLEMENTED | ✔️ | Add item to inventory |
| DEL   | /api/auth/staff/stock/:type/:id | NOT IMPLEMENTED | ✔️ | Remove item from inventory |

Query endpoints do not return the full data on a brick/set, they return
a subset for product listing pages

## Query structure

For all endpoints that query, the following parameters are supported:

q: string to search for (fuzzy)

tag: tag to include in search (one at a time)

type: type of entity to return (set / brick)

total: total results (not pageified)

per_page: results to include per page

page: page requested

## Response Structure

```js
{
    data: {
        // defined in the response description for each route
    }
    // other important data, or metadata for the data
    // (such as pagination data) can be added here
}
```

## Error Structure

```js
{
    error: "Error doing x",
    long: "y needs to be z", // not always present
}
```

