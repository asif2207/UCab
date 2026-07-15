import React, { useEffect, useState, useContext, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getRideById } from '../services/bookingService';
import { connectSocket, disconnectSocket } from '../services/socketService';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './LiveTracking.css';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const driverIcon = new L.DivIcon({
  html: `<div class="driver-marker">🚕</div>`,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const dropIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function FlyToDriver({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 15, { animate: true, duration: 1 });
    }
  }, [position]);
  return null;
}

const STATUS_LABELS = {
  pending: 'Finding your driver...',
  accepted: 'Driver is on the way',
  ongoing: 'You are on the ride',
  completed: 'Ride completed',
  cancelled: 'Ride cancelled',
};

const STATUS_COLORS = {
  pending: '#FFC857',
  accepted: '#2DD4BF',
  ongoing: '#60a5fa',
  completed: '#22c55e',
  cancelled: '#ef4444',
};

function LiveTracking() {
  const [ride, setRide] = useState(null);
  const [driverPos, setDriverPos] = useState(null);
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [eta, setEta] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rideId = searchParams.get('rideId');
  const simulationRef = useRef(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (!rideId) { navigate('/history'); return; }
    fetchRide();
    setupSocket();
    return () => {
      disconnectSocket();
      if (simulationRef.current) clearInterval(simulationRef.current);
    };
  }, []);

  const fetchRide = async () => {
    try {
      const res = await getRideById(rideId);
      setRide(res.data);
      setStatus(res.data.status);
    } catch (err) {
      console.error('Failed to load ride');
    } finally {
      setLoading(false);
    }
  };

  const setupSocket = () => {
    const socket = connectSocket();
    socket.emit('join_ride', rideId);

    socket.on('location_update', ({ lat, lng }) => {
      setDriverPos({ lat, lng });
    });

    socket.on('status_update', ({ status }) => {
      setStatus(status);
    });

    // Simulate driver movement for demo
    simulateDriver();
  };

  // Simulates a driver moving — replace with real driver app later
  const simulateDriver = () => {
    let step = 0;
    const path = [
      { lat: 13.0900, lng: 80.2750 },
      { lat: 13.0880, lng: 80.2740 },
      { lat: 13.0860, lng: 80.2730 },
      { lat: 13.0840, lng: 80.2720 },
      { lat: 13.0827, lng: 80.2707 },
    ];

    simulationRef.current = setInterval(() => {
      if (step < path.length) {
        setDriverPos(path[step]);
        setEta(`${(path.length - step) * 1} min`);
        step++;
      } else {
        clearInterval(simulationRef.current);
        setStatus('accepted');
        setEta('Arriving now');
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="tracking-page">
        <Navbar />
        <div className="tracking-loading">Loading ride...</div>
      </div>
    );
  }

  return (
    <div className="tracking-page">
      <Navbar />

      <div className="tracking-content">
        {/* Status bar */}
        <div
          className="tracking-status-bar"
          style={{ borderColor: STATUS_COLORS[status] }}
        >
          <div className="status-left">
            <span
              className="status-dot"
              style={{ background: STATUS_COLORS[status] }}
            ></span>
            <div>
              <p className="status-label">{STATUS_LABELS[status]}</p>
              {eta && <p className="status-eta">ETA: {eta}</p>}
            </div>
          </div>
          <span className="status-cab">🚕</span>
        </div>

        {/* Map */}
        <div className="tracking-map">
          <MapContainer
            center={[13.0827, 80.2707]}
            zoom={14}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {driverPos && (
              <>
                <Marker position={[driverPos.lat, driverPos.lng]} icon={driverIcon}>
                  <Popup>Driver is here</Popup>
                </Marker>
                <FlyToDriver position={driverPos} />
              </>
            )}

            {ride?.pickupLocation && (
              <Marker position={[13.0827, 80.2707]} icon={pickupIcon}>
                <Popup>Pickup: {ride.pickupLocation}</Popup>
              </Marker>
            )}

            {ride?.dropLocation && (
              <Marker position={[13.0800, 80.2680]} icon={dropIcon}>
                <Popup>Drop: {ride.dropLocation}</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Ride details card */}
        {ride && (
          <div className="tracking-details">
            <div className="tracking-route">
              <div className="tracking-route-row">
                <span className="tr-dot green"></span>
                <p>{ride.pickupLocation}</p>
              </div>
              <div className="tr-line"></div>
              <div className="tracking-route-row">
                <span className="tr-dot red"></span>
                <p>{ride.dropLocation}</p>
              </div>
            </div>

            <div className="tracking-meta">
              <div className="tracking-meta-item">
                <p className="meta-label">Cab</p>
                <p className="meta-val">
                  {ride.cabType?.charAt(0).toUpperCase() + ride.cabType?.slice(1)}
                </p>
              </div>
              <div className="tracking-meta-item">
                <p className="meta-label">Fare</p>
                <p className="meta-val">₹{ride.fare}</p>
              </div>
              <div className="tracking-meta-item">
                <p className="meta-label">Distance</p>
                <p className="meta-val">{ride.distance} km</p>
              </div>
              <div className="tracking-meta-item">
                <p className="meta-label">Payment</p>
                <p className="meta-val">{ride.paymentStatus}</p>
              </div>
            </div>

            {ride.paymentStatus !== 'paid' && status !== 'cancelled' && (
              <button
                className="btn-primary tracking-pay-btn"
                onClick={() => navigate(`/payment?rideId=${ride._id}`)}
              >
                Pay ₹{ride.fare}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LiveTracking;