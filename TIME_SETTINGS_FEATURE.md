# Time Interval & Duration Configuration Feature

## Overview
This feature allows mid-level users and super admins (bcmtrac and miduser roles) to configure time intervals, durations, and operating hours for each facility in the system.

## What Was Added

### 1. **New Type Definitions** (`lib/types.ts`)
- **`FacilityTimeSettings`** interface with the following properties:
  - `timeIntervalMinutes`: Time slot intervals (15, 30, 60, 120 minutes)
  - `defaultDurationMinutes`: Pre-filled booking duration
  - `minDurationMinutes`: Minimum allowed booking duration
  - `maxDurationMinutes`: Maximum allowed booking duration
  - `operatingHours`: Start and end times (e.g., 07:00 - 22:00)
  - `allowMultipleSlots`: Whether users can book consecutive slots
  - `advanceBookingDays`: How far ahead bookings can be made
- Added optional `timeSettings` field to `Facility` interface

### 2. **Store Updates** (`lib/store/useAppStore.ts`)
- Added `updateFacilityTimeSettings` function to persist time configurations
- Imported `FacilityTimeSettings` type

### 3. **New Component: FacilityTimeSettingsModal** (`components/facilities/FacilityTimeSettingsModal.tsx`)
A comprehensive modal for configuring facility time settings with:
- **Time Interval Selector**: Dropdown for 15, 30, 60, or 120-minute intervals
- **Duration Controls**: 
  - Default duration input
  - Minimum and maximum duration inputs
- **Operating Hours**: Time pickers for opening/closing times
- **Advance Booking**: Number of days ahead residents can book
- **Multiple Slots Toggle**: Switch to enable/disable consecutive bookings
- **Live Preview**: Configuration summary showing all settings
- **Validation**: Ensures logical constraints (min < default < max, start < end)
- **Reset Button**: Restore default settings

### 4. **Updated ConfigureFacilitiesModal** (`components/facilities/ConfigureFacilitiesModal.tsx`)
- Added Clock icon button next to each facility for quick access to time settings
- Displays current time configuration below facility name (when configured)
- Shows: "⏱️ 30min intervals • 07:00-22:00" as a preview
- Integrated `FacilityTimeSettingsModal` component

## How to Use

### For Admins (bcmtrac/miduser):

1. **Open Manage Facilities**
   - Click "📋 Manage Facilities" button on the main page
   - Click "Configure" to open the facilities configuration modal

2. **Configure Time Settings for a Facility**
   - Expand the category containing the facility
   - Click the **Clock icon (⏰)** next to the facility name
   - The Time Settings Modal will open

3. **Adjust Settings**
   - **Time Interval**: Choose how often time slots are available (15, 30, 60, or 120 minutes)
   - **Default Duration**: Set what duration is pre-filled when making bookings
   - **Duration Range**: Set minimum and maximum allowed booking durations
   - **Operating Hours**: Define when the facility is available
   - **Advance Booking**: Set how many days ahead residents can book
   - **Multiple Slots**: Toggle whether users can book consecutive time slots

4. **Save or Reset**
   - Click "Save Settings" to apply changes
   - Click "Reset to Defaults" to restore standard settings
   - Click "Cancel" to close without saving

5. **View Current Settings**
   - After configuration, a summary appears below the facility name
   - Example: "⏱️ 30min intervals • 07:00-22:00"

## Default Settings
When no custom settings are configured, facilities use these defaults:
- Time Interval: 30 minutes
- Default Duration: 60 minutes
- Min Duration: 30 minutes
- Max Duration: 240 minutes (4 hours)
- Operating Hours: 07:00 - 22:00
- Allow Multiple Slots: Yes
- Advance Booking: 30 days

## Example Use Cases

### Tennis Court
- Time Interval: 60 minutes
- Default Duration: 60 minutes
- Min/Max: 60-120 minutes
- Hours: 06:00 - 21:00
- Allow Multiple Slots: Yes

### BBQ Area
- Time Interval: 30 minutes
- Default Duration: 120 minutes (2 hours)
- Min/Max: 120-240 minutes
- Hours: 11:00 - 22:00
- Allow Multiple Slots: Yes

### Gym Equipment
- Time Interval: 15 minutes
- Default Duration: 30 minutes
- Min/Max: 15-60 minutes
- Hours: 05:00 - 23:00
- Allow Multiple Slots: No (prevents hogging)

## Technical Notes

### Validation Rules
- Minimum duration must be ≤ maximum duration
- Default duration must be between min and max
- Opening time must be before closing time
- All duration values are in minutes
- Time intervals are restricted to: 15, 30, 60, or 120 minutes

### Data Persistence
- Settings are stored in the Zustand store
- Each facility can have unique time settings
- Settings are optional (facilities work with defaults if not configured)
- Changes are immediately reflected in the UI

### Integration Points
The time settings can be used by:
- Booking form to generate available time slots
- Booking validation to enforce duration limits
- Calendar views to show operating hours
- Availability checks to respect advance booking periods

## Future Enhancements (Not Yet Implemented)
- Day-specific operating hours (e.g., closed Mondays)
- Seasonal hours (summer vs winter)
- Holiday schedules
- Peak/off-peak pricing integration
- Blocked out dates for maintenance
- Different settings for different user roles

## Files Modified/Created
1. ✅ `lib/types.ts` - Added FacilityTimeSettings interface
2. ✅ `lib/store/useAppStore.ts` - Added time settings management
3. ✅ `components/facilities/FacilityTimeSettingsModal.tsx` - New modal component
4. ✅ `components/facilities/ConfigureFacilitiesModal.tsx` - Added time settings access
