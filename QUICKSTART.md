# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Backend Setup & Start

```bash
# Navigate to backend
cd backend

# Install dependencies (if not already done)
npm install

# Start the server
npm start
```

✅ Backend running on `http://localhost:5001`

Check the terminal - you should see:

```
🚀 Server running on port 5001
📊 API Base URL: http://localhost:5001/api
🗄️  MongoDB: Connected
```

### Step 2: Frontend Setup & Start

**In a new terminal window:**

```bash
# Navigate to frontend
cd frontend

# Install dependencies (if not already done)
npm install

# Start the development server
npm start
```

✅ Frontend running on `http://localhost:3000`

React should automatically open in your browser.

### Step 3: Login

The application automatically loads the login page.

**Use these demo credentials:**

```
Username: admin
Password: admin
```

Click **Login** and you're in! 🎉

---

## 📊 What You Can Do Now

### 1. Dashboard (Default View)

- See overall statistics
- View statistics by street
- Click on any street to see customers in that street

### 2. Customers (Customers Tab)

- View all customers in selected street
- Search customers by name or box ID
- Filter by payment status (All, Paid, Unpaid)
- Mark unpaid customers as paid

### 3. Data Entry (Data Entry Tab)

- Add new customers using the form
- Edit existing customer details
- Delete customers
- Search across all customers

### 4. Reports (Reports Tab)

- View monthly statistics
- See street-wise collection rates
- Export all customer data to Excel

---

## 🎯 Common Tasks

### View Customers by Street

1. Go to **Dashboard** tab
2. Click on any street card
3. You'll see all customers in that street

### Add a New Customer

1. Go to **Data Entry** tab
2. Click **Add New Customer** button
3. Fill in the form:
   - Customer Name
   - Box ID (unique identifier)
   - Street Name
   - Recharge Amount (default: 500)
   - Status (Paid/Unpaid)
4. Click **Save**

### Mark Payment as Paid

1. Go to **Customers** tab (select a street first)
2. Find the unpaid customer
3. Click **Mark Paid** button
4. Payment is instantly updated

### Export Data to Excel

1. Go to **Reports** tab
2. Click **Export Report to Excel**
3. File downloads automatically

### Search Customers

- Use search boxes in **Customers** or **Data Entry** tabs
- Search by: Name, Box ID, or Street Name

---

## 🔌 API Endpoints (For Developers)

### Common Endpoints:

**Login:**

```
POST http://localhost:5001/api/auth/login
```

**Get all streets:**

```
GET http://localhost:5001/api/customers/streets
Header: Authorization: Bearer <token>
```

**Get customers by street:**

```
GET http://localhost:5001/api/customers/street/Main%20Street
Header: Authorization: Bearer <token>
```

**Add customer:**

```
POST http://localhost:5001/api/customers
Header: Authorization: Bearer <token>
Body: {
  "name": "John",
  "boxId": "BOX001",
  "streetName": "Main Street",
  "rechargeAmount": 500
}
```

See `API_REFERENCE.md` for complete API documentation.

---

## 🛠️ Troubleshooting

### Backend won't start

**Error: "Port 5001 already in use"**

- Change port in `backend/.env` or `backend/server.js`
- Or kill the process using the port

**Error: "MongoDB connection failed"**

- Make sure MongoDB is running
- Or update `MONGODB_URI` in `backend/.env`

### Frontend showing blank page

**Solution:**

1. Check browser console (F12)
2. Clear browser cache (Ctrl+Shift+Del)
3. Check that backend is running
4. Restart frontend: `npm start`

### Can't login

**Error: "Invalid credentials"**

- Use: `admin` / `admin`
- Check backend is running
- Check network tab in DevTools

---

## 📁 Project Structure

```
customer-management-app/
├── backend/              # Express server
│   ├── server.js        # All routes & database
│   ├── package.json     # Dependencies
│   └── .env             # Config
│
├── frontend/            # React app
│   ├── src/
│   │   ├── App.js       # Main component
│   │   ├── LoginPage.js # Login
│   │   ├── context/
│   │   │   └── AppContext.js  # State & API
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── CustomerList.js
│   │   │   ├── DataEntry.js
│   │   │   └── Reports.js
│   │   └── index.js     # Entry point
│   └── package.json
│
├── IMPLEMENTATION_GUIDE.md
└── API_REFERENCE.md
```

---

## 📝 Demo Data

The system comes with demo data for testing:

- **Username:** admin
- **Password:** admin
- **Sample Streets:** Main Street, Oak Street, Park Street (auto-loaded)
- **Sample Customers:** Multiple customers in each street

To reset or clear data:

```bash
cd backend
node clearDatabase.js
```

To re-seed:

```bash
node seedDatabase.js
```

---

## 🔐 Security Notes

- JWT tokens expire in 7 days
- Passwords are hashed with bcryptjs
- All API requests require authentication
- Tokens stored in browser localStorage

**For Production:**

1. Change JWT_SECRET in `.env`
2. Use HTTPS
3. Enable CORS properly
4. Set NODE_ENV=production
5. Use environment-specific configs

---

## 📞 Getting Help

### Check the Logs

**Backend logs:**

```
Watch the terminal where you ran: npm start
```

**Frontend logs:**

```
Open browser DevTools: F12 → Console
```

### Common Issues:

| Issue            | Solution                                 |
| ---------------- | ---------------------------------------- |
| Page blank       | Refresh browser, clear cache             |
| Can't login      | Check backend running, check credentials |
| API errors       | Check terminal for backend errors        |
| Data not showing | Logout and login again                   |

---

## ✅ Next Steps

1. ✅ Backend is running
2. ✅ Frontend is running
3. ✅ You're logged in
4. ✅ Explore the features
5. ✅ Try adding customers
6. ✅ Export reports
7. ✅ Read `IMPLEMENTATION_GUIDE.md` for details

---

## 🎓 Learning Resources

- **React Basics:** Check `src/components/*.js`
- **API Integration:** See `src/context/AppContext.js`
- **Backend Routes:** See `backend/server.js`
- **Database Queries:** MongoDB queries in `server.js`

---

**Version:** 1.0.0  
**Last Updated:** October 2025

🎉 Enjoy! Start managing your customers now!
