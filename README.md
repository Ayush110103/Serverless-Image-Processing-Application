# **Serverless Image Processing Application**

This project provides a **serverless image processing solution** using **AWS Lambda** (cloud setup) and a **local image processing solution** that works entirely within the browser (non-cloud setup). Users can upload images and perform processing tasks such as resizing, grayscale conversion, and blur.

## **Table of Contents**
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Setup](#project-setup)
  - [Cloud Setup (AWS Lambda + S3)](#cloud-setup-aws-lambda--s3)
  - [Non-Cloud Setup (Local Run)](#non-cloud-setup-local-run)
- [Usage](#usage)
- [Contributing](#contributing)

## **Features**
- **Image Upload**: Users can upload images via a web interface.
- **Image Processing**: The application supports resizing, grayscale conversion, and Gaussian blur.
- **Download Processed Images**: Users can download the processed images.
- **Cloud Setup**: Uses AWS Lambda and S3 for serverless image processing.
- **Non-Cloud Setup**: Allows image processing locally in the browser using JavaScript and the HTML5 Canvas API.

---

## **Technologies Used**
- **AWS Lambda** (Cloud setup for serverless image processing)
- **Amazon S3** (Cloud storage for uploaded and processed images)
- **API Gateway** (For invoking Lambda functions)
- **Node.js** (Backend for AWS Lambda)
- **Sharp** (Node.js image processing library)
- **HTML5 & JavaScript** (For front-end and local processing)
- **HTML5 Canvas API** (For non-cloud image processing)

---

## **Project Setup**

### **Cloud Setup (AWS Lambda + S3)**

This setup leverages AWS services to build a **serverless image processing application**. It processes images uploaded to an S3 bucket and applies transformations such as resizing, grayscale, or blur using **AWS Lambda**.

#### **Prerequisites**
- AWS account
- AWS CLI configured
- Node.js installed
- AWS Lambda access
- An S3 bucket to store images

#### **Steps**

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repository-url
   cd your-repository-folder
2. **Install Dependencies: Install the necessary dependencies using Node.js**:
3. Set Up AWS S3 Buckets:

Create two S3 buckets:
Source Bucket: For image uploads.
Destination Bucket: For processed images.
Set Up AWS Lambda:

Package the Lambda function with the required dependencies:
Upload the function to AWS Lambda and configure the environment variable DEST_BUCKET to your destination S3 bucket.
Configure API Gateway:

Set up API Gateway to trigger the Lambda function on HTTP requests (e.g., POST requests).
Configure S3 Triggers (Optional):

You can set up an S3 trigger that automatically invokes the Lambda function when a new image is uploaded to the source bucket.
Update Front-End:

Replace the apiUrl in the index.html file with your API Gateway URL.
Non-Cloud Setup (Local Run)
This setup allows users to upload images and perform processing tasks (resize, grayscale, blur) locally in the browser, without the need for cloud services.
