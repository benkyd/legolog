# API Documentation

ALL API REQUESTS WILL BE PREFIXED WITH /api/

ALL AUTHENTICATION RELATED REQUESTS WILL BE PREFIXED WITH /api/auth/
this is because the API has no state so middleware will authenticate
automatically every request

## Routes

| Type | Route | Queries | Auth? | Notes |
| --- | --- | --- | - | --- |
| GET   | /api/special/         |                 | ❌ | |
| GET   | /api/search/          | query (q), page | ❌ | Query endpoint |
| GET   | /api/sets/featured    | page            | ❌ | Query endpoint |
| GET   | /api/brick/:id        |                 | ❌ | |
| POST  | /api/bulk/brick       | array           | ❌ | POST due to bulk nature |
| GET   | /api/set/:id          |                 | ❌ | |
| GET   | /api/cdn/:id          |                 | ❌ | |
| GET   | /api/basket/price/    |                 | ❌ | |
| GET   | /api/discount/        | offer code      | ❌ | |
| POST  | /api/order/           |                 | ❌ | |
| GET   | /api/auth/order/:id   |                 | ❌ | Security By Obscurity |
| GET   | /api/auth/login/      |                 | ✔️ | |
| GET   | /api/auth/orders/     |                 | ✔️ | |

Query endpoints do not return the full data on a brick/set, they return
a subset for product listing pages

## Query structure

## Query parameters

For all endpoints that query, the following parameters are supported:

tags: tags to include in search

total: total results (not pageified)

per_page: results to include per page

page: page requested

q: string to search for (fuzzy)

brick: brick to search for (absolute type, fuzzy string)

set: brick to search for (absolute, fuzzy string)

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
    long: "y needs to be z",
}
```

