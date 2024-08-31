# Google Drive Manager

## Overview
This project is a web application that manages files in Google Drive utilizing NestJS for the backend and ReactJS with Next.js for the frontend. The backend serves as an API provider with two main modules:
- Auth Module: Manages OAuth2 flow, primarily handling the authentication processes with third-party services.
- Google Drive Module: Provides functionalities for interacting with Google Drive, including listing, creating, deleting, and downloading files.

On the frontend, it uses contexts for providing access token aware axios instance and custom hooks for API integration to ensure separation of concerns.

## Development Setup
To set up the development environment, follow these steps:

1. Clone the repository
```
git clone https://github.com/techlead95/google-drive-manager.git
```

2. Navigate to the backend directory and install dependencies:
```
cd backend
npm install
```

3. Navigate to the frontend directory and install dependencies:
```
cd frontend
npm install
```

4. On backend directory, create a new `.env` file by copying `.env.example` file and provide `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` values.

## Running the Application
To run the application, follow these steps:

1. Start the backend server:
```
cd backend
npm run start
```

2. Start the frontend server:
```
cd frontend
npm run start
```

3. Visit [http://localhost:3000](http://localhost:3000) in the browser to use the application.

4. Visit [http://localhost:5000/api](http://localhost:5000/api) in the browser to check API documentation.

## Running the Test
```
cd backend
npm run test
```

## Assumptions and Design Decisions
1. Assumed that this application doesn't need to support folder navigation.
2. Decided to implement infinite scrolling to allow access to all available files.
