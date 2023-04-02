# Must be Err400 with empty body
POST http://localhost:3000/api/users

HTTP *

[Asserts]
status == 401

POST http://localhost:3000/api/auth/login
{
    "username": "{{DEBUG_USERNAME}}",
    "password": "{{DEBUG_PASSWORD}}"
}
HTTP *

[Asserts]
status == 200

[Captures]
token: jsonpath "$.result.token"

#Must be Err400 if incomplete body
POST http://localhost:3000/api/users
Authorization: Bearer {{token}}
{
    "username": "{{DEBUG_USERNAME}}"
}
HTTP *

[Asserts]
status == 400

#Must be OK if complete body
POST http://localhost:3000/api/users
Authorization: Bearer {{token}}
{
    "username": "{{DEBUG_USERNAME}}",
    "password": "{{DEBUG_PASSWORD}}"
}
HTTP *

[Asserts]
status == 200