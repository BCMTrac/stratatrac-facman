# 🧪 TEST PATH: Time Configuration & Move In/Out Settings

## Complete Testing Guide for All New Features

---

## 🎯 Part 1: Facility Time Configuration

### Test Path A: Configure Tennis Court Time Settings

#### Step 1: Access Configuration
```
1. Start app: npm run dev
2. Login with username: bcmtrac (or miduser)
3. Click "📋 Manage Facilities" button
4. Click "Configure" button
5. Click on "Sports" category header to expand
```
**Expected:** Sports category expands showing all facilities

#### Step 2: Open Time Settings
```
6. Find "Tennis Court 1" in the list
7. Click the ⏰ (Clock) icon next to it
```
**Expected:** Time Settings Modal opens with title "Configure Time Settings - Tennis Court 1"

#### Step 3: Configure Custom Settings
```
8. Change Time Interval to: 60 minutes
9. Change Default Duration to: 60
10. Change Min Duration to: 60
11. Change Max Duration to: 120
12. Change Opening Time to: 06:00
13. Change Closing Time to: 21:00
14. Change Advance Booking to: 14 days
15. Toggle "Allow Multiple Consecutive Slots" to: ON
16. Click "Save Settings"
```
**Expected:** 
- Toast message: "Time settings saved successfully"
- Modal closes
- Under "Tennis Court 1" you now see: "⏱️ 60min intervals • 06:00-21:00"

#### Step 4: Test in Booking Form
```
17. Close the Configure modal
18. Click on "Tennis Court 1" in the sidebar
19. Click "Make Booking" button
```
**Expected:** Booking form opens with:
- Header shows: "6:00-21:00 • 60 min slots • Book up to 14 days ahead"
- Time slots dropdown shows: 06:00, 07:00, 08:00... 20:00 (hourly)
- Duration dropdown shows ONLY: "1 hour", "2 hours"
- Min/Max info shows: "Min: 1 hour | Max: 2 hours"
- Calendar allows dates up to 14 days ahead only

#### Step 5: Make a Test Booking
```
20. Select tomorrow's date
21. Select time: 10:00
22. Duration: 1 hour (should be pre-selected)
23. Purpose: "Tennis practice"
24. Click "Create Booking"
```
**Expected:**
- Toast: "Booking created successfully! ID: BKxxxxxx"
- Description: "Tennis Court 1 - 10:00 for 1 hour"
- Booking appears in list showing: "10:00 (1 hour)"

---

## 🎯 Part 2: Different Facility - BBQ Area

### Test Path B: Configure BBQ Area with Different Settings

#### Step 1: Configure BBQ Area
```
1. Go back to Manage Facilities → Configure
2. Expand "Recreation" category
3. Click ⏰ on "BBQ Area 1"
4. Configure:
   - Time Interval: 30 minutes
   - Default Duration: 180
   - Min Duration: 120
   - Max Duration: 300
   - Operating Hours: 11:00 - 22:00
   - Advance Booking: 30 days
   - Multiple Slots: ON
5. Save Settings
```
**Expected:** Under BBQ Area 1: "⏱️ 30min intervals • 11:00-22:00"

#### Step 2: Test BBQ Booking
```
6. Select "BBQ Area 1" from sidebar
7. Click "Make Booking"
```
**Expected:**
- Shows: "11:00-22:00 • 30 min slots • Book up to 30 days ahead"
- Time slots: 11:00, 11:30, 12:00... 21:30
- Durations: 2h, 2h 30m, 3h, 3h 30m, 4h, 4h 30m, 5h
- Default: 3 hours pre-selected
- Can book 30 days ahead

---

## 🎯 Part 3: Gym Equipment (Short Duration Testing)

### Test Path C: Configure Gym Equipment

#### Step 1: Configure Treadmill
```
1. Manage Facilities → Configure
2. Expand "Gym Equipment"
3. Click ⏰ on "Treadmill 1"
4. Configure:
   - Time Interval: 15 minutes
   - Default: 30
   - Min: 15
   - Max: 60
   - Hours: 05:00 - 23:00
   - Advance: 7 days
   - Multiple Slots: NO
5. Save
```
**Expected:** "⏱️ 15min intervals • 05:00-23:00"

#### Step 2: Test Gym Booking
```
6. Select "Treadmill 1"
7. Make Booking
```
**Expected:**
- Time slots every 15 minutes: 05:00, 05:15, 05:30...
- Durations: 15min, 30min, 45min, 1 hour
- Can only book 7 days ahead

---

## 🎯 Part 4: Move In/Out Configuration

### Test Path D: Configure Move In/Out Settings

#### Step 1: Access Move Settings
```
1. Click "📋 Manage Facilities"
2. Click "📦 Move In/Out Settings"
```
**Expected:** Move In/Out Configuration modal opens with 4 tabs

#### Step 2: Configure General Tab
```
3. On "General" tab:
   - Change Deposit to: $100
   - Change Advance Booking to: 60 days
   - Change Operating Hours to: 08:00 - 18:00
```
**Expected:** Values update in real-time

#### Step 3: Configure Scheduling Tab
```
4. Click "Scheduling" tab
5. Add new time slot:
   - Type: "18:00-20:00"
   - Click "Add"
6. Add new duration:
   - Label: "Half day"
   - Hours: 4
   - Click "Add Duration"
```
**Expected:** 
- New time slot appears in list
- New duration appears in list
- Original slots/durations still there

#### Step 4: Remove Items
```
7. Click trash icon next to "08:00-10:00" time slot
8. Click trash icon next to "2 hours" duration
```
**Expected:**
- Items removed from lists
- Toast confirmations

#### Step 5: Configure Facilities Tab
```
9. Click "Facilities" tab
10. Add new dock:
    - Type: "Dock D - Underground"
    - Click "Add"
11. Remove "Dock C"
```
**Expected:** Dock list updates

#### Step 6: Configure Requirements Tab
```
12. Click "Requirements" tab
13. Toggle "Require Insurance Certificate" to OFF
14. Change "Maximum Movers Allowed" to: 8
```
**Expected:** Settings update

#### Step 7: Review and Save
```
15. Scroll to bottom to see Configuration Summary
16. Verify all changes are reflected
17. Click "💾 Save Settings"
```
**Expected:**
- Toast: "Move In/Out settings updated successfully"
- Modal closes

---

### Test Path E: Use New Move In/Out Settings

#### Step 1: Start Move Request
```
1. Click on "Move In / Move Out Request" in sidebar
2. Click "Make Booking"
```
**Expected:** Move In/Out Wizard opens (Step 1 of 7)

#### Step 2: Test Scheduling (Step 1)
```
3. Select Move Type: "Moving In"
4. Select Move Date: (pick a date)
5. Click Time Slot dropdown
```
**Expected:** Shows your custom time slots including "18:00-20:00"

#### Step 3: Test Duration Options
```
6. Click Duration dropdown
```
**Expected:** 
- Shows your custom durations including "Half day"
- "2 hours" is removed (we deleted it)
- Shows booking limit: "Can book up to 60 days in advance"

#### Step 4: Test Loading Docks (Get to Step 4)
```
7. Fill in remaining Step 1 fields and click "Next"
8. Fill in Step 2 (Resident Info) and click "Next"
9. Fill in Step 3 (Moving Company) and click "Next"
10. On Step 4, click "Loading Dock Selection" dropdown
```
**Expected:** 
- Shows "Dock A", "Dock B", "Dock D - Underground"
- Does NOT show "Dock C" (we removed it)
- Shows "Any Available" option

---

## 🎯 Part 5: Edge Cases & Validation

### Test Path F: Validation Testing

#### Test Invalid Time Settings
```
1. Configure → Pick any facility → ⏰
2. Try to set Min Duration: 120
3. Set Max Duration: 60
4. Click Save
```
**Expected:** Error toast: "Minimum duration cannot be greater than maximum duration"

#### Test Invalid Operating Hours
```
5. Set Opening Time: 22:00
6. Set Closing Time: 07:00
7. Click Save
```
**Expected:** Error toast: "Opening time must be before closing time"

#### Test Booking Beyond Limits
```
8. Configure Tennis Court with Advance Booking: 7 days
9. Save
10. Try to make booking → Select date 10 days from now
```
**Expected:** Date is disabled in calendar (can't select it)

---

## 🎯 Part 6: Defaults & Reset Testing

### Test Path G: Reset Functionality

#### Test Facility Reset
```
1. Configure any facility with custom settings
2. Click "Reset to Defaults"
```
**Expected:**
- All fields return to: 30min intervals, 60min default, 30-240min range, 7am-10pm, 30 days
- Toast: "Settings reset to defaults"

#### Test Move In/Out Reset
```
3. Open Move In/Out Settings
4. Make several changes across tabs
5. Click "Reset to Defaults"
```
**Expected:** Everything returns to original defaults

---

## 🎯 Part 7: User Experience Flow

### Test Path H: Complete User Journey

#### Scenario: Admin sets up, User books

```
ADMIN ACTIONS:
1. Login as bcmtrac
2. Configure Tennis Court: 60min slots, 1-2hr durations, 6am-9pm
3. Configure BBQ Area: 30min slots, 2-5hr durations, 11am-10pm
4. Save both

USER ACTIONS:
5. Logout
6. Login as standard user
7. Select Tennis Court → Make Booking
8. Notice: Can only book 1-2 hours, in hourly slots
9. Create booking at 10:00 for 1 hour
10. Select BBQ Area → Make Booking
11. Notice: Different slots and durations
12. Create booking at 14:00 for 3 hours

VERIFY:
13. Both bookings appear in bookings list
14. Tennis shows: "10:00 (1 hour)"
15. BBQ shows: "14:00 (3 hours)"
```

---

## 📊 What Changed - Quick Reference

### Visual Changes to Look For:

1. **Configure Modal:**
   - ⏰ Clock icon next to each facility ← NEW
   - "⏱️ 60min intervals • 06:00-21:00" under facility name ← NEW

2. **Booking Form:**
   - Settings info banner at top ← NEW
   - "6:00-21:00 • 60 min slots • Book up to 14 days ahead" ← NEW
   - Duration shows min/max constraints ← NEW
   - Time slots change per facility ← NEW
   - Durations change per facility ← NEW

3. **Booking Card:**
   - Shows duration: "10:00 (1 hour)" ← NEW

4. **Move Settings:**
   - 4-tab interface ← COMPLETELY NEW
   - Add/remove time slots ← NEW
   - Add/remove durations ← NEW
   - Add/remove docks ← NEW
   - Configuration summary ← NEW

5. **Move Wizard:**
   - Custom time slots ← UPDATED
   - Custom durations ← UPDATED
   - Custom loading docks ← UPDATED
   - Booking limit message ← NEW

---

## ✅ Success Checklist

Run through this checklist:

- [ ] Can configure time settings for a facility
- [ ] Settings show under facility name after saving
- [ ] Booking form uses configured time slots
- [ ] Booking form uses configured durations
- [ ] Calendar respects advance booking limit
- [ ] Duration shows in booking card
- [ ] Can configure Move In/Out settings
- [ ] Move wizard uses new time slots
- [ ] Move wizard uses new durations
- [ ] Move wizard uses new loading docks
- [ ] Validation works (try invalid values)
- [ ] Reset to defaults works
- [ ] Different facilities can have different settings

---

## 🐛 If Something Doesn't Work

### Common Issues:

**Settings not appearing under facility?**
- Make sure you clicked "Save Settings"
- Refresh the page
- Check browser console (F12)

**Booking form not showing custom slots?**
- Close and reopen the booking modal
- Make sure you selected the correct facility
- Verify settings are saved (check under facility name)

**Can't select future dates?**
- Check the advance booking days setting
- Make sure it's not set too low

**Move wizard not using new settings?**
- Verify you clicked "Save Settings" in Move In/Out modal
- Try reopening the wizard

---

## 🎉 Testing Complete!

If all tests pass, you have:
- ✅ Fully functional time configuration system
- ✅ Dynamic booking forms
- ✅ Comprehensive move in/out settings
- ✅ Proper validation and error handling
- ✅ Great user experience

**The feature is production-ready!** 🚀
