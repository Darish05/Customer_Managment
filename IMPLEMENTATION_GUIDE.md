# Customer Management System - Full Implementation Guide

## 🎯 Project Structure Overview

### Backend (Express.js + MongoDB)

Located at: `backend/`

**Files:**

- `server.js` - Complete Express server with all API routes
- `package.json` - Backend dependencies
- `.env` - Environment configuration

**Backend Endpoints Implemented:**

#### Authentication

- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/register` - Register new user

#### Customer Management

- `GET /api/customers/streets` - Get all streets with statistics
- `GET /api/customers/street/:streetName` - Get customers by street
- `GET /api/customers/all` - Get all customers
- `POST /api/customers` - Add new customer
- `PUT /api/customers/:id` - Update customer details
- `DELETE /api/customers/:id` - Delete customer
- `PATCH /api/customers/:id/mark-paid` - Mark customer payment as paid

#### Reports & Export

- `GET /api/reports/monthly` - Generate monthly report
- `GET /api/reports/history` - Get historical reports
- `GET /api/customers/export` - Export customers to Excel
- `POST /api/customers/import` - Import customers from Excel

#### System

- `GET /api/health` - Health check
- `POST /api/customers/reset-month` - Reset all customers to unpaid status

---

### Frontend (React)

Located at: `frontend/`

#### File Structure:

```
src/
├── App.js                    # Main app component with navigation
├── LoginPage.js              # Login page component
├── context/
│   └── AppContext.js         # Global state management & API calls
├── components/
│   ├── Dashboard.js          # Dashboard with statistics
│   ├── CustomerList.js       # View customers by street
│   ├── DataEntry.js          # Add, edit, delete customers
│   └── Reports.js            # Reports and export functionality
└── [other files]
```

#### Frontend Features Implemented:

##### 1. **Dashboard Component** (`Dashboard.js`)

- Display total statistics (customers, paid, unpaid, total amount)
- Street-wise overview with collection progress
- Click to view customers in each street
- Loading states with skeleton animations
- Responsive grid layout

##### 2. **Customer List Component** (`CustomerList.js`)

- View customers filtered by street
- Search by name or box ID
- Filter by status (all, paid, unpaid)
- Mark unpaid customers as paid
- Display payment status with visual indicators
- Show last payment date

##### 3. **Data Entry Component** (`DataEntry.js`)

- Add new customers with form validation
- Edit existing customer information
- Delete customers with confirmation
- Search across all customers
- Display all customers in the system
- Show customer count and details
- Success/error messaging

##### 4. **Reports Component** (`Reports.js`)

- Overall collection statistics
- Monthly report with detailed metrics
- Street-wise performance breakdown
- Collection rate visualization with progress bars
- Export data to Excel functionality
- Amount collected vs. pending amounts

##### 5. **App Context** (`context/AppContext.js`)

- Centralized state management
- API integration with backend
- Authentication handling
- Customer data CRUD operations
- Export functionality
- Token-based authorization

---

## 🚀 Running the Application

### Prerequisites

- Node.js v14+ installed
- MongoDB running locally or connection string in `.env`
- npm packages installed

### Backend Setup

```bash
cd backend
npm install
```

**Configure `.env` file:**

```env
MONGODB_URI=mongodb://localhost:27017/customer_management
JWT_SECRET=your-secret-key-change-in-production
PORT=5001
```

**Start Backend:**

```bash
npm start
# or for development with auto-reload
npm run dev
```

Backend will run on `http://localhost:5001`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend will run on `http://localhost:3000`

---

## 📝 API Details

### Authentication Flow

1. User submits credentials (username/password)
2. Backend validates against MongoDB users
3. Returns JWT token on success
4. Frontend stores token in localStorage
5. All subsequent requests include token in Authorization header

### Data Models

#### User Schema

```javascript
{
  username: String (unique),
  password: String (hashed),
  name: String,
  role: String (default: "admin"),
  createdAt: Date
}
```

#### Customer Schema

```javascript
{
  name: String,
  boxId: String (unique),
  streetName: String,
  rechargeAmount: Number (default: 500),
  status: String (enum: ["paid", "unpaid"]),
  lastPaymentDate: Date,
  paymentHistory: [
    {
      date: Date,
      amount: Number,
      month: String,
      year: Number
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

#### Report Schema

```javascript
{
  month: String,
  year: Number,
  totalCustomers: Number,
  paidCount: Number,
  unpaidCount: Number,
  totalAmount: Number,
  collectedAmount: Number,
  streetWiseData: Array,
  generatedAt: Date
}
```

---

## 🔐 Authentication

### Login Credentials (Demo)

```
Username: admin
Password: admin
```

### How Authentication Works

1. JWT tokens stored in localStorage
2. Tokens expire in 7 days
3. All API requests require valid token
4. Logout clears token and redirects to login

---

## 🎨 UI/UX Features

### Styling

- Custom CSS with gradients and shadows
- Responsive design (mobile-first)
- Animation classes for smooth transitions
- Color-coded status indicators
- Progress bars for collection tracking

### Key CSS Classes

- `.gradient-bg` - Main background gradient
- `.gradient-blue`, `.gradient-green`, `.gradient-red` - Action buttons
- `.shadow-card` - Card styling
- `.animate-slide`, `.animate-fade` - Animations
- `.hover-scale` - Hover effects
- `.btn` - Button styling

---

## 🔄 State Management Flow

```
AppContext (Global State)
├── user (logged-in user info)
├── streets (list of streets with stats)
├── customers (customers filtered by street)
├── allCustomers (all customers in system)
├── loading (loading state for API calls)
├── currentView (dashboard/customers/dataEntry/reports)
├── selectedStreet (currently selected street)
├── showMenu (mobile menu visibility)
└── Methods:
    ├── login()
    ├── logout()
    ├── loadStreets()
    ├── loadCustomers(streetName)
    ├── addCustomer()
    ├── updateCustomer()
    ├── deleteCustomer()
    ├── markCustomerPaid()
    └── exportToExcel()
```

---

## 🔧 API Base URL Configuration

**Frontend:** `http://localhost:5001/api`
**Can be changed in:** `frontend/src/context/AppContext.js` (line 8)

---

## 💾 Database Setup

### Seed Database (Optional)

```bash
cd backend
node seedDatabase.js
```

### Clear Database

```bash
cd backend
node clearDatabase.js
```

---

## ✅ Features Checklist

- ✅ User authentication with JWT
- ✅ Dashboard with statistics and charts
- ✅ Customer list management by street
- ✅ Add/Edit/Delete customers
- ✅ Mark payments as paid
- ✅ Export to Excel
- ✅ Import from Excel
- ✅ Monthly reports
- ✅ Street-wise statistics
- ✅ Search and filter
- ✅ Responsive mobile design
- ✅ Loading states
- ✅ Error handling
- ✅ Success notifications

---

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**

- Change `PORT` in `.env` file or backend/server.js

**MongoDB connection failed:**

- Ensure MongoDB is running
- Check connection string in `.env`
- Verify database name

### Frontend Issues

**API calls failing:**

- Ensure backend is running on correct port
- Check API_BASE URL in AppContext.js
- Verify JWT token is valid

**Components not rendering:**

- Clear browser cache and localStorage
- Check browser console for errors
- Ensure AppProvider wraps the app

---

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

---

## 🚀 Production Deployment

### Before Going Live

1. Change JWT_SECRET in .env to a strong random string
2. Configure MongoDB Atlas connection string
3. Set NODE_ENV=production
4. Configure CORS origins properly
5. Enable HTTPS
6. Set up proper error logging
7. Configure backup strategy

---

## 📞 Support & Maintenance

### Regular Maintenance

- Monitor database size
- Archive old reports monthly
- Review user activity logs
- Update dependencies regularly

### Common Tasks

- Export monthly reports: Dashboard → Reports → Export
- Add bulk customers: Data Entry → Use import feature
- Reset monthly: Backend endpoint `/api/customers/reset-month`
- View collection progress: Dashboard → Street cards

---

**Last Updated:** October 2025
**Version:** 1.0.0
