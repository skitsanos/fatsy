#
# Get pres-signed URL to perform file upload
#
POST {{URL}}/api/uploads/s3/get-url
{
    "file": "test.md"
}

HTTP *

[Asserts]
status == 200
jsonpath "$.result" != null

[Captures]
SIGNED_URL: jsonpath "$.result"

#
# Upload file to the bucket
#
PUT {{SIGNED_URL}}
Content-Type: text/plain; charset=utf-8
```
# Markdown document example

{{URL}}
```

HTTP *