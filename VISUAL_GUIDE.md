# 🎨 Visual Guide: Time Configuration Feature

## 📍 Where to Find It

```
Main Page (as admin)
    ↓
[📋 Manage Facilities] Button
    ↓
Click to expand
    ↓
[Configure] Button
    ↓
Configure Facilities Modal Opens
    ↓
Expand any category
    ↓
Find a facility → Click [⏰ Clock icon]
    ↓
Time Settings Modal Opens! 🎉
```

---

## 🖼️ UI Elements

### Configure Facilities Modal
```
┌─────────────────────────────────────────────────┐
│  ⚙️ Configure Facilities                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  🏃 Sports                          [▼]         │
│  ├─────────────────────────────────────────┐   │
│  │  🎾 Tennis Court 1               ┌─────┐│   │
│  │  ⏱️ 60min intervals • 06:00-21:00 │ ⏰  ││   │
│  │                                  │ ✏️  ││   │
│  │  Enabled [ON]                    │ 🗑️  ││   │
│  └─────────────────────────────────└─────┘┘   │
│                                                 │
│  💪 Gym Equipment                   [▼]         │
│  ├─────────────────────────────────────────┐   │
│  │  🏃 Treadmill 1                   ┌─────┐│   │
│  │  Enabled [ON]                     │ ⏰  ││   │ ← Click here!
│  │                                   │ ✏️  ││   │
│  │                                   │ 🗑️  ││   │
│  └─────────────────────────────────└─────┘┘   │
└─────────────────────────────────────────────────┘
```

### Time Settings Modal
```
┌──────────────────────────────────────────────────────────┐
│  Configure Time Settings - Tennis Court 1                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Time Interval (minutes)                                 │
│  ┌────────────────────────────────┐                      │
│  │ 30 minutes              [▼]    │                      │
│  └────────────────────────────────┘                      │
│  Time slots will be available in these intervals         │
│                                                          │
│  Default Booking Duration (minutes)                      │
│  ┌────────────────────────────────┐                      │
│  │ 60                             │                      │
│  └────────────────────────────────┘                      │
│  Pre-filled duration when creating a new booking         │
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │ Min Duration     │  │ Max Duration     │             │
│  │ ┌──────────────┐ │  │ ┌──────────────┐ │             │
│  │ │ 30           │ │  │ │ 240          │ │             │
│  │ └──────────────┘ │  │ └──────────────┘ │             │
│  └──────────────────┘  └──────────────────┘             │
│                                                          │
│  Operating Hours                                         │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │ Opening Time     │  │ Closing Time     │             │
│  │ ┌──────────────┐ │  │ ┌──────────────┐ │             │
│  │ │ 07:00        │ │  │ │ 22:00        │ │             │
│  │ └──────────────┘ │  │ └──────────────┘ │             │
│  └──────────────────┘  └──────────────────┘             │
│                                                          │
│  Advance Booking Period (days)                           │
│  ┌────────────────────────────────┐                      │
│  │ 30                             │                      │
│  └────────────────────────────────┘                      │
│  How far in advance residents can book this facility     │
│                                                          │
│  ┌──────────────────────────────────────────────┐       │
│  │ Allow Multiple Consecutive Slots    [ON] 🔘 │       │
│  │ Enable residents to book multiple time slots │       │
│  └──────────────────────────────────────────────┘       │
│                                                          │
│  ╔════════════════════════════════════════════╗         │
│  ║ Configuration Summary                      ║         │
│  ║ • Time slots every 30 minutes              ║         │
│  ║ • Bookings from 30 to 240 minutes          ║         │
│  ║ • Open 07:00 - 22:00                       ║         │
│  ║ • Can book up to 30 days ahead             ║         │
│  ║ • Multiple slots: Allowed                  ║         │
│  ╚════════════════════════════════════════════╝         │
│                                                          │
│  [Reset to Defaults]     [Cancel]  [Save Settings]      │
└──────────────────────────────────────────────────────────┘
```

---

## 🎯 Button Icons Explained

| Icon | Name | Action |
|------|------|--------|
| ⏰ | Clock | Opens Time Settings Modal |
| ✏️ | Pencil | Edit facility name/icon |
| 🗑️ | Trash | Delete facility |
| ▼ | Chevron Down | Expand category |
| ▲ | Chevron Up | Collapse category |

---

## 🎨 Color Coding

### Category Headers
- **Default Categories**: Gray background (`bg-muted`)
- **Custom Categories**: Orange gradient (`from-orange-500 to-orange-600`)

### Facility States
- **Enabled**: Normal text weight
- **Disabled**: Gray, strikethrough text

### Time Settings Preview
When configured, shows below facility name:
```
🎾 Tennis Court 1
⏱️ 60min intervals • 06:00-21:00
```

---

## 🔄 User Flow

### Configuring a New Facility

1. **Start**
   ```
   Click "📋 Manage Facilities"
   ↓
   Click "Configure"
   ```

2. **Navigate to Facility**
   ```
   Expand category (click header)
   ↓
   Find your facility
   ↓
   Click ⏰ Clock icon
   ```

3. **Configure Settings**
   ```
   Set time interval (dropdown)
   ↓
   Enter durations (min, default, max)
   ↓
   Set operating hours (time pickers)
   ↓
   Set advance booking days
   ↓
   Toggle multiple slots (if needed)
   ```

4. **Review & Save**
   ```
   Check configuration summary
   ↓
   Click "Save Settings"
   ↓
   Success! ✅
   ```

5. **Verify**
   ```
   Settings now show under facility name:
   "⏱️ 30min intervals • 07:00-22:00"
   ```

---

## 📊 Configuration Matrix

### Common Scenarios

| Facility Type | Interval | Default | Min | Max | Hours | Multiple |
|--------------|----------|---------|-----|-----|-------|----------|
| Tennis Court | 60 min | 60 min | 60 | 120 | 06:00-21:00 | ✅ Yes |
| BBQ Area | 30 min | 180 min | 120 | 300 | 11:00-22:00 | ✅ Yes |
| Gym Equipment | 15 min | 30 min | 15 | 60 | 05:00-23:00 | ❌ No |
| Party Room | 120 min | 240 min | 180 | 480 | 09:00-23:00 | ✅ Yes |
| Meeting Room | 30 min | 60 min | 30 | 120 | 08:00-20:00 | ✅ Yes |
| Pool | 60 min | 60 min | 60 | 120 | 07:00-21:00 | ✅ Yes |

---

## ⚡ Quick Tips

### Time Intervals
- **15 min**: Best for high-demand equipment (treadmills, bikes)
- **30 min**: Flexible for most facilities
- **60 min**: Standard for sports/activities
- **120 min**: Event spaces and large gatherings

### Duration Rules
```
Min Duration ≤ Default Duration ≤ Max Duration
        ↓             ↓              ↓
       30    ≤       60      ≤     180     ✅ Valid

Min Duration > Max Duration  ❌ Invalid
```

### Operating Hours
```
Opening Time < Closing Time
     ↓              ↓
   07:00    <    22:00       ✅ Valid

Opening Time ≥ Closing Time  ❌ Invalid
```

---

## 🎭 States & Feedback

### Success States
```
✅ "Time settings saved successfully"
✅ Settings appear under facility name
✅ Green toast notification
```

### Error States
```
❌ "Minimum duration cannot be greater than maximum duration"
❌ "Opening time must be before closing time"
❌ Red toast notification
```

### Info States
```
ℹ️  "Settings reset to defaults"
ℹ️  Blue toast notification
```

---

## 🔍 Validation Examples

### ✅ Valid Configurations
```javascript
{
  timeIntervalMinutes: 30,
  defaultDurationMinutes: 60,  // 30 ≤ 60 ≤ 180 ✅
  minDurationMinutes: 30,
  maxDurationMinutes: 180,
  operatingHours: {
    start: '07:00',            // 07:00 < 22:00 ✅
    end: '22:00'
  }
}
```

### ❌ Invalid Configurations
```javascript
{
  defaultDurationMinutes: 90,
  minDurationMinutes: 120,     // 90 < 120 ❌ (default < min)
  maxDurationMinutes: 180
}

{
  operatingHours: {
    start: '22:00',            // 22:00 > 07:00 ❌
    end: '07:00'
  }
}
```

---

## 🎨 Styling Classes Used

### Modal Components
- `Dialog` - shadcn/ui dialog wrapper
- `DialogContent` - Main modal container
- `DialogHeader` - Header section
- `DialogTitle` - Title text

### Form Elements
- `Input` - Text/number inputs
- `Select` - Dropdown selectors
- `Switch` - Toggle buttons
- `Label` - Form labels
- `Button` - Action buttons

### Layout
- `space-y-6` - Vertical spacing
- `grid grid-cols-2` - Two-column layout
- `rounded-lg` - Rounded corners
- `border border-border` - Borders

---

## 📱 Responsive Design

The modal is fully responsive:
- **Desktop**: Full-width form elements
- **Tablet**: Slightly compressed, still usable
- **Mobile**: Scrollable modal with touch-friendly controls

Max width: `max-w-2xl`  
Max height: `max-h-[90vh]` (90% viewport height)  
Overflow: `overflow-y-auto` (scrollable)

---

## 🚀 Performance Notes

- **State Updates**: Immediate via Zustand
- **Validation**: Client-side, instant feedback
- **No API Calls**: All local state (for now)
- **Re-renders**: Optimized with React hooks

---

Ready to configure your facilities! 🎉
