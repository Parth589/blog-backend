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

* the jwt token will be stored into cookies in frontend.
* while making the request to '/login' , client have to pass 'mail' and 'redirect' parameters in 'req.body'. the
  redirect is a url where client makes the request to '/verify' endpoint with the token passed to it.
## todo:

* try to replace data type from String to ObjectId all fields which are storing reference to another objects in DB
