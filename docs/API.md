# API Documentation

ALL API REQUESTS WILL BE PREFIXED WITH /api/

ALL AUTHENTICATION RELATED REQUESTS WILL BE PREFIXED WITH /api/auth/
this is because the API has no state so middleware will authenticate
automatically every request

## Routes

| Type | Route | Queries | Auth? | Notes |
| --- | --- | --- | -- | --- |
| GET   | /api/special/         |               | no  | |
| GET   | /api/type/:id         |               | no  | |
| GET   | /api/search/          | query, page   | no  | Query endpoint |
| GET   | /api/bricks/          | query, page   | no  | Query endpoint |
| GET   | /api/sets/            | query, page   | no  | Query endpoint |
| GET   | /api/sets/featured    | page          | no  | Query endpoint |
| GET   | /api/brick/:id        |               | no  | |
| POST  | /api/bulk/brick       | array         | no  | POST due to bulk nature |
| GET   | /api/set/:id          |               | no  | |
| GET   | /api/cdn/:id          |               | no  | |
| PUT   | /api/auth/login/      |               | yes | |
| POST  | /api/auth/signup/     |               | yes | |
| GET   | /api/auth/orders/     |               | yes | |
| GET   | /api/auth/basket/     |               | yes | |
| PUT   | /api/auth/basket/:id  | quantity      | yes | |
| POST  | /api/auth/basket/:id  |               | yes | manipulate basket content |
| DEL   | /api/auth/basket/:id  | quantity      | yes | if no id, delete whole |
| DEL   | /api/auth/basket/     |               | yes | if no id, delete whole |

Query endpoints do not return the full data on a brick/set, they return
a subset for product listing pages

## Query structure

## Query parameters

For all endpoints that query, the following parameters are supported:

tags: tags to include in search

page: starting page

pages: pages to return starting from page

q: string to search for (fuzzy)

brick: brick to search for (absolute)

set: brick to search for (absolute)

### /api/special/

GET /api/special/

Response Object
```json
{
    "data": {
        "title": "Special 1",
        "end": "2020-01-31T00:00:00.000Z",
    }
}
```

### /api/type/:id

GET /api/type/:id

Response Object
```json
{
    "data": {
        "type": "brick", // or set
    }
}
```

### /api/search/

GET /api/search?params

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

