# API Documentation

ALL API REQUESTS WILL BE PREFIXED WITH /api/

ALL AUTHENTICATION RELATED REQUESTS WILL BE PREFIXED WITH /api/auth/
this is because the API has no state so middleware will authenticate
automatically every request

## Routes

| Type | Route | Queries | Auth? | Notes |
| --- | --- | --- | -- | --- |
| GET   | /api/bricks/          | query, page   | no  | |
| GET   | /api/sets/            | query, page   | no  | |
| GET   | /api/brick/:id/       |               | no  | | 
| GET   | /api/set/:id/         |               | no  | |
| GET   | /api/cdn/:id/         |               | no  | |
| PUT   | /api/auth/login/      |               | yes | |
| POST  | /api/auth/signup/     |               | yes | |
| GET   | /api/auth/orders/     |               | yes | |
| GET   | /api/auth/basket/     |               | yes | |
| PUT   | /api/auth/basket/:id  | quantity      | yes | |
| POST  | /api/auth/basket/:id  |               | yes | manipulate basket content |
| DEL   | /api/auth/basket/:id  | quantity      | yes | if no id, delete whole |

## Response Structure

```js
{
    status: 200,
    error: false
    result: {
        // defined in the response description for each route
    }
}
```

## Error Structure

```js
{
    status: 400,
    error: {
        short: "Error doing x",
        long: "y needs to be z",
    }
}
```

