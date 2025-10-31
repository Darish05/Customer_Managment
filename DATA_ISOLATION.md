# Data Isolation System

## ✅ Complete User Data Isolation Implemented

Each user has **completely separate** customer data. Users cannot see or access each other's customers.

---

## How It Works

### 1. **User ID in Every Customer**

Every customer record has a `userId` field that links it to the user who created it:

```javascript
{
  userId: ObjectId("..."),  // Links to the user
  name: "John Doe",
  boxId: "001",
  streetName: "Main Street",
  rechargeAmount: 500,
  status: "unpaid"
}
```

### 2. **Authentication Middleware**

When you login, the server creates a JWT token containing your userId:

```javascript
const token = jwt.sign(
  { userId: user._id, username: user.username },
  JWT_SECRET,
  { expiresIn: "7d" }
);
```

Every API request includes this token, and the middleware extracts your userId:

```javascript
req.userId = decoded.userId;
```

### 3. **Filtered API Endpoints**

All customer operations automatically filter by your userId:

**Get Streets:**

```javascript
Customer.aggregate([
  { $match: { userId: req.userId } }, // Only YOUR customers
  // ... aggregation logic
]);
```

**Get Customers:**

```javascript
Customer.find({
  userId: req.userId,
  streetName: streetName,
});
```

**Add Customer:**

```javascript
new Customer({
  userId: req.userId, // Automatically set to YOUR ID
  name,
  boxId,
  streetName,
});
```

**Update Customer:**

```javascript
Customer.findOneAndUpdate(
  { _id: id, userId: req.userId }, // Only YOUR customer
  { ...updates }
);
```

**Delete Customer:**

```javascript
Customer.findOneAndDelete({
  _id: id,
  userId: req.userId, // Only YOUR customer
});
```

---

## Box ID Uniqueness

Box IDs only need to be unique **per user**, not globally:

```javascript
// Check for duplicate within YOUR account only
const existingCustomer = await Customer.findOne({
  userId: req.userId,
  boxId: boxId,
});
```

This means:

- **User A** can have Box ID "001"
- **User B** can also have Box ID "001"
- They are completely separate customers

---

## Street Names

Streets are also isolated per user:

```javascript
// Get YOUR streets only
const streets = await Customer.aggregate([
  { $match: { userId: req.userId } },
  { $group: { _id: "$streetName", ... } }
])
```

This means:

- **User A** has "Main Street" with 10 customers
- **User B** has "Main Street" with 5 customers
- They are completely separate

---

## Database Indexes

The database has indexes for efficient querying:

```javascript
customerSchema.index({ userId: 1, streetName: 1, status: 1 });
customerSchema.index({ userId: 1, boxId: 1 });
```

These ensure:

- Fast queries for your data
- Efficient duplicate box ID checks
- Quick street statistics

---

## Security

✅ **Token-based authentication** - Your userId comes from a verified JWT token
✅ **Server-side filtering** - All queries filter by userId on the backend
✅ **No way to access other users' data** - Even if someone tries to modify requests
✅ **Password hashing** - Passwords stored with bcrypt

---

## Example Scenario

### User: "Dad" (userId: 67234abc...)

- Main Street: 5 customers
- Park Avenue: 3 customers
- Total: 8 customers

### User: "Mom" (userId: 89765def...)

- Main Street: 2 customers
- Oak Road: 4 customers
- Total: 6 customers

**They never see each other's data!**

---

## Migration for Old Data

If you have customers created before this system was implemented (without userId), run:

```bash
cd backend
node migrateUserId.js
```

This will assign all existing customers to the admin user.

---

## Testing Data Isolation

1. **Login as User 1** and add some customers
2. **Logout**
3. **Login as User 2** and add different customers
4. **Check**: Each user only sees their own customers
5. **Box IDs**: Both can use the same Box ID without conflict
