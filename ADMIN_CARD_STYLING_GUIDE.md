# ADMIN PAGE - CARD STYLING UPDATE

## Common Card Class for All Cards

Apply this to ALL 6 cards:

```tsx
className="hover:shadow-2xl transition-all cursor-pointer bg-[#002850]/90 backdrop-blur-sm border-2 border-[#00D9FF]/30 hover:border-[#00D9FF] hover:scale-[1.02]"
```

## Card Title & Description Updates

```tsx
<CardTitle className="text-white">Title</CardTitle>
<CardDescription className="text-gray-300">Description</CardDescription>
```

## Card Content Text

```tsx
<p className="text-sm text-gray-200 mb-4">...</p>
```

## Bullet Points

```tsx
<li className="flex items-center gap-2 text-gray-200">
  <span className="h-1.5 w-1.5 bg-[#00D9FF] rounded-full"></span>
  Text
</li>
```

## Icon Containers (by card):

1. **Configure Facilities** - Cyan
```tsx
<div className="p-3 bg-[#00D9FF]/20 rounded-lg">
  <Settings className="h-6 w-6 text-[#00D9FF]" />
</div>
```

2. **Add Category** - Green
```tsx
<div className="p-3 bg-green-500/20 rounded-lg">
  <FolderPlus className="h-6 w-6 text-green-400" />
</div>
```

3. **Move In/Out** - Orange
```tsx
<div className="p-3 bg-orange-500/20 rounded-lg">
  <Truck className="h-6 w-6 text-orange-400" />
</div>
```

4. **Concierge** - Blue
```tsx
<div className="p-3 bg-blue-500/20 rounded-lg">
  <Bell className="h-6 w-6 text-blue-400" />
</div>
```

5. **Building** - Purple
```tsx
<div className="p-3 bg-purple-500/20 rounded-lg">
  <Building2 className="h-6 w-6 text-purple-400" />
</div>
```

6. **System** - Gray
```tsx
<div className="p-3 bg-gray-500/20 rounded-lg">
  <Settings className="h-6 w-6 text-gray-300" />
</div>
```

---

The file is too long to edit piece by piece. These are the patterns to apply to cards 2-6.
