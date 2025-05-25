export const samplePolicies = [
  {
    id: "s3-read-only",
    name: "S3 Read-Only Access",
    description: "Allows GetObject and ListBucket operations on a specific S3 bucket",
    json: `{
  "Version": "2025-05-24",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::example-bucket",
        "arn:aws:s3:::example-bucket/*"
      ]
    }
  ]
}`
  },
  {
    id: "ec2-management",
    name: "EC2 Management",
    description: "Allows operations to create, stop, and start EC2 instances",
    json: `{
  "Version": "2025-05-24",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:StartInstances",
        "ec2:StopInstances",
        "ec2:DescribeInstances"
      ],
      "Resource": "*"
    }
  ]
}`
  },
  {
    id: "dynamodb-full-access",
    name: "DynamoDB Full Access",
    description: "Provides full access to DynamoDB tables with specific name patterns",
    json: `{
  "Version": "2025-05-24",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/MyTable*"
    }
  ]
}`
  },
  {
    id: "complex-policy",
    name: "Complex Policy with Conditions",
    description: "A policy with multiple statements, conditions, and resource patterns",
    json: `{
  "Version": "2025-05-24",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": "*",
      "Condition": {
        "IpAddress": {
          "aws:SourceIp": "192.0.2.0/24"
        }
      }
    },
    {
      "Effect": "Deny",
      "Action": [
        "s3:DeleteBucket",
        "s3:DeleteObject"
      ],
      "Resource": "*"
    }
  ]
}`
  }
];