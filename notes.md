* all service requests (i.e. all requests other than login & register) must have an authorization header which must
  starts with the word Bearer and then JWT appended to
  it.

### TODO: check the routes again before deploying

* to login: POST /login

```js
request.body = {mail, password}
```

* to register: POST /login

```js
request.body = {mail, password, username}
```

### Completed Tasks

* DB schema
* Routes

## Response structure

```json
{
  "success": "Boolean",
  "msg": "String",
  "data": "Object | Array | null | undefined"
}
```

## todo:

* user profile picture is not implemented
