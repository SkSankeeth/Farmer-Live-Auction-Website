# 🌾 OnlyFarmers - Full-Stack Agricultural Platform

A comprehensive platform connecting farmers, buyers, and agricultural professionals with secure authentication, user management, and modern web technologies.

## ✨ Features

### 🔐 Authentication System
- **Multi-User Types**: Farmers, Buyers, Farmer's Admin, Super Admin
- **Secure Login/Registration**: Separate pages for each user type
- **JWT Token Management**: Secure session handling with 24-hour expiration
- **Password Security**: bcrypt hashing with 12 salt rounds
- **Firebase Integration**: Scalable user data storage

### 🌾 Farmer Dashboard
- **Auction Management**: Create, view, and manage agricultural auctions
- **Product Catalog**: Upload product images and detailed descriptions
- **Real-time Status**: Track auction status (active, paused, ended)
- **Category System**: Organize products by type (grains, vegetables, fruits, etc.)
- **Image Upload**: Support for product photos with preview functionality

### 🎨 User Interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: System preference detection with manual toggle
- **Modern UI Components**: Beautiful forms, cards, and navigation
- **Accessibility**: ARIA labels and keyboard navigation support

### 🚀 Technology Stack (MERN)
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas (Cloud)
- **ODM**: Mongoose
- **Authentication**: JWT + bcrypt
- **Styling**: Tailwind CSS with custom color schemes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account (✅ Already configured)

### MongoDB Setup
1. **Environment Setup**: Copy `backend/env.sample` to `backend/.env`
2. **MongoDB Connection**: Your Atlas connection string is already configured
3. **Test Connection**: Start the backend server and verify MongoDB connection
4. **Documentation**: See `MONGODB_SETUP_GUIDE.md` for detailed setup instructions

### 1. Clone and Install
```bash
git clone <repository-url>
cd onlyfarmers
npm run install:all
```

### 2. Environment Configuration (Backend)
Create `.env` file in the backend directory:

### 3. Environment Configuration
Create `.env` file in the backend directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

MONGODB_URI=your-mongodb-atlas-uri
```

### 4. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend    # Frontend on http://localhost:5173
npm run dev:backend     # Backend on http://localhost:5000
```

## 📁 Project Structure

```
onlyfarmers/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts (Theme, Auth)
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── package.json
├── backend/                  # Node.js backend API
│   ├── config/              # Configuration files
│   ├── middleware/          # Express middleware
│   ├── routes/              # API route handlers
│   ├── index.js             # Main server file
│   └── package.json
└── package.json             # Root package.json
```

## 🔐 Authentication Endpoints

### Registration
- `POST /api/auth/farmer/register` - Farmer registration
- `POST /api/auth/buyer/register` - Buyer registration  
- `POST /api/auth/farmer-admin/register` - Farmer Admin registration
- `POST /api/auth/super-admin/register` - Super Admin registration (protected)

### Authentication
- `POST /api/auth/login` - Universal login for all user types
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)

### User Types & Roles
- **Farmer**: `role: 'farmer'`, `userType: 'farmer'`
- **Buyer**: `role: 'buyer'`, `userType: 'buyer'`
- **Farmer's Admin**: `role: 'admin'`, `userType: 'farmer-admin'`
- **Super Admin**: `role: 'super-admin'`, `userType: 'super-admin'`

## 🌾 Auction Management Endpoints

### Auction Operations
- `POST /api/auctions` - Create new auction (farmer only, with image upload)
- `GET /api/auctions/farmer` - Get farmer's auctions (protected)
- `GET /api/auctions/active` - Get all active auctions (public)
- `GET /api/auctions/:id` - Get auction by ID (public)
- `PUT /api/auctions/:id/status` - Update auction status (farmer/admin)
- `DELETE /api/auctions/:id` - Delete auction (farmer only)

### File Management
- `GET /api/auctions/uploads/auctions/:filename` - Serve auction images

## 🎨 Frontend Routes

### Public Routes
- `/` - Home page with login cards
- `/farmer-login` - Farmer login
- `/buyer-login` - Buyer login
- `/farmer-admin-login` - Farmer Admin login
- `/super-admin-login` - Super Admin login
- `/farmer-register` - Farmer registration
- `/buyer-register` - Buyer registration
- `/farmer-admin-register` - Farmer Admin registration
- `/super-admin-register` - Super Admin registration

### Protected Routes (with Layout)
- `/auctions` - Auctions page
- `/farmers` - Farmers directory
- `/buyers` - Buyers portal
- `/admin` - Admin dashboard
- `/contact` - Contact page
- `/super-admin` - Super Admin portal

### Dashboard Routes (Protected)
- `/farmer-dashboard` - Farmer dashboard with auction management

## 🛠️ Development

### Available Scripts
```bash
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only
npm run build            # Build frontend for production
npm run install:all      # Install dependencies for all packages
```

### Backend Development
- Uses nodemon for auto-restart on file changes
- CORS enabled for frontend communication
- Comprehensive error handling and validation
- JWT middleware for route protection

### Frontend Development
- Hot Module Replacement (HMR) with Vite
- Tailwind CSS with custom color schemes
- Responsive design with mobile-first approach
- Context-based state management

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: Secure session management
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests
- **Environment Variables**: Sensitive data stored in .env files

## 🚀 Deployment

### Frontend
```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting service
```

### Backend
```bash
cd backend
npm start
# Use PM2 or similar for production process management
```

### Environment Variables
Ensure all environment variables are properly set in production:
- Strong JWT secret
- Production MongoDB Atlas URL
- Proper CORS origins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code examples
- Open an issue on GitHub

---

**Built with ❤️ for the agricultural community**
