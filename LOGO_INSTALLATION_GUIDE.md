# 🎨 LOGO INSTALLATION GUIDE

## ✅ What You Need To Do

### Step 1: Download the StrataTrac Logo

1. Go to www.stratatrac.com.au
2. Right-click on the logo (the one with the S and Australia map)
3. Save image as: `logo.png`

**OR**

Use the logo image you showed me - save it as a PNG file

### Step 2: Add Logo to Project

Copy the `logo.png` file to:
```
C:\bcmtracdev\facman\public\logo.png
```

The file should be directly in the `public` folder, not in any subfolder.

### Step 3: Verify

After placing the logo, refresh your browser and you should see:
- **Login Screen:** Large StrataTrac logo at the top (240px wide)
- **Header:** Smaller logo (120px) with white background box

---

## 📁 File Structure

```
facman/
├── public/
│   └── logo.png  <--- PUT THE LOGO HERE
├── components/
│   └── branding/
│       └── StrataTracLogo.tsx (✅ Already created)
└── ...
```

---

## 🎯 What the Logo Component Does

**File:** `components/branding/StrataTracLogo.tsx`

### Features:
- Uses Next.js Image component for optimization
- Supports 3 sizes: small (120px), medium (180px), large (240px)
- Maintains aspect ratio automatically
- Priority loading for fast display

### Usage in Code:
```tsx
// Login Modal - Large logo
<StrataTracLogo size="large" />

// Header - Small logo with white background
<div className="bg-white rounded-lg px-3 py-2">
  <StrataTracLogo size="small" />
</div>
```

---

## 🎨 Current Design

### Login Modal:
- **Background:** White (so logo is visible)
- **Logo Size:** 240px wide
- **Border:** Cyan #00D9FF
- **Cards:** Glass-morphism effect with blue gradients

### Header:
- **Background:** Dark navy #001F3F
- **Logo Container:** White rounded box (so logo is visible)
- **Logo Size:** 120px wide
- **Tagline:** Shown next to logo

### Main Pages:
- **Background:** Dark navy #001F3F with subtle city image overlay
- **Cards:** Semi-transparent dark blue with cyan borders
- **Buttons:** Cyan gradient #00D9FF

---

## 🔧 If Logo Still Not Visible

### Option 1: Use Direct URL
If you have the logo hosted somewhere, you can update the component:

```tsx
<Image
  src="https://www.stratatrac.com.au/path-to-logo.png"
  alt="StrataTrac Logo"
  width={width}
  height={height}
  priority
/>
```

### Option 2: Use Base64
Convert the logo to base64 and embed it directly (not recommended but works):

```tsx
<Image
  src="data:image/png;base64,iVBORw0KGgo..."
  alt="StrataTrac Logo"
  width={width}
  height={height}
  priority
/>
```

---

## ✨ What's Complete

✅ Logo component created  
✅ Login modal updated with white background  
✅ Header updated with white logo container  
✅ All styling matches StrataTrac brand  
✅ Background image added (city skyline)  
✅ Proper color scheme (#00D9FF cyan, #001F3F navy, #FF8C42 orange)  
✅ High contrast for readability  
✅ Glass-morphism modern design  

**ONLY MISSING:** The actual logo.png file in the public folder!

---

## 📝 Quick Checklist

- [ ] Downloaded logo from StrataTrac website
- [ ] Saved as `logo.png`
- [ ] Copied to `C:\bcmtracdev\facman\public\logo.png`
- [ ] Refreshed browser
- [ ] Logo appears on login screen
- [ ] Logo appears in header with white background

---

## 🎉 Once Logo is Added

The app will be **100% complete** with:
- ✅ Full StrataTrac branding
- ✅ Professional appearance
- ✅ All features working
- ✅ Modern UI/UX
- ✅ Proper logo visibility
- ✅ Background images
- ✅ Color scheme matching website

**Total Development:** Full strata facilities management system! 🚀
