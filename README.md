# Financial-Analytics-Dashboard

# Financial Analytics Dashboard

A comprehensive full-stack financial application with dynamic data visualization, advanced filtering, and configurable CSV export functionality.

## Features

- **JWT Authentication**: Secure login/logout system
- **Interactive Dashboard**: Revenue vs expenses trends, category breakdowns, summary metrics
- **Advanced Filtering**: Multi-field filters (Date, Amount, Category, Status, User)
- **Real-time Search**: Search across all transaction fields
- **CSV Export**: Configurable column export with automatic download
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React.js with TypeScript
- Material-UI for UI components
- Chart.js for data visualization
- Axios for API communication
- React Router for navigation

### Backend
- Node.js with Express and TypeScript
- MongoDB with Mongoose
- JWT for authentication
- csv-writer for CSV generation
- bcryptjs for password hashing

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/financial_dashboard
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

## Sample Data

The application comes with sample transaction data. On first run, the backend will automatically seed the database with sample transactions.

### Sample User Credentials
```
Email: admin@example.com
Password: admin123
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Transactions
- `GET /api/transactions` - Get all transactions with filtering
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Analytics
- `GET /api/analytics/summary` - Get dashboard summary
- `GET /api/analytics/trends` - Get revenue/expense trends
- `GET /api/analytics/categories` - Get category breakdown

### Export
- `POST /api/export/csv` - Generate and download CSV

## Database Schema

### User Schema
```typescript
{
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
}
```

### Transaction Schema
```typescript
{
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  status: 'pending' | 'completed' | 'failed';
  date: Date;
  user: ObjectId;
  createdAt: Date;
}
```

## CSV Export Configuration

The CSV export feature allows users to:
- Select which columns to include
- Choose date range
- Filter by category or status
- Automatic download when ready

Available columns:
- Date
- Description
- Amount
- Category
- Type
- Status
- User

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm start  # Starts development server
```

### Building for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## Project Structure

```
financial-dashboard/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.