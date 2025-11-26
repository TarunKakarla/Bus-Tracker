# College Bus Tracker - Flask Version

A real-time bus tracking system with driver authentication. Only logged-in drivers can share their location, while anyone can view all active buses on the map.

## 📁 Project Structure

```
bus-tracker/
├── app.py
├── locations.json (auto-generated)
├── drivers.json (auto-generated)
├── templates/
│   ├── index.html      (Public student view)
│   ├── login.html      (Driver login)
│   └── driver.html     (Driver dashboard)
└── static/
    ├── style.css
    ├── student.js
    ├── driver.js
    └── login.js
```

## 🚀 Installation & Setup

### Step 1: Create the Project Structure

```bash
mkdir bus-tracker
cd bus-tracker

mkdir templates
mkdir static
```

### Step 2: Create All Files

Create these files with the content from the artifacts above:

1. **app.py** - Main Flask application
2. **templates/index.html** - Public student view
3. **templates/login.html** - Driver login page
4. **templates/driver.html** - Driver dashboard
5. **static/style.css** - CSS styles
6. **static/student.js** - Student page JavaScript
7. **static/driver.js** - Driver page JavaScript
8. **static/login.js** - Login page JavaScript

### Step 3: Install Flask

```bash
pip install flask
```

### Step 4: Run the Application

```bash
python app.py
```

The server will start on `http://localhost:5000`

## 🔐 Demo Login Credentials

The system comes with these default driver accounts:

- **Username:** `driver1` | **Password:** `pass123`
- **Username:** `driver2` | **Password:** `pass456`
- **Username:** `admin` | **Password:** `admin123`

You can modify these in `drivers.json` after first run, or edit the `default_drivers` in `app.py`.

## 📱 How to Use

### For Students (Public Access - No Login Required):

1. Open `http://localhost:5000/` in your browser
2. Click **"Start Tracking"**
3. See all active buses on the map in real-time
4. Click on bus cards to center the map on that bus
5. No authentication needed!

### For Drivers (Login Required):

1. Open `http://localhost:5000/driver`
2. Login with your credentials
3. Click **"Start Sharing Location"**
4. Allow location permissions when prompted
5. Keep the page open while driving
6. Your location updates automatically every few seconds
7. Click **"Stop Sharing"** when done
8. Logout when finished

## 🌟 Features

### Public Student View:
- ✅ View all active buses on interactive map
- ✅ No login required
- ✅ Real-time updates every 3 seconds
- ✅ Click bus cards to focus on specific bus
- ✅ Shows bus count, last update time
- ✅ Responsive design for mobile

### Driver Dashboard:
- ✅ Secure login required
- ✅ GPS location sharing
- ✅ Real-time position updates
- ✅ Visual feedback on own location
- ✅ Update counter and accuracy display
- ✅ Start/Stop controls
- ✅ Logout functionality

### Security:
- ✅ Session-based authentication
- ✅ Only authenticated drivers can share location
- ✅ Public can only view, not modify
- ✅ Driver locations persist in `locations.json`

## 🛠️ Configuration

### Change Secret Key (Important for Production!)

In `app.py`, change this line:

```python
app.secret_key = 'your-secret-key-change-this-in-production'
```

Generate a secure random key:

```python
import secrets
print(secrets.token_hex(16))
```

### Add New Drivers

After first run, edit `drivers.json`:

```json
{
  "driver1": "pass123",
  "driver2": "pass456",
  "newdriver": "newpassword"
}
```

### Change Default Location

In the JavaScript files, change the default map center:

```javascript
// Change [15.3173, 75.7139] to your location
map = L.map('map').setView([YOUR_LAT, YOUR_LNG], 13);
```

## 🔧 Troubleshooting

### GPS Not Working:
- Use HTTPS in production (HTTP only works on localhost)
- Ensure location permissions are granted
- Try a different browser

### Blank Page:
- Check browser console (F12) for errors
- Ensure all files are in correct folders
- Check Flask terminal for error messages

### Login Not Working:
- Clear browser cookies
- Check `drivers.json` file exists
- Verify credentials match exactly

### Map Not Loading:
- Check internet connection (Leaflet CDN needed)
- Check browser console for 404 errors
- Ensure static files path is correct

## 📦 Deployment

### For Production:

1. **Use a proper WSGI server:**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

2. **Enable HTTPS** (required for GPS):
   - Use Let's Encrypt with Nginx/Apache
   - Or deploy to Heroku/Railway/Render

3. **Use a real database:**
   - Replace JSON files with PostgreSQL/MySQL
   - Use SQLAlchemy for database operations

4. **Hash passwords properly:**
   - Use bcrypt or werkzeug.security
   - Never store plain text passwords!

5. **Set environment variables:**
   ```bash
   export SECRET_KEY='your-random-secret-key'
   export FLASK_ENV='production'
   ```

## 📝 TODO / Future Improvements

- [ ] Password hashing (bcrypt)
- [ ] Database instead of JSON files
- [ ] Multiple bus routes/lines
- [ ] ETA calculations
- [ ] Push notifications
- [ ] Driver registration system
- [ ] Admin panel
- [ ] Historical location data
- [ ] Offline mode support

## 📄 License

Free to use for educational purposes.

## 🤝 Support

For issues or questions, check:
1. Browser console (F12)
2. Flask terminal output
3. File permissions
4. Network connectivity

---

**Made with ❤️ for college students**
