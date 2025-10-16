# 🎯 Quick Reference: Time Configuration

## For Administrators

### Step-by-Step Configuration

#### 1. Access Settings
```
Login → Manage Facilities → Configure → Click ⏰ Clock Icon
```

#### 2. Configure Settings

| Setting | What It Does | Example |
|---------|--------------|---------|
| **Time Interval** | How often slots appear | 30 min → slots at 8:00, 8:30, 9:00... |
| **Default Duration** | Pre-filled when booking | 60 minutes |
| **Min Duration** | Shortest booking allowed | 30 minutes |
| **Max Duration** | Longest booking allowed | 180 minutes |
| **Operating Hours** | When facility is available | 07:00 - 22:00 |
| **Advance Booking** | How far ahead can book | 30 days |
| **Multiple Slots** | Allow consecutive bookings | Yes/No |

#### 3. Save & Test
- Click "Save Settings"
- Select the facility
- Click "Make Booking"
- Verify time slots match your configuration

---

## Quick Configurations

### Copy-Paste Settings

#### 🎾 Sports Courts (Tennis, Basketball)
```
Time Interval: 60 minutes
Default: 60 min | Min: 60 min | Max: 120 min
Hours: 06:00 - 21:00
Advance Booking: 14 days
Multiple Slots: Yes
```

#### 🍖 BBQ Areas
```
Time Interval: 30 minutes
Default: 180 min | Min: 120 min | Max: 300 min
Hours: 11:00 - 22:00
Advance Booking: 30 days
Multiple Slots: Yes
```

#### 🏋️ Gym Equipment
```
Time Interval: 15 minutes
Default: 30 min | Min: 15 min | Max: 60 min
Hours: 05:00 - 23:00
Advance Booking: 7 days
Multiple Slots: No (prevents hogging)
```

#### 🎉 Party/Event Rooms
```
Time Interval: 120 minutes (2 hours)
Default: 240 min | Min: 180 min | Max: 480 min
Hours: 09:00 - 23:00
Advance Booking: 60 days
Multiple Slots: Yes
```

#### 🏊 Swimming Pool
```
Time Interval: 60 minutes
Default: 60 min | Min: 60 min | Max: 120 min
Hours: 07:00 - 21:00
Advance Booking: 7 days
Multiple Slots: Yes
```

#### 🍽️ Dining Rooms
```
Time Interval: 30 minutes
Default: 120 min | Min: 60 min | Max: 180 min
Hours: 08:00 - 20:00
Advance Booking: 30 days
Multiple Slots: Yes
```

---

## Tips & Best Practices

### ✅ Do's
- Use shorter intervals (15-30 min) for high-demand equipment
- Set min duration equal to interval for better scheduling
- Allow multiple slots for facilities used for events
- Limit advance booking (7-14 days) for frequently used items
- Test bookings after changing settings

### ❌ Don'ts
- Don't make min > max duration
- Don't set start time after end time
- Don't make intervals too short (<15 min) unless necessary
- Don't allow multiple slots for gym equipment (causes hogging)
- Don't set advance booking too far (>60 days) unless needed

---

## Troubleshooting

### "Users can't book far enough ahead"
➡️ Increase **Advance Booking Days**

### "Time slots are too sparse"
➡️ Decrease **Time Interval** (e.g., 60min → 30min)

### "Bookings too short/long"
➡️ Adjust **Min/Max Duration**

### "Facility always booked out"
➡️ Consider:
- Disallow multiple slots
- Reduce max duration
- Reduce advance booking period

### "Settings not showing in booking form"
➡️ Check:
- Settings were saved (look for ⏱️ under facility name)
- Refresh the page
- Select the correct facility

---

## Understanding the Display

### In Configuration Modal
```
🎾 Tennis Court 1
⏱️ 60min intervals • 06:00-21:00
```
Means: Settings are configured

### In Booking Form
```
6:00-21:00 • 60 min slots • Book up to 14 days ahead
```
Shows users what's allowed

### In Bookings List
```
10:00 (1 hour)
```
Shows the booked time and duration

---

## Quick Actions

| Want to... | Do this... |
|-----------|-----------|
| Reset to defaults | Click "Reset to Defaults" in modal |
| Copy settings to another facility | Note down values, configure manually |
| Disable a facility | Toggle "Enabled" switch in Configure |
| Remove time settings | Click Reset, then Save |
| View current settings | Look for ⏱️ text under facility name |

---

## Contact Support

If you need help:
1. Check the documentation files in the project
2. Review error messages in toast notifications
3. Test with a different facility first
4. Check browser console for errors (F12)

---

## Version Info

**Feature:** Time Configuration System v1.0  
**Status:** Production Ready ✅  
**Last Updated:** 2025  
**Compatibility:** All facility types
