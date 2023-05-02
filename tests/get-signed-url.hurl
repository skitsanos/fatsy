POST {{URL}}/api/uploads/s3/get-url
{
    "file": "test.jpg"
}

HTTP *

[Asserts]
status == 200
jsonpath "$.result" != null

[Captures]
SIGNED_URL: jsonpath "$.result"