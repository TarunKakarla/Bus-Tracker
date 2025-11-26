// static/student.js - Public Student View
let studentMap = null;
let busMarkers = {};
let pollInterval = null;
let isTracking = false;

// Initialize map
studentMap = L.map('map').setView([15.3173, 75.7139], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(studentMap);

const trackBtn = document.getElementById('track-bus');
const lastUpdate = document.getElementById('last-update');
const errorBox = document.getElementById('error-box');
const errorMessage = document.getElementById('error-message');
const trackingStatus = document.getElementById('tracking-status');
const activeBuses = document.getElementById('active-buses');
const busList = document.getElementById('bus-list');

async function fetchLocations() {
    try {
        const response = await fetch('/get_locations');
        
        if (!response.ok) {
            throw new Error('No buses available');
        }
        
        const locations = await response.json();
        const busIds = Object.keys(locations);
        
        // Update active buses count
        activeBuses.textContent = busIds.length;
        
        // Clear bus list
        busList.innerHTML = '';
        
        // Remove markers that no longer exist
        Object.keys(busMarkers).forEach(busId => {
            if (!locations[busId]) {
                studentMap.removeLayer(busMarkers[busId]);
                delete busMarkers[busId];
            }
        });
        
        // Update or create markers
        busIds.forEach(busId => {
            const bus = locations[busId];
            const lat = bus.lat;
            const lng = bus.lng;
            
            // Create or update marker
            if (!busMarkers[busId]) {
                const busIcon = L.divIcon({
                    className: 'bus-marker',
                    html: '<div style="background: #16a34a; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; text-align: center; line-height: 24px; font-size: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">🚌</div>',
                    iconSize: [30, 30]
                });
                busMarkers[busId] = L.marker([lat, lng], { icon: busIcon })
                    .bindPopup(`<b>Bus: ${busId}</b><br>Updated: ${bus.timestamp}`)
                    .addTo(studentMap);
            } else {
                busMarkers[busId].setLatLng([lat, lng]);
                busMarkers[busId].setPopupContent(`<b>Bus: ${busId}</b><br>Updated: ${bus.timestamp}`);
            }
            
            // Add to bus list
            const busCard = document.createElement('div');
            busCard.className = 'bus-card';
            busCard.innerHTML = `
                <h4>🚌 ${busId}</h4>
                <p>📍 ${lat.toFixed(5)}, ${lng.toFixed(5)}</p>
                <p>🕐 ${bus.timestamp}</p>
                <p>📶 ±${Math.round(bus.accuracy)}m</p>
            `;
            busCard.style.cursor = 'pointer';
            busCard.addEventListener('click', () => {
                studentMap.setView([lat, lng], 16);
                busMarkers[busId].openPopup();
            });
            busList.appendChild(busCard);
        });
        
        // Fit map to show all buses
        if (busIds.length > 0) {
            const bounds = L.latLngBounds(busIds.map(id => [locations[id].lat, locations[id].lng]));
            studentMap.fitBounds(bounds, { padding: [50, 50] });
        }
        
        lastUpdate.textContent = `Updated: ${new Date().toLocaleTimeString()}`;
        errorBox.style.display = 'none';
        
    } catch (error) {
        errorBox.style.display = 'block';
        errorMessage.textContent = 'No active buses found. Drivers need to start sharing.';
        activeBuses.textContent = '0';
        busList.innerHTML = '';
    }
}

trackBtn.addEventListener('click', () => {
    if (isTracking) {
        // Stop tracking
        clearInterval(pollInterval);
        pollInterval = null;
        isTracking = false;
        trackBtn.textContent = 'Start Tracking';
        trackBtn.style.background = '#4f46e5';
        trackingStatus.textContent = 'Not Tracking';
    } else {
        // Start tracking
        fetchLocations(); // Immediate fetch
        pollInterval = setInterval(fetchLocations, 3000);
        isTracking = true;
        trackBtn.textContent = 'Stop Tracking';
        trackBtn.style.background = '#ea580c';
        trackingStatus.textContent = 'Tracking';
    }
});