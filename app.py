# app.py
from flask import Flask, request, jsonify, render_template, session, redirect, url_for
import json
import os
import time
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-this-in-production'  # Change this!

LOCATIONS_FILE = 'locations.json'
DRIVERS_FILE = 'drivers.json'

# Initialize locations file
if os.path.exists(LOCATIONS_FILE):
    try:
        with open(LOCATIONS_FILE, 'r') as f:
            locations = json.load(f)
    except Exception:
        locations = {}
else:
    locations = {}
    with open(LOCATIONS_FILE, 'w') as f:
        json.dump(locations, f)

# Initialize drivers file (username: password)
# In production, use proper password hashing!
default_drivers = {
    "driver1": "pass123",
    "driver2": "pass456",
    "admin": "admin123"
}

if not os.path.exists(DRIVERS_FILE):
    with open(DRIVERS_FILE, 'w') as f:
        json.dump(default_drivers, f, indent=2)

def load_drivers():
    with open(DRIVERS_FILE, 'r') as f:
        return json.load(f)

def save_locations():
    with open(LOCATIONS_FILE, 'w') as f:
        json.dump(locations, f, indent=2)

# Routes
@app.route('/')
def index():
    """Public page - anyone can view bus location"""
    return render_template('index.html')

@app.route('/driver')
def driver_page():
    """Driver login/dashboard page"""
    if 'driver_username' in session:
        return render_template('driver.html', username=session['driver_username'])
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    """Driver login endpoint"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    drivers = load_drivers()
    
    if username in drivers and drivers[username] == password:
        session['driver_username'] = username
        return jsonify({"status": "success", "message": "Login successful"})
    
    return jsonify({"status": "error", "message": "Invalid credentials"}), 401

@app.route('/logout')
def logout():
    """Driver logout"""
    session.pop('driver_username', None)
    return redirect(url_for('driver_page'))

@app.route('/update_location', methods=['POST'])
def update_location():
    """
    Driver sends location (requires login)
    POST JSON { "lat": ..., "lng": ..., "accuracy": ... }
    """
    # Check if driver is logged in
    if 'driver_username' not in session:
        return jsonify({"error": "Not authenticated"}), 401
    
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "invalid json"}), 400
    
    lat = data.get('lat')
    lng = data.get('lng')
    accuracy = data.get('accuracy', 0)
    
    if lat is None or lng is None:
        return jsonify({"error": "lat and lng required"}), 400
    
    try:
        lat = float(lat)
        lng = float(lng)
        accuracy = float(accuracy)
    except ValueError:
        return jsonify({"error": "invalid lat/lng"}), 400
    
    driver_id = session['driver_username']
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    locations[driver_id] = {
        "lat": lat,
        "lng": lng,
        "accuracy": accuracy,
        "timestamp": timestamp,
        "driver": driver_id
    }
    
    save_locations()
    return jsonify({"status": "ok", "timestamp": timestamp})

@app.route('/get_locations', methods=['GET'])
def get_locations():
    """
    Public endpoint - returns all active bus locations
    No authentication required
    """
    if not locations:
        return jsonify({"error": "no locations yet"}), 404
    
    return jsonify(locations)

@app.route('/get_my_location', methods=['GET'])
def get_my_location():
    """
    Driver gets their own location
    Requires authentication
    """
    if 'driver_username' not in session:
        return jsonify({"error": "Not authenticated"}), 401
    
    driver_id = session['driver_username']
    if driver_id not in locations:
        return jsonify({"error": "no location yet"}), 404
    
    return jsonify(locations[driver_id])

if __name__ == '__main__':
    # For production, use a proper WSGI server like gunicorn
    app.run(debug=True, host='0.0.0.0', port=5000)