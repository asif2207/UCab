import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPayment } from '../services/paymentService';
import { getRideById } from '../services/bookingService';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './Payment.css';

const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash', icon: '💵', description: 'Pay driver directly' },
  { id: 'upi', label: 'UPI', icon: '📱', description: 'GPay, PhonePe, Paytm' },
  { id: 'card', label: 'Card', icon: '💳', description: 'Debit or Credit card' },
  { id: 'wallet', label: 'Wallet', icon: '👛', description: 'UCAB wallet balance' },
];

function Payment() {
  const [ride, setRide] = useState(null);
  const [method, setMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rideId = searchParams.get('rideId');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (!rideId) { navigate('/history'); return; }
    fetchRide();
  }, [user, rideId]);

  const fetchRide = async () => {
    try {
      const res = await getRideById(rideId);
      setRide(res.data);
      if (res.data.paymentStatus === 'paid') setPaid(true);
    } catch (err) {
      setError('Failed to load ride details');
    } finally {
      setFetching(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    try {
      await createPayment({ rideId, method });
      setPaid(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="payment-page">
        <Navbar />
        <div className="payment-content">
          <p className="payment-loading">Loading ride details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <Navbar />
      <div className="payment-content">

        {paid ? (
          <div className="payment-success">
            <div className="success-icon">✅</div>
            <h1>Payment Successful</h1>
            <p>Your ride has been completed and payment processed.</p>
            {ride && (
              <div className="success-summary">
                <div className="summary-row">
                  <span>Amount paid</span>
                  <span className="summary-value">₹{ride.fare}</span>
                </div>
                <div className="summary-row">
                  <span>Method</span>
                  <span className="summary-value">{ride.paymentMethod?.toUpperCase()}</span>
                </div>
                <div className="summary-row">
                  <span>From</span>
                  <span className="summary-value">{ride.pickupLocation}</span>
                </div>
                <div className="summary-row">
                  <span>To</span>
                  <span className="summary-value">{ride.dropLocation}</span>
                </div>
              </div>
            )}
            <button
              className="btn-primary payment-home-btn"
              onClick={() => navigate('/history')}
            >
              View all rides
            </button>
          </div>
        ) : (
          <>
            <h1>Complete Payment</h1>
            <p className="payment-subtext">Choose how you want to pay.</p>

            {error && <p className="payment-error">{error}</p>}

            {ride && (
              <div className="fare-summary">
                <div className="fare-summary-row">
                  <span>Ride</span>
                  <span>{ride.cabType?.charAt(0).toUpperCase() + ride.cabType?.slice(1)}</span>
                </div>
                <div className="fare-summary-row">
                  <span>Distance</span>
                  <span>{ride.distance} km</span>
                </div>
                <div className="fare-summary-row">
                  <span>From</span>
                  <span className="fare-location">{ride.pickupLocation}</span>
                </div>
                <div className="fare-summary-row">
                  <span>To</span>
                  <span className="fare-location">{ride.dropLocation}</span>
                </div>
                <div className="fare-summary-row fare-total">
                  <span>Total</span>
                  <span className="fare-amount">₹{ride.fare}</span>
                </div>
              </div>
            )}

            <h2>Payment method</h2>
            <div className="payment-methods">
              {PAYMENT_METHODS.map((m) => (
                <div
                  key={m.id}
                  className={`method-card ${method === m.id ? 'selected' : ''}`}
                  onClick={() => setMethod(m.id)}
                >
                  <span className="method-icon">{m.icon}</span>
                  <div className="method-info">
                    <p className="method-label">{m.label}</p>
                    <p className="method-desc">{m.description}</p>
                  </div>
                  <div className={`method-radio ${method === m.id ? 'checked' : ''}`}></div>
                </div>
              ))}
            </div>

            <button
              className="btn-primary pay-btn"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? 'Processing...' : `Pay ₹${ride?.fare || ''}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Payment;