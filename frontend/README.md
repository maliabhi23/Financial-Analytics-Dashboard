# 📊 Financial Analytics Dashboard

A comprehensive full-stack financial dashboard application designed for analysts to visualize, manage, and export transaction data securely with JWT-based authentication and MongoDB integration.

## 🌟 Overview

This project provides a complete financial analytics solution with real-time data visualization, advanced filtering capabilities, and secure user authentication. Built with modern web technologies, it offers a responsive interface for managing financial transactions and generating insightful reports.

---

## 🚀 Project Structure

```
project-root/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express server entry point
│   │   ├── models/               # MongoDB models
│   │   ├── routes/               # API route handlers
│   │   ├── middleware/           # Authentication middleware
│   │   └── utils/                # Helper functions
│   ├── package.json
│   └── .env                      # Environment variables
│
├── frontend/
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── PrivateRoute.tsx  # Route protection component
│   │   │   ├── Dashboard/        # Dashboard components
│   │   │   ├── Charts/           # Chart components
│   │   │   └── Common/           # Reusable components
│   │   ├── context/
│   │   │   └── AuthContext.tsx   # Authentication context
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx     # User authentication
│   │   │   └── DashboardPage.tsx # Main analytics dashboard
│   │   ├── utils/                # Utility functions
│   │   ├── types/                # TypeScript type definitions
│   │   └── App.tsx               # Main application component
│   ├── package.json
│   └── .env                      # Frontend environment variables
│
├── docs/                         # Documentation
├── README.md
└── .gitignore
```

---

## 🎯 Features

### 🔐 Authentication & Security
- **JWT-based Authentication**: Secure login/logout functionality
- **Protected Routes**: Token verification for all API endpoints
- **Session Management**: Automatic token refresh and logout
- **Role-based Access**: User-specific data access control

### 📊 Analytics Dashboard
- **Interactive Charts**: Revenue vs expense trends using Recharts
- **Summary Metrics**: Real-time calculation of total revenue, expenses, and balance
- **Advanced Filtering**: Multi-parameter search and filter capabilities
- **Category Analysis**: Detailed breakdown by transaction categories
- **Responsive Design**: Mobile-friendly interface with Chakra UI

### 🔍 Data Management
- **Real-time Search**: Instant search across all transaction fields
- **Sorting & Pagination**: Efficient data navigation
- **Status Tracking**: Transaction status monitoring and updates
- **Data Validation**: Input validation and error handling

### 📁 Export Functionality
- **CSV Export**: Customizable column selection for exports
- **Filtered Exports**: Export data based on current filters
- **Auto-download**: Seamless file download experience
- **Batch Operations**: Bulk data operations support

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React.js + TypeScript | User interface and type safety |
| **UI Framework** | Chakra UI | Component library and styling |
| **Charts** | Recharts | Data visualization |
| **State Management** | React Context | Authentication and global state |
| **Backend** | Node.js + Express | Server-side logic and API |
| **Authentication** | JWT (jsonwebtoken) | Secure user authentication |
| **Database** | MongoDB Atlas | Cloud-based data storage |
| **Export** | json2csv | CSV file generation |
| **HTTP Client** | Axios | API communication |

---

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14.0 or higher)
- **npm** or **yarn** package manager
- **MongoDB Atlas** account (or local MongoDB instance)
- **Git** for version control

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/maliabhi23/financial-analytics-dashboard.git
cd financial-analytics-dashboard
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
# Database Configuration
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/transcationdatabaset

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_APP_NAME=Financial Analytics Dashboard
```

### 4. Database Setup

Ensure your MongoDB Atlas cluster is configured with the database name `transcationdatabaset` and has the necessary collections set up.

---

## 🏃‍♂️ Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

### Start Frontend Application

```bash
cd frontend
npm start
```

The frontend application will start on `http://localhost:3000`

---

## 📚 API Documentation

### 🔐 Authentication Endpoints

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "maliabhi123@gmail.com",
  "password": "maliabhi123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "maliabhi123@gmail.com",
    "name": "User Name"
  }
}
```

#### Logout
```http
POST /api/logout
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### 💰 Transaction Endpoints

#### Get All Transactions
```http
GET /api/transactions
Authorization: Bearer <token>

Query Parameters (optional):
- page: number (default: 1)
- limit: number (default: 10)
- search: string
- user: string
- category: string
- status: string
- dateFrom: string (YYYY-MM-DD)
- dateTo: string (YYYY-MM-DD)
- amountFrom: number
- amountTo: number
- sortBy: string (default: date)
- sortOrder: string (asc|desc, default: desc)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [...],
    "totalCount": 150,
    "currentPage": 1,
    "totalPages": 15,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Get Single Transaction
```http
GET /api/transactions/:id
Authorization: Bearer <token>
```

#### Update Transaction
```http
PUT /api/transactions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Pending",
  "category": "Operations",
  "amount": 1500
}
```

#### Delete Transaction
```http
DELETE /api/transactions/:id
Authorization: Bearer <token>
```

### 📊 Analytics Endpoints

#### Get Dashboard Analytics
```http
GET /api/dashboard/analytics
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 45000,
    "totalExpenses": 32000,
    "balance": 13000,
    "monthlyTrends": [...],
    "categoryBreakdown": [...],
    "recentTransactions": [...]
  }
}
```

#### Get Filter Options
```http
GET /api/filters
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": ["Revenue", "Expenses", "Operations"],
    "statuses": ["Success", "Pending", "Failed"],
    "users": ["analyst1", "analyst2"],
    "dateRange": {
      "min": "2024-01-01",
      "max": "2024-12-31"
    }
  }
}
```

### 📁 Export Endpoints

#### Export to CSV
```http
POST /api/export/csv
Authorization: Bearer <token>
Content-Type: application/json

{
  "columns": ["id", "user", "amount", "category", "status", "date"],
  "filters": {
    "category": "Revenue",
    "status": "Success",
    "dateFrom": "2024-01-01",
    "dateTo": "2024-12-31"
  }
}
```

---

## 📊 Sample Data Structure

```json
{
  "id": "txn_1234567890",
  "user": "analyst1",
  "amount": 2500.00,
  "category": "Revenue",
  "status": "Success",
  "date": "2024-06-01T10:30:00.000Z",
  "description": "Client payment for services",
  "reference": "REF-2024-001",
  "createdAt": "2024-06-01T10:30:00.000Z",
  "updatedAt": "2024-06-01T10:30:00.000Z"
}
```

---

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Test Coverage

```bash
# Generate coverage report
npm run test:coverage
```

---

## 🔧 Environment Variables

### Backend (.env)
```env
# Required
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key

# Optional
PORT=5000
NODE_ENV=development
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
# Required
REACT_APP_API_BASE_URL=http://localhost:5000

# Optional
REACT_APP_APP_NAME=Financial Analytics Dashboard
REACT_APP_VERSION=1.0.0
```

---

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)

1. Set environment variables in your hosting platform
2. Deploy using Git integration or CLI
3. Ensure MongoDB Atlas is accessible from your hosting provider

### Frontend Deployment (Vercel/Netlify)

1. Update `REACT_APP_API_BASE_URL` to your production backend URL
2. Build the application: `npm run build`
3. Deploy the `build` folder to your hosting platform

---

## 📚 Additional Resources

### 🔗 Links
- **Postman Collection**: [API Testing Collection](https://www.postman.co/workspace/My-Workspace~c6421b6e-467a-4ed3-8ab5-4f5819782739/collection/36462089-66f337aa-6190-4f13-ad6b-a0c2a3ff82bf?action=share&creator=36462089)
- **Demo Video**: [Application Walkthrough](https://www.loom.com/share/0a95eefe54b04daab6566f20b9519550?sid=ccc357c3-791f-4aab-90fc-26a50a66c8eb)
- **Live Demo**: [https://financial-dashboard-demo.vercel.app](#)

### 📖 Documentation
- [API Reference](./docs/api-reference.md)
- [Component Documentation](./docs/components.md)
- [Deployment Guide](./docs/deployment.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```bash
Error: MongoServerError: Authentication failed
```
Solution: Check your MongoDB URI and credentials in the `.env` file.

**2. JWT Token Expired**
```bash
Error: JsonWebTokenError: jwt expired
```
Solution: Clear localStorage and login again, or implement token refresh logic.

**3. CORS Issues**
```bash
Error: Access to fetch blocked by CORS policy
```
Solution: Ensure `FRONTEND_URL` is correctly set in backend `.env` file.

**4. Port Already in Use**
```bash
Error: listen EADDRINUSE :::5000
```
Solution: Kill the process using the port or change the PORT in `.env` file.

---

## 📊 Performance Optimization

- **Frontend**: Code splitting, lazy loading, and memoization
- **Backend**: Database indexing, query optimization, and caching
- **Charts**: Data pagination and virtual scrolling for large datasets
- **Export**: Streaming for large CSV exports

---

## 🔒 Security Considerations

- JWT tokens are stored securely in httpOnly cookies (recommended) or localStorage
- Input validation and sanitization on all endpoints
- Rate limiting implemented for API endpoints
- HTTPS enforcement in production
- Environment variables for sensitive data

---

## ✅ Project Checklist

- [x] JWT-authenticated login system
- [x] Interactive financial dashboard with charts
- [x] Advanced filtering and search functionality
- [x] CSV export with customizable columns
- [x] MongoDB integration with proper indexing
- [x] Responsive design for mobile devices
- [x] Comprehensive API documentation
- [x] Postman collection for API testing
- [x] Demo video and live deployment
- [x] Error handling and validation
- [x] TypeScript implementation
- [x] Production-ready deployment configuration

---

## 👨‍💻 Author

**Abhishek Mali**
- 📧 Email: [abhishekmali9503@gmail.com](mailto:abhishekmali9503@gmail.com)
- 🌐 GitHub: [maliabhi23](https://github.com/maliabhi23)
- 💼 LinkedIn: [Abhishek Mali](https://www.linkedin.com/in/abhishek-mali-4222612b6/)
- 🌍 Portfolio: [abhishekmali.dev](https://maliabhishekportfolio.netlify.app/)

---

## 🙏 Acknowledgments

- Thanks to the React and Node.js communities for excellent documentation
- MongoDB Atlas for reliable cloud database hosting
- Chakra UI team for the beautiful component library
- Recharts for powerful data visualization capabilities

---

*Last updated: June 2025*