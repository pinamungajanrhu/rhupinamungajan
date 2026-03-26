# RHU Pinamungahan Health System

A comprehensive full-stack web application for municipal health management, designed for the Pinamungahan Primary Care Facility.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Initialize the database:**
   ```bash
   cd backend
   npm run db:init
   ```

3. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This will start both the backend (port 5000) and frontend (port 3001) servers.

4. **Open your browser and navigate to:**
   ```
   http://localhost:3001
   ```

## 📋 Features

### 🔐 Role-Based Authentication
- **Barangay Encoder**: Register new patients
- **RHU Staff**: Validate PhilHealth, conduct health assessments
- **Doctor**: Provide consultations, generate YAKAP IDs

### 👥 Patient Management
- Multi-step patient registration with progress indicators
- Comprehensive patient profiles with tabbed interface
- Real-time search and filtering
- Status tracking through workflow stages

### 📊 Dashboard & Analytics
- Animated statistics cards
- Interactive charts (health conditions, illness types, barangay distribution)
- PhilHealth coverage tracking
- Recent activity timeline

### 🏥 Health Assessment (PCHRAT)
- Dynamic, collapsible form sections
- Comprehensive health risk assessment
- Type of exposure tracking
- Social and lifestyle history
- Laboratory and imaging requests

### 👨‍⚕️ Doctor Consultation
- Clinical findings and diagnosis
- Health condition classification
- Prescription management
- Follow-up scheduling

### 🆔 YAKAP ID System
- Automatic ID generation after consultation
- Privacy-safe QR codes (name, barangay, YAKAP ID only)
- Digital patient identification

### 🎨 User Experience
- Smooth animations with Framer Motion
- Mobile-responsive design
- Modern, minimal UI
- Fast and intuitive navigation

## 🧪 Test Accounts

Use these accounts to test the system:

| Role | Username | Password |
|------|----------|----------|
| Barangay Encoder | `barangay01` | `password123` |
| RHU Staff | `rhu01` | `password123` |
| Doctor | `doctor01` | `password123``

## 📊 Sample Data

The system includes sample data for testing:
- 5 sample patients with different statuses
- 2 sample consultations
- 2 sample health assessments
- Multiple barangays (Poblacion, Tubod, Bulwang)

To add sample data manually:
```bash
cd backend
npm run db:sample
```

## 📱 Workflow

### 1. Barangay Encoder
- Register new patients with personal and contact information
- System automatically sets status to "Pending RHU Validation"

### 2. RHU Staff
- Review pending patients
- Verify PhilHealth information
- Complete comprehensive Health Risk Assessment (PCHRAT)
- Status updates to "Ready for Doctor Consultation"

### 3. Doctor
- Conduct patient consultations
- Record diagnosis and findings
- Prescribe treatment
- System generates YAKAP ID with QR code
- Status updates to "Completed"

## 🏗️ Technology Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Chart.js** for data visualization
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **SQLite** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **QRCode** library for QR generation

### Database Schema
- `users` - Authentication and roles
- `residents` - Patient information
- `assessments` - PCHRAT data
- `consultations` - Doctor consultations
- `yakap_ids` - Generated YAKAP IDs

## 🔧 Development

### Project Structure
```
├── backend/
│   ├── routes/          # API endpoints
│   ├── middleware/      # Authentication middleware
│   ├── scripts/         # Database initialization
│   └── database/        # SQLite database file
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   └── App.jsx      # Main app component
└── README.md
```

### Available Scripts

```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev

# Start backend only
npm run dev:backend

# Start frontend only
npm run dev:frontend

# Build for production
npm run build

# Initialize database
cd backend && npm run db:init
```

## 🔒 Security Features

- Role-based access control
- JWT token authentication
- Password hashing with bcryptjs
- Privacy-safe QR codes (no medical data)
- Input validation and sanitization

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop computers
- Tablets (ideal for field use)
- Mobile devices

## 🎯 Key Features Highlight

### Animations & UX
- Smooth page transitions
- Loading animations
- Hover effects and micro-interactions
- Toast notifications for user feedback

### Data Visualization
- Real-time dashboard statistics
- Interactive charts for health metrics
- Barangay distribution analysis
- PhilHealth coverage tracking

### Workflow Automation
- Automatic status updates
- YAKAP ID generation
- QR code creation
- Timeline tracking

## 🚀 Production Deployment

For production deployment:

1. **Environment Variables:**
   - Set `NODE_ENV=production`
   - Update `JWT_SECRET` with a secure key
   - Configure database path as needed

2. **Build Frontend:**
   ```bash
   npm run build
   ```

3. **Start Production Server:**
   ```bash
   npm start
   ```

## 📞 Support

For issues or questions regarding the RHU Pinamungahan Health System, please contact the development team.

---

**Developed with ❤️ for the Pinamungahan Primary Care Facility**
