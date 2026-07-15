require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const driverRoutes = require('./routes/driverRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('UCAB API is running');
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('join_ride', (rideId) => socket.join(rideId));
  socket.on('driver_location', ({ rideId, lat, lng }) => {
    io.to(rideId).emit('location_update', { lat, lng });
  });
  socket.on('ride_status', ({ rideId, status }) => {
    io.to(rideId).emit('status_update', { status });
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));