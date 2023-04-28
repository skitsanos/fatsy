# Must be Err400 with empty body
POST {{URL}}/api/auth/login

HTTP *

[Asserts]
status == 400

#Must be Err400 if incomplete body
POST {{URL}}/api/auth/login
{
    "username": "{{DEBUG_USERNAME}}"
}
HTTP *

[Asserts]
status == 400

#Must be OK if complete body
POST {{URL}}/api/auth/login
{
    "username": "{{DEBUG_USERNAME}}",
    "password": "{{DEBUG_PASSWORD}}"
}
HTTP *

[Asserts]
status == 200