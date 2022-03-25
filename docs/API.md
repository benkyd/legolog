# API Documentation

ALL API REQUESTS WILL BE PREFIXED WITH /api/

ALL AUTHENTICATION RELATED REQUESTS WILL BE PREFIXED WITH /api/auth/
this is because the API has no state so middleware will authenticate
automatically every request

## Routes

| Type | Route | Queries | Auth? | Notes |
| --- | --- | --- | -- | --- |
| GET   | /api/search/          | query, page   | no  | |
| GET   | /api/bricks/          | query, page   | no  | |
| GET   | /api/sets/            | query, page   | no  | |
| GET   | /api/sets/featured    | page          | no  | |
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
| DEL   | /api/auth/basket/     |               | yes | if no id, delete whole |

## Query structure



### /api/search/
### /api/bricks/

GET

Response Object
```json
{

}
```

### /api/sets/
### /api/brick/:id/
### /api/set/:id/
### /api/cdn/:id/
### /api/auth/login/
### /api/auth/signup/

Request Body
```json
{

}
```

Response Object
```json
{
    
}
```

### /api/auth/orders/
### /api/auth/basket/

## Response Structure

```js
{
    error: false
    result: {
        // defined in the response description for each route
    }
}
```

## Error Structure

```js
{
    error: {
        short: "Error doing x",
        long: "y needs to be z",
    }
}
```

