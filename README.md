--- UCab - Online Cab Booking System

--- Project Overview

UCab is a full-stack web application that enables users to book cabs online quickly and securely. The system provides a simple interface for customers to book rides, view booking details, make payments, and manage their accounts. Drivers can accept bookings, while administrators can manage users, drivers, and bookings.

---

--Features

-- User
- User Registration and Login
- Search and Book a Cab
- View Booking History
- Online Payment
- Cancel Booking
- Update Profile

-- Driver
- Driver Registration and Login
- Accept or Reject Ride Requests
- View Assigned Trips
- Update Driver Profile

-- Admin
- Manage Users
- Manage Drivers
- Manage Bookings
- View Dashboard
- Monitor Payments

---

-- Project Architecture --

This project follows the **MVC (Model-View-Controller)** architecture.

```
server/
│
├── config/
├── controllers/
├── models/
├── routes/
├── middleware/
├── server.js
└── package.json

client/
│
├── src/
├── public/
└── package.json
```

---

-- Technologies Used --

### Frontend
- React.js
- React Router
- Bootstrap / CSS
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JWT (JSON Web Token)

### Version Control
- Git
- GitHub

---

-- Folder Structure  -- 

```
UCab/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── docs/
├── screenshots/
├── README.md
└── .gitignore
```

---

-- Installation --

### Clone the Repository

```bash
git clone https://github.com/asif2207/UCab.git
```

### Backend Setup

```bash
cd server
npm install
npm start
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

-- Environment Variables --

Create a `.env` file inside the **server** folder.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

-- Screenshots

Add screenshots inside the `screenshots` folder.

Example:

- Home Page
- Login Page
- User Dashboard
- Driver Dashboard
- Booking Page
- Payment Page
- Admin Dashboard

---

-- Future Enhancements --

- Live Driver Tracking
- OTP Verification
- Email Notifications
- Mobile Application
- Ratings and Reviews
- AI-based Ride Suggestions

---

-- Team Members --

- Asif Shaik
- Rehaman shaik
---

-- References

- React Documentation
- Express Documentation
- MongoDB Documentation
- Node.js Documentation

---

-- License --

This project is developed for educational purposes as part of an academic project.
