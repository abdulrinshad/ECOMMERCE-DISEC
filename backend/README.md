# Avant-Garde E-Commerce API Documentation

A secure, production-ready RESTful authentication service for the Avant-Garde e-commerce platform.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**:
   Duplicate `.env.example` as `.env` and adjust the variables:
   ```bash
   cp .env.example .env
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

---

## API Endpoints

### 1. Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "fullName": "Alexander McQueen",
    "email": "alexander@mcqueen.com",
    "password": "Password1"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "648a12bc3c4d5e6f7a8b9c0d",
        "fullName": "Alexander McQueen",
        "email": "alexander@mcqueen.com",
        "role": "user",
        "memberLevel": "standard",
        "createdAt": "2026-06-15T12:00:00.000Z"
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request` (Validation fails)
  - `409 Conflict` (Email already registered)

---

### 2. Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "alexander@mcqueen.com",
    "password": "Password1"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Logged in successfully",
    "data": {
      "user": {
        "id": "648a12bc3c4d5e6f7a8b9c0d",
        "fullName": "Alexander McQueen",
        "email": "alexander@mcqueen.com",
        "role": "user",
        "memberLevel": "standard",
        "createdAt": "2026-06-15T12:00:00.000Z"
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized` (Invalid credentials)

---

### 3. Refresh Access Token
- **URL**: `/api/auth/refresh`
- **Method**: `POST`
- **Auth Required**: No (Uses HTTP-Only `refreshToken` cookie)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Token refreshed successfully",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized` (Refresh token missing or expired)
  - `403 Forbidden` (Token reuse or compromise detected)

---

### 4. Logout User
- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Auth Required**: No (Clears HTTP-Only `refreshToken` cookie and DB store)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

---

### 5. Get User Profile
- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Auth Required**: Yes (`Bearer <accessToken>` header)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Profile retrieved successfully",
    "data": {
      "id": "648a12bc3c4d5e6f7a8b9c0d",
      "fullName": "Alexander McQueen",
      "email": "alexander@mcqueen.com",
      "role": "user",
      "memberLevel": "standard",
      "shippingAddress": {
        "line1": "",
        "line2": "",
        "city": "",
        "postalCode": "",
        "country": ""
      },
      "createdAt": "2026-06-15T12:00:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized` (Invalid/missing access token)

---

### 6. Update User Profile
- **URL**: `/api/auth/me`
- **Method**: `PATCH`
- **Auth Required**: Yes (`Bearer <accessToken>` header)
- **Request Body** (All fields are optional):
  ```json
  {
    "fullName": "Alexander McQueen II",
    "shippingAddress": {
      "line1": "18 Savile Row",
      "city": "London",
      "postalCode": "W1S 3JR",
      "country": "GB"
    }
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "data": {
      "id": "648a12bc3c4d5e6f7a8b9c0d",
      "fullName": "Alexander McQueen II",
      "email": "alexander@mcqueen.com",
      "role": "user",
      "memberLevel": "standard",
      "shippingAddress": {
        "line1": "18 Savile Row",
        "line2": "",
        "city": "London",
        "postalCode": "W1S 3JR",
        "country": "GB"
      },
      "createdAt": "2026-06-15T12:00:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request` (Attempt to update restricted fields like role/email)
  - `401 Unauthorized` (Missing/expired token)

---

### 7. Change Password
- **URL**: `/api/auth/change-password`
- **Method**: `PATCH`
- **Auth Required**: Yes (`Bearer <accessToken>` header)
- **Request Body**:
  ```json
  {
    "currentPassword": "Password1",
    "newPassword": "NewSecurePassword2",
    "confirmPassword": "NewSecurePassword2"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Password changed. Please login again."
  }
  ```
- **Error Responses**:
  - `400 Bad Request` (Passwords mismatch or incorrect current password)
  - `401 Unauthorized` (Missing/expired token)
