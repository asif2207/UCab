import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../services/bookingService';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import MapPicker from "../components/MapPicker";
import './Booking.css';

const CAB_TYPES = [
  {
    id: 'mini',
    label: 'Mini',
    description: 'Affordable, compact rides',
    base: '₹30',
    perKm: '₹10/km',
    icon: '🚗',
  },
  {
    id: 'sedan',
    label: 'Sedan',
    description: 'Comfortable everyday rides',
    base: '₹50',
    perKm: '₹15/km',
    icon: '🚕',
  },
  {
    id: 'suv',
    label: 'SUV',
    description: 'Spacious rides for groups',
    base: '₹80',
    perKm: '₹22/km',
    icon: '🚙',
  },
];

function Booking() {
  const [form, setForm] = useState({
    pickupLocation: '',
    dropLocation: '',
    cabType: 'sedan',
    distance: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCabSelect = (cabId) => {
    setForm({ ...form, cabType: cabId });
  };

  const handleLocationsSelected = ({ pickupLocation, dropLocation, distance }) => {
    setForm((prev) => ({
      ...prev,
      pickupLocation,
      dropLocation,
      distance,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!form.pickupLocation || !form.dropLocation) {
      setError('Please select pickup and drop locations on the map');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await createBooking(form);
      navigate('/history');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <Navbar />
      <div className="booking-content">
        <h1>Book a ride</h1>
        <p className="booking-subtext">Pick your locations on the map.</p>

        {error && <p className="booking-error">{error}</p>}

        <form onSubmit={handleSubmit} className="booking-form">

          <MapPicker onLocationsSelected={handleLocationsSelected} />

          <h2>Choose your ride</h2>
          <div className="cab-options">
            {CAB_TYPES.map((cab) => (
              <div
                key={cab.id}
                className={`cab-card ${form.cabType === cab.id ? 'selected' : ''}`}
                onClick={() => handleCabSelect(cab.id)}
              >
                <div className="cab-icon">{cab.icon}</div>
                <div className="cab-info">
                  <h3>{cab.label}</h3>
                  <p>{cab.description}</p>
                </div>
                <div className="cab-fare">
                  <span className="fare-base">{cab.base}</span>
                  <span className="fare-per-km">{cab.perKm}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="btn-primary booking-btn"
            disabled={loading}
          >
            {loading ? 'Booking...' : 'Confirm booking'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Booking;