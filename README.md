# Hapi.js Starter

This project is a work in progress **Hapi.js** REST API 

## Features

- **User CRUD**: Create, Read, Update, and Delete users.
- **JWT Authentication**: Secure authentication using JSON Web Tokens.
- **Email Verification**: Sends verification emails to new users using Mailjet.
- **Mailjet Integration**: Integration with Mailjet for email services.
- **Unit Tests**: Written with Jest.
- **Postman Collection**: Postman collection included for testing API endpoints.
- **Trace ID Injection**: Adds a trace ID to each request for tracking purposes.
- **API Versioning**: Supports versioning for backward-compatible changes.
- **MongoDB Support**: Stores user data in a MongoDB database.
- **hCaptcha**: Adds hCaptcha verification for added security.

## Prerequisites

- Node.js >= 20.x
- MongoDB
- Mailjet Account
- hCaptcha Account

## Installation

1. Install dependencies:

   ```bash
   npm i
   ```

   bash
   Copy code
   npm install

2. Set up environment variables in a .env file:

   ```bash
   MONGODB_URI=123
   JWT_SECRET=123
   HCAPTCHA_SECRET=0x0000000000000000000000000000000000000000
   HCAPTCHA_SITE_KEY=10000000-ffff-ffff-ffff-000000000001
   HCAPTCHA_VERIFY_URL=https://hcaptcha.com/siteverify
   MAIL_JET_API_KEY=123
   MAIL_JET_API_SECRET=123
   ```

## Usage

Run the server:

```bash
npm start
```

Run unit tests:

```bash
npm run test:unit
```

## API Documentation

Postman Collection is available in the /docs folder.
