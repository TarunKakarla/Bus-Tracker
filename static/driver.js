// static/driver.js - Driver Dashboard
let watchId = null;
let updatesCount = 0;
let driverMap = null;
let driverMarker = null;

// Initialize map
driverMap = L.map('driver-map').setView([15.3173, 75.7139], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(driverMap);

const startBtn = document.getElementById('start-sharing');
const stopBtn = document.getElementById('stop-sharing');
const driverStatus = document.getElementById('driver-status');
const lastSent = document.getElementById('last-sent');
const sharingStatus = document.getElementById('sharing-status');
const updatesCountEl = document.getElementById('updates-count');
const accuracyDisplay = document.getElementById('accuracy-display');

async function sendLocation(lat, lng, accuracy) {
    try {
        const response = await fetch('/update_location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ lat, lng, accuracy })
        });
        
        if (response.ok) {
            const data = await response.json();
            updatesCount++;
            driverStatus.textContent = `Sharing: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            lastSent.textContent = `Last sent: ${new Date().toLocaleTimeString()}`;
            updatesCountEl.textContent = updatesCount;
            accuracyDisplay.textContent = `±${Math.round(accuracy)}m`;
            
            // Update map
            if (!driverMarker) {
                const driverIcon = L.divIcon({
                    className: 'driver-marker',
                    html: '<div style="background: #16a34a; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; text-align: center; line-height: 24px; font-size: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">🚌</div>',
                    iconSize: [30, 30]
                });
                driverMarker = L.marker([lat, lng], { icon: driverIcon }).addTo(driverMap);
                driverMap.setView([lat, lng], 15);
            } else {
                driverMarker.setLatLng([lat, lng]);
            }
        } else {
            driverStatus.textContent = 'Error sending location';
        }
    } catch (error) {
        driverStatus.textContent = 'Connection error';
        console.error(error);
    }
}

startBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('Geolocation not supported on this device');
        return;
    }
    
    watchId = navigator.geolocation.watchPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = position.coords.accuracy;
            sendLocation(lat, lng, accuracy);
        },
        (error) => {
            driverStatus.textContent = `Error: ${error.message}`;
        },
        {
            enableHighAccuracy: true,
            maximumAge: 2000,
            timeout: 5000
        }
    );
    
    startBtn.disabled = true;
    stopBtn.disabled = false;
    sharingStatus.textContent = 'Active';
    driverStatus.textContent = 'Starting location sharing...';
});

stopBtn.addEventListener('click', () => {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
    startBtn.disabled = false;
    stopBtn.disabled = true;
    sharingStatus.textContent = 'Inactive';
    driverStatus.textContent = 'Stopped sharing';
    lastSent.textContent = '';
});