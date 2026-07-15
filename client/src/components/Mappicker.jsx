import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapPicker.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
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

// ── Reverse geocoding helper ────────────────────────────────────────────────
// Converts lat/lng into a human-readable address using Nominatim.
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      { headers: { Accept: 'application/json' } }
    );
    const data = await res.json();
    if (data && data.display_name) {
      return data.display_name;
    }
  } catch (err) {
    console.error('Reverse geocode error:', err);
  }
  // fallback only if geocoding totally fails
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

function MapCenterTracker({ onCenterChange }) {
  useMapEvents({
    move: (e) => {
      const c = e.target.getCenter();
      onCenterChange({ lat: c.lat, lng: c.lng });
    },
  });
  return null;
}

function FlyTo({ location }) {
  const map = useMap();
  if (location) map.flyTo([location.lat, location.lng], 15);
  return null;
}

// ── Fullscreen map modal ──────────────────────────────────────────────────────
function MapModal({ mode, initialCenter, onConfirm, onClose }) {
  const [mapCenter, setMapCenter] = useState(
    initialCenter || { lat: 13.0827, lng: 80.2707 }
  );
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [flyTo, setFlyTo] = useState(null);

  // Live address for wherever the pin currently sits (drag-to-pin address)
  const [pinAddress, setPinAddress] = useState('Locating...');
  const [resolvingPin, setResolvingPin] = useState(false);
  const debounceRef = useRef(null);
  const searchDebounceRef = useRef(null);

  // Whenever the map center moves (drag, flyTo, initial load), resolve address
  useEffect(() => {
    setResolvingPin(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const address = await reverseGeocode(mapCenter.lat, mapCenter.lng);
      setPinAddress(address);
      setResolvingPin(false);
    }, 500);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapCenter.lat, mapCenter.lng]);

  const search = (q) => {
    setSearchInput(q);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (q.length < 3) {
      setSuggestions([]);
      return;
    }
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            q
          )}&format=json&addressdetails=1&limit=6`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error('Search error:', err);
        setSuggestions([]);
      }
    }, 350);
  };

  const selectSuggestion = (place) => {
    const loc = { lat: parseFloat(place.lat), lng: parseFloat(place.lon) };
    setSearchInput(place.display_name);
    setPinAddress(place.display_name);
    setMapCenter(loc);
    setFlyTo(loc);
    setSuggestions([]);
  };

  const useCurrentLocation = () => {
    navigator.geolocation?.getCurrentPosition(async (pos) => {
      const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setMapCenter(loc);
      setFlyTo(loc);
      setSearchInput('');
      const address = await reverseGeocode(loc.lat, loc.lng);
      setPinAddress(address);
      setSearchInput(address);
    });
  };

  // If the person typed/selected a specific address, prefer that.
  // Otherwise fall back to the live reverse-geocoded pin address (never raw numbers).
  const finalAddress = searchInput || pinAddress;

  return (
    <div className="map-modal-overlay">
      <div className="map-modal">

        {/* Header */}
        <div className="map-modal-header">
          <button className="map-back-btn" onClick={onClose}>←</button>
          <h3>{mode === 'pickup' ? 'Set Pickup Location' : 'Set Drop Location'}</h3>
        </div>

        {/* Search */}
        <div className="map-modal-search">
          <input
            type="text"
            placeholder={mode === 'pickup' ? 'Search pickup address...' : 'Search drop address...'}
            value={searchInput}
            onChange={(e) => search(e.target.value)}
            className="modal-search-input"
            autoFocus
          />
          {suggestions.length > 0 && (
            <ul className="modal-suggestions">
              {suggestions.map((s) => (
                <li key={s.place_id} onClick={() => selectSuggestion(s)}>
                  <span className="suggestion-icon">📍</span>
                  <span>{s.display_name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Current location button */}
        <button className="modal-location-btn" onClick={useCurrentLocation}>
          <span>⊙</span> Use my current location
        </button>

        {/* Map */}
        <div className="map-modal-map">
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={14}
            style={{ width: '100%', height: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapCenterTracker onCenterChange={setMapCenter} />
            {flyTo && <FlyTo location={flyTo} />}
          </MapContainer>

          {/* Fixed center pin */}
          <div className="modal-center-pin">
            <div className={`modal-pin-dot ${mode === 'pickup' ? 'green' : 'red'}`}></div>
            <div className={`modal-pin-line ${mode === 'pickup' ? 'green' : 'red'}`}></div>
          </div>
        </div>

        {/* Live resolved address of pin position */}
        <div className="pin-address-preview">
          <span className="pin-address-icon">📍</span>
          <span className="pin-address-text">
            {resolvingPin ? 'Locating address...' : finalAddress}
          </span>
        </div>

        {/* Confirm button */}
        <div className="map-modal-footer">
          <button
            className="modal-confirm-btn"
            disabled={resolvingPin}
            onClick={() =>
              onConfirm({
                loc: mapCenter,
                name: finalAddress,
              })
            }
          >
            Confirm {mode === 'pickup' ? 'Pickup' : 'Drop'} Location
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main MapPicker component ──────────────────────────────────────────────────
const RECENT_KEY = 'ucab_recent_locations';

function getRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
  } catch { return []; }
}

function saveRecent(name, loc) {
  const existing = getRecent().filter((r) => r.name !== name);
  const updated = [{ name, loc }, ...existing].slice(0, 5);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}

function MapPicker({ onLocationsSelected }) {
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [pickupName, setPickupName] = useState('');
  const [dropName, setDropName] = useState('');
  const [modal, setModal] = useState(null); // 'pickup' | 'drop' | null
  const [routeCoords, setRouteCoords] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [recent] = useState(getRecent());

  const handleConfirm = async ({ loc, name }, mode) => {
    saveRecent(name, loc);
    if (mode === 'pickup') {
      setPickup(loc);
      setPickupName(name);
      setModal(null);
      // auto open drop modal after pickup confirmed
      setTimeout(() => setModal('drop'), 300);
    } else {
      setDrop(loc);
      setDropName(name);
      setModal(null);
      await fetchRoute(pickup || loc, loc, pickupName, name);
    }
  };

  const fetchRoute = async (from, to, fromName, toName) => {
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`
      );
      const data = await res.json();
      if (data.routes?.length > 0) {
        const route = data.routes[0];
        const coords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        setRouteCoords(coords);
        const distKm = (route.distance / 1000).toFixed(1);
        const durMin = Math.round(route.duration / 60);
        setDistance(distKm);
        setDuration(`${durMin} min`);
        onLocationsSelected({
          pickupLocation: fromName,
          dropLocation: toName,
          distance: distKm,
        });
      }
    } catch (err) {
      console.error('Route error:', err);
    }
  };

  const reset = () => {
    setPickup(null);
    setDrop(null);
    setPickupName('');
    setDropName('');
    setRouteCoords([]);
    setDistance(null);
    setDuration(null);
  };

  return (
    <div className="map-picker-wrapper">

      {/* Location input card */}
      <div className="location-card">
        <div className="location-card-header">
          <h3>Your route</h3>
          {(pickup || drop) && (
            <button className="link-btn" onClick={reset}>Reset</button>
          )}
        </div>

        {/* Pickup row */}
        <div
          className="location-row"
          onClick={() => setModal('pickup')}
        >
          <div className="location-row-left">
            <span className="loc-dot green"></span>
            <div>
              <p className="loc-label">Pickup</p>
              <p className="loc-value" title={pickupName}>
                {pickupName || 'Select pickup location'}
              </p>
            </div>
          </div>
          <span className="loc-arrow">›</span>
        </div>

        <div className="loc-connector">
          <div className="loc-line"></div>
        </div>

        {/* Drop row */}
        <div
          className="location-row"
          onClick={() => setModal('drop')}
        >
          <div className="location-row-left">
            <span className="loc-dot red"></span>
            <div>
              <p className="loc-label">Drop</p>
              <p className="loc-value" title={dropName}>
                {dropName || 'Select drop location'}
              </p>
            </div>
          </div>
          <span className="loc-arrow">›</span>
        </div>

        {/* Route info */}
        {distance && (
          <div className="route-info-pill">
            <span>📍 {distance} km</span>
            <span className="dash">·</span>
            <span>⏱ {duration}</span>
          </div>
        )}
      </div>

      {/* Recent locations */}
      {recent.length > 0 && !pickup && (
        <div className="recent-locations">
          <p className="recent-title">Recent locations</p>
          {recent.map((r, i) => (
            <div
              key={i}
              className="recent-item"
              onClick={() => {
                setPickup(r.loc);
                setPickupName(r.name);
                setTimeout(() => setModal('drop'), 300);
              }}
            >
              <span className="recent-icon">🕐</span>
              <span className="recent-name">{r.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Mini map preview (shown after both locations selected) */}
      {pickup && drop && routeCoords.length > 0 && (
        <div className="mini-map-preview">
          <MapContainer
            center={[pickup.lat, pickup.lng]}
            zoom={12}
            style={{ width: '100%', height: '220px', borderRadius: '12px' }}
            zoomControl={false}
            dragging={false}
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon} />
            <Marker position={[drop.lat, drop.lng]} icon={dropIcon} />
            <Polyline positions={routeCoords} color="#FFC857" weight={4} />
          </MapContainer>
        </div>
      )}

      {/* Fullscreen map modal */}
      {modal && (
        <MapModal
          mode={modal}
          initialCenter={modal === 'drop' && pickup ? pickup : null}
          onConfirm={(result) => handleConfirm(result, modal)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

export default MapPicker;