# API Documentation

ALL API REQUESTS WILL BE PREFIXED WITH /api/

ALL AUTHENTICATION RELATED REQUESTS WILL BE PREFIXED WITH /api/auth/
this is because the API has no state so middleware will authenticate
automatically every request

## Routes

| Type | Route | Queries | Auth? | Notes |
| --- | --- | --- | -- | --- |
| GET   | /api/special/         |                 | no  | |
| GET   | /api/type/:id         |                 | no  | |
| GET   | /api/search/          | query (q), page | no  | Query endpoint |
| GET   | /api/bricks/          | query (q), page | no  | Query endpoint |
| GET   | /api/sets/            | query (q), page | no  | Query endpoint |
| GET   | /api/sets/featured    | page            | no  | Query endpoint |
| GET   | /api/brick/:id        |                 | no  | |
| POST  | /api/bulk/brick       | array           | no  | POST due to bulk nature |
| GET   | /api/set/:id          |                 | no  | |
| GET   | /api/cdn/:id          |                 | no  | |
| GET   | /api/basket/price/    |                 | no  | |
| PUT   | /api/auth/login/      |                 | yes | |
| POST  | /api/auth/signup/     |                 | yes | |
| GET   | /api/auth/orders/     |                 | yes | |

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
    error: false
    data: {
        // defined in the response description for each route
    }
    // other important data, or metadata for the data can be added here
}
```

## Error Structure

```js
{
    error: "Error doing x",
    long: "y needs to be z",
}
```

