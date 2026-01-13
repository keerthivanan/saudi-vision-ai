
# ☁️ AWS S3 Setup Guide for Saudi Legal AI

To handle "Lakhs" (100,000+) of documents, we use **Amazon S3** (Simple Storage Service). Think of it as an infinite, secure hard drive in the cloud.

## Step 1: Create an AWS Account
1.  Go to [aws.amazon.com](https://aws.amazon.com).
2.  Click **Create an AWS Account**.
3.  Fill in your email and details (requires a credit card for verification, but S3 has a generous Free Tier).

## Step 2: Create a Bucket (The Folder)
1.  Search for **S3** in the AWS Console.
2.  Click **Create bucket**.
3.  **Bucket Name**: Choose a unique name (e.g., `saudi-vision-docs-2030`).
4.  **Region**: Choose `US East (N. Virginia)` or `Middle East (Bahrain)` for lower latency.
5.  **Block Public Access**: Keep this **CHECKED** (ON). We want your documents to be private.
6.  Click **Create bucket**.

## Step 3: Get Your "Keys" (Credentials)
This is how your Python Backend talks to AWS.

1.  Search for **IAM** in the AWS Console.
2.  Go to **Users** -> **Create user**.
3.  Name: `ai-backend-user`.
4.  **Permissions**: Select "Attach policies directly".
5.  Search for `AmazonS3FullAccess` and check the box.
6.  Create the user.
7.  Click on the new user -> **Security credentials** tab.
8.  Scroll to **Access keys** -> **Create access key**.
9.  Select **Command Line Interface (CLI)** > Check "I understand..." > Next.
10. **Copy** the `Access Key ID` and `Secret Access Key`. (Save them safely!).

## Step 4: Connect it to Your Website
Open your `backend/.env` file and verify these lines:

```env
# ... existing config ...

# CLOUD STORAGE (AWS S3)
AWS_ACCESS_KEY_ID=AKIA.......       <-- Paste ID here
AWS_SECRET_ACCESS_KEY=.......       <-- Paste Secret here
AWS_BUCKET_NAME=saudi-vision-docs-2030
AWS_Region=us-east-1
```

## Step 5: I Do the Rest
Once you have those keys in the file, tell me "I have the keys".
I will then:
1.  Install `boto3` (AWS Driver).
2.  Write the code to automatically upload your `documents/` folder to the Cloud.
3.  Update the AI to read from the Cloud.

**Result**: You can upload 10TB of PDFs and the AI will handle it effortlessly.
