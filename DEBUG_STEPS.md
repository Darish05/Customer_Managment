# Debug Steps

## ✅ FIXED: User ID Issue

**Problem**: The auth middleware wasn't extracting `userId` from the JWT token, causing all customer operations to fail.

**Solution**: Updated `authMiddleware` to set `req.userId = decoded.userId`

---

## What I Fixed

1. **Added automatic data loading**: The app now loads streets automatically when you refresh the page (if you're logged in)
2. **Added debug logging**: Both backend and frontend now log what's happening

## How to Debug

1. **Open your browser** and go to http://localhost:3000
2. **Open Developer Console**: Press F12 → Click "Console" tab
3. **Login** as "Dad" (or your username)
4. **Watch the console for these messages**:

   - `🔄 Token found, loading streets...` - Frontend found your login token
   - `📊 Streets loaded: [...]` - Frontend received data from backend

5. **Check the backend terminal** for these messages:
   - `🔍 GET /api/customers/streets - User ID: ...` - Backend received request
   - `📊 Streets found: X` - How many streets were found
   - `📦 Streets data: [...]` - The actual data being returned

## What to Look For

### If Dashboard shows zeros:

- Check console: Does `Streets loaded:` show an empty array `[]`?
- Check backend: Does `Streets found:` show `0`?
- **This means**: No customers with your userId exist in the database

### If you've added customers via Data Entry:

- Backend should log: `✅ Customer saved: { name, boxId, streetName, userId }`
- After saving, frontend should call `/api/customers/streets` again
- You should see the new data appear

## Quick Test

1. Go to **Data Entry** tab
2. Add a test customer:
   - Name: Test Customer
   - Box ID: TEST001
   - Street: Test Street
   - Recharge Amount: 500
3. Click "Add Customer"
4. **Watch backend terminal** - should show: `✅ Customer saved: ...`
5. **Watch browser console** - should show: `📊 Streets loaded: ...` with the new data
6. Go to **Dashboard** - should now show 1 customer

## If Still Not Working

Check if customers have userId:

```bash
cd backend
node checkDatabase.js
```

This will show:

- How many customers exist
- How many have userId vs how many don't
- If customers are missing userId, run the migration:

```bash
node migrateUserId.js
```
