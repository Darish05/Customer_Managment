# Complete API Reference

## Base URL

```
http://localhost:5001/api
```

## Authentication

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin"
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "name": "Darish",
    "username": "admin",
    "role": "admin"
  }
}
```

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User created successfully"
}
```

---

## Customers

### Get All Streets with Statistics

```http
GET /api/customers/streets
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "name": "Main Street",
    "totalCustomers": 25,
    "paidCount": 15,
    "unpaidCount": 10,
    "totalAmount": 12500
  },
  ...
]
```

### Get Customers by Street

```http
GET /api/customers/street/:streetName
Authorization: Bearer <token>
```

**Query Parameters:**

- `status` (optional): "paid" | "unpaid" | "all"

**Response:**

```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "Customer Name",
    "boxId": "BOX001",
    "streetName": "Main Street",
    "amount": 500,
    "status": "unpaid",
    "lastPayment": "Never"
  },
  ...
]
```

### Get All Customers

```http
GET /api/customers/all
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "Customer Name",
    "boxId": "BOX001",
    "streetName": "Main Street",
    "amount": 500,
    "status": "unpaid",
    "lastPayment": "2025-01-15"
  },
  ...
]
```

### Add New Customer

```http
POST /api/customers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "boxId": "BOX001",
  "streetName": "Main Street",
  "rechargeAmount": 500
}
```

**Response:**

```json
{
  "success": true,
  "message": "Customer added successfully",
  "customer": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "boxId": "BOX001"
  }
}
```

### Update Customer

```http
PUT /api/customers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "streetName": "Oak Street",
  "rechargeAmount": 600
}
```

**Response:**

```json
{
  "success": true,
  "message": "Customer updated successfully",
  "customer": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe Updated",
    ...
  }
}
```

### Delete Customer

```http
DELETE /api/customers/:id
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Customer deleted successfully"
}
```

### Mark Customer as Paid

```http
PATCH /api/customers/:id/mark-paid
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Payment marked successfully",
  "customer": {
    "id": "507f1f77bcf86cd799439011",
    "status": "paid",
    "lastPayment": "2025-01-20"
  }
}
```

---

## Reports

### Get Monthly Report

```http
GET /api/reports/monthly
Authorization: Bearer <token>
```

**Query Parameters:**

- `month` (optional): "January", "February", etc. (default: current month)
- `year` (optional): 2025, 2024, etc. (default: current year)

**Response:**

```json
{
  "month": "January",
  "year": 2025,
  "totalCustomers": 100,
  "paidCount": 60,
  "unpaidCount": 40,
  "totalAmount": 50000,
  "collectedAmount": 30000,
  "streetWiseData": [
    {
      "streetName": "Main Street",
      "totalCustomers": 25,
      "paidCount": 15,
      "unpaidCount": 10,
      "totalAmount": 12500
    },
    ...
  ],
  "generatedAt": "2025-01-20T10:30:00Z"
}
```

### Get Report History

```http
GET /api/reports/history
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "month": "January",
    "year": 2025,
    "totalCustomers": 100,
    ...
  },
  {
    "month": "December",
    "year": 2024,
    "totalCustomers": 98,
    ...
  },
  ...
]
```

---

## Import/Export

### Export to Excel

```http
GET /api/customers/export
Authorization: Bearer <token>
```

**Response:** Binary Excel file (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)

### Import from Excel

```http
POST /api/customers/import
Authorization: Bearer <token>
Content-Type: multipart/form-data

[File upload - .xlsx or .xls]
```

**Excel Format Expected:**

```
| Name      | Box ID | Street Name | Recharge Amount | Status  |
|-----------|--------|-------------|-----------------|---------|
| John Doe  | BOX001 | Main St     | 500            | unpaid  |
| Jane Doe  | BOX002 | Oak St      | 500            | paid    |
```

**Response:**

```json
{
  "success": true,
  "message": "Imported 2 customers",
  "imported": 2,
  "errors": []
}
```

---

## Maintenance

### Reset All Customers to Unpaid (New Month)

```http
POST /api/customers/reset-month
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "All customers reset to unpaid",
  "modifiedCount": 98
}
```

---

## Health Check

### Server Status

```http
GET /api/health
```

**Response:**

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-01-20T10:30:00Z",
  "database": "connected"
}
```

### API Info

```http
GET /
```

**Response:**

```json
{
  "success": true,
  "message": "Customer Management Backend API",
  "version": "1.0.0",
  "status": "running",
  "endpoints": {
    "auth": { ... },
    "customers": { ... },
    "reports": { ... }
  },
  "database": "connected"
}
```

---

## Error Responses

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Customer not found"
}
```

### 400 Bad Request

```json
{
  "success": false,
  "message": "Username and password are required"
}
```

### 500 Server Error

```json
{
  "success": false,
  "message": "Server error"
}
```

---

## Request Headers

All authenticated endpoints require:

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## Rate Limiting

Currently no rate limiting implemented. Implement if needed for production.

---

## Pagination

Currently no pagination implemented. All results are returned. Consider implementing for large datasets.

---

## Date Format

All dates are in ISO 8601 format: `YYYY-MM-DDTHH:mm:ssZ`

---

## Currency

All amounts are in INR (₹)
