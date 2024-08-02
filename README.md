# CUMSA membership management

## Contributors

Original author: Glenda Teo (2023-24 Sports Secretary)

Currently being maintained by Zeyu (2024-25 Database Officer)

## Page Overview

### Payment Approval

This page is for the treasurer to approve bank transfers once they enter our bank account. Once the treasurer sees the transaction members will be marked as paid. Members marked as paid will also automatically be sent an email that confirms receipt of their payment.

### Card Issue Approval

Once members are marked as 'paid' they will be viewable in this section. The database officer should download the csv of those who've paid and put them into the Qpay system. (detailed in SOP)

### Mailing List Adding

After members have been sent their card and are official members, they can be added to our mailing list. Download the `.txt` file and copy it into the SYMPA system (detailed in SOP).

### Member Search

This is for ensuring all members who signup for events and obtain CUMSA subsidies are actual CUMSA members. Database officer should check each person who signs up is a CUMSA member.

## Architecture

### AWS

We use API Gateway as an interface for our Lambda functions.

DynamoDB Scan is done at the start of each page, and filtered from there. (Can consider upgrading system to use a query and secondary indices but make sure the cost of doing so is worth it for our usecase)

## Managing Users

Users can be managed in AWS Cognito. We are using a user pool to authenticate users.
