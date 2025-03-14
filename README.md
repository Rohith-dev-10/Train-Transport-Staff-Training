# Transport Training Portal

![Transport Training Portal Banner](https://via.placeholder.com/800x200?text=Transport+Training+Portal)

A comprehensive e-learning platform for train transport staff, featuring interactive modules, quizzes, and a structured curriculum to enhance safety and operational knowledge.

## 🌟 Features

- **Interactive Learning Modules**: Step-by-step content with animations and visuals
- **Progress Tracking**: Visual dashboards for tracking completion status
- **Assessment System**: Quizzes and practical evaluations to test understanding
- **Admin Dashboard**: Manage users, modules, and track overall progress
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Dark Mode Support**: Enhanced readability with dark theme option
- **Certificate Generation**: Auto-generate certificates upon course completion
- **User Role Management**: Different access levels for drivers, supervisors, and admins

## 📋 Technology Stack

- **Frontend**: React.js with Next.js, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT and bcrypt
- **Deployment**: Vercel (frontend), Render/Railway (backend)

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance

### Frontend Setup

```bash
# Navigate to client directory
cd transport-training-portal/client

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to server directory
cd transport-training-portal/server

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📚 Modules Overview

1. **Pre-Checks Prior to Driving the Vehicle**
   - Systematic inspection procedures for vehicle safety

2. **Safety Precautions During Fueling**
   - Safe handling of fuels and emergency procedures

3. **Identifying & Fixing Basic Defects in Emergencies**
   - Troubleshooting and emergency repairs

4. **Training on Advanced Vehicles**
   - Specialized training for Eicher Bus, Mahindra Scorpio-N, Toyota Hybrid

5. **Road Safety Precautions & Traffic Rule Adherence**
   - Traffic regulations and defensive driving techniques

6. **Safe Driving Practices**
   - Advanced techniques for accident prevention

7. **First Aid & Lifesaving Training**
   - Emergency response and basic medical assistance

8. **Effects of Driving Under Alcohol Influence**
   - Awareness and prevention of impaired driving

9. **Procedure of Vehicle Parade**
   - Formation driving and coordination protocols

10. **Updating User Details in the Car Diary**
    - Documentation and record-keeping procedures

## 🔒 User Roles

- **Driver**: Access to learning modules and personal progress tracking
- **Supervisor**: Additional access to team progress reports and basic analytics
- **Admin**: Full access to user management, module creation/editing, and system settings

## 💡 Customization Options

The platform allows admins to:
- Customize module content and assessment questions
- Adjust passing scores for quizzes
- Configure module prerequisites
- Customize certificate templates
- Add new vehicle types to the training curriculum

## 📱 Mobile Support

The application is fully responsive with:
- Touch-friendly interface elements
- Offline content access capabilities
- Mobile-optimized video and quiz components
- Reduced data usage mode for limited connectivity

## 🛠️ Development

### Environment Variables

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
```

#### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Folder Structure

- `/client`: Frontend React application
- `/server`: Backend Express API
- `/docs`: Documentation files
- `/public`: Static assets

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Developed for ANC Transport Department
