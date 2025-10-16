# 🎯 QUICK START GUIDE

## 🚀 To Get Everything Working

### 1. Add Logo (Required)
Save the StrataTrac logo as:
```
C:\bcmtracdev\facman\public\logo.png
```

### 2. Start Development Server
```bash
cd C:\bcmtracdev\facman
npm run dev
```

### 3. Open Browser
```
http://localhost:3000
```

---

## 👥 Test Users

### 🔴 Super Admin (BCMTrac)
- **Role:** bcmtrac
- **Access:** Everything
- **Can:** Configure all settings, manage users, view all reports

### 🟠 Facility Admin (Mid User)
- **Role:** miduser  
- **Access:** Manage facilities & bookings
- **Can:** Change status, view reports, configure facilities

### 🟢 Standard User
- **Role:** standard
- **Access:** Own bookings only
- **Can:** Book, view, and cancel own bookings

---

## 🗺️ Page Navigation

### Main Dashboard (`/`)
- Facility selection sidebar
- Booking interface
- Bookings list
- Admin links (admin only)

### Admin Hub (`/admin`)
- 6 configuration cards
- Settings & Configuration
- Access control
- System management

### Reports (`/reports`)
- 4 tab interface
- Overview, Facilities, Status, Communications
- Date filtering
- Export options

---

## 🎨 Branding Colors

```
Cyan:   #00D9FF (Primary)
Navy:   #001F3F (Background)
Orange: #FF8C42 (Accent)
```

---

## ⚡ Key Features Quick Access

| Feature | Location | Access Level |
|---------|----------|--------------|
| Book Facility | Main page | All users |
| Cancel Booking | Booking details | Owner only |
| Change Status | Booking details → Status tab | Admin only |
| Configure Times | Admin → Facility Config | Admin only |
| Move In/Out | Sidebar → Move request | All users |
| View Reports | Reports page | Admin only |
| Audit Logs | Store (code access) | Admin only |

---

## 🔧 Common Tasks

### Make a Booking
1. Select facility from sidebar
2. Click "Make Booking"
3. Fill form
4. Submit

### Cancel Booking
1. Click booking card
2. Details modal opens
3. Click "Cancel Booking" (if eligible)
4. Confirm

### Configure Facility Times
1. Go to Admin page
2. Click "Facility Time Configuration"
3. Select facility
4. Adjust settings
5. Save

### View Reports
1. Go to Reports page
2. Select tab
3. Filter date range
4. View metrics

---

## 📱 Responsive Breakpoints

- **Desktop:** 1400px max-width container
- **Tablet:** Responsive grid
- **Mobile:** Stacked layout (auto-responsive)

---

## 🎊 You're Ready!

Just add the logo and you're 100% complete! 🚀
