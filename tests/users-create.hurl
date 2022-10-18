# Must be Err400 with empty body
POST http://localhost:3000/users

HTTP/* *

[Asserts]
status == 400

#Must be Err400 if incomplete body
POST http://localhost:3000/users
{
    "username": "{{DEBUG_USERNAME}}"
}
HTTP/* *

[Asserts]
status == 400

#Must be OK if complete body
POST http://localhost:3000/users
{
    "username": "{{DEBUG_USERNAME}}",
    "password": "{{DEBUG_PASSWORD}}"
}
HTTP/* *

[Asserts]
status == 200