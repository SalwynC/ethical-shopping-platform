# Fixing 500 Internal Server Errors

## Problem
When running `npm run dev`, the browser console shows multiple 500 Internal Server Errors for Next.js chunks and pages.

## Root Causes Identified

1. **Corrupted Build Cache** - The `.next` folder contained stale or corrupted build artifacts
2. **PWA Service Worker Interference** - Service worker files were interfering with dev server
3. **Standalone Output in Dev Mode** - The `output: 'standalone'` config was causing issues in development

## Solutions Applied

### 1. Clear Build Cache ✅
```bash
# Windows PowerShell
cd frontend
Remove-Item -Recurse -Force .next
```

### 2. Remove Service Workers ✅
```bash
# Windows PowerShell
Remove-Item -Force public\sw.js
Remove-Item -Force public\workbox-*.js
```

### 3. Fix Next.js Config ✅
Updated `next.config.mjs` to only use `standalone` output in production:
```javascript
...(process.env.NODE_ENV === 'production' && { output: 'standalone' })
```

### 4. Fixed Animation Components ✅
- Simplified `AnimatedCard` component to avoid variant conflicts
- Ensured all motion components are properly wrapped

### 5. Added Error Boundaries ✅
- Created `error.tsx` for page-level errors
- Created `global-error.tsx` for root-level errors

## Steps to Fix (If Errors Persist)

### Step 1: Stop the Dev Server
Press `Ctrl+C` in the terminal where `npm run dev` is running.

### Step 2: Clear All Caches
```powershell
cd ethical-shopping-platform/frontend

# Remove build cache
if (Test-Path .next) { Remove-Item -Recurse -Force .next }

# Remove service workers
if (Test-Path "public\sw.js") { Remove-Item -Force "public\sw.js" }
if (Test-Path "public\workbox-*.js") { Remove-Item -Force "public\workbox-*.js" }

# Clear node_modules cache (optional, if issues persist)
# Remove-Item -Recurse -Force node_modules\.cache
```

### Step 3: Clear Browser Cache
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Or go to Application tab → Clear Storage → Clear site data

### Step 4: Unregister Service Workers
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Service Workers" in left sidebar
4. Click "Unregister" for any registered workers
5. Go to "Cache Storage" and delete all caches

### Step 5: Reinstall Dependencies (If Needed)
```powershell
# Only if Step 2-4 don't work
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

### Step 6: Restart Dev Server
```powershell
npm run dev
```

## Verification

After following the steps above, you should see:
- ✅ No 500 errors in browser console
- ✅ Page loads successfully
- ✅ Hot reload works
- ✅ All components render correctly

## Prevention

1. **Regular Cache Clearing**: Run cleanup script before starting dev server if you see issues
2. **Service Worker Management**: The `DevServiceWorkerCleanup` component automatically handles this in dev mode
3. **Build Before Commits**: Always run `npm run build` before committing to catch errors early

## Quick Fix Script

Create a PowerShell script `fix-dev.ps1` in the frontend directory:

```powershell
# fix-dev.ps1
Write-Host "Clearing Next.js cache..."
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
if (Test-Path "public\sw.js") { Remove-Item -Force "public\sw.js" }
if (Test-Path "public\workbox-*.js") { Remove-Item -Force "public\workbox-*.js" }
Write-Host "Cache cleared! Now run: npm run dev"
```

Then run: `.\fix-dev.ps1`

## Common Error Patterns

### Pattern 1: Chunk Loading Errors
**Symptom:** `GET /_next/static/chunks/... 500`
**Fix:** Clear `.next` folder and restart

### Pattern 2: Service Worker Errors
**Symptom:** Errors related to `sw.js` or `workbox`
**Fix:** Remove service worker files and unregister in browser

### Pattern 3: Module Not Found
**Symptom:** `Cannot find module` errors
**Fix:** Reinstall dependencies with `npm install`

### Pattern 4: Runtime Errors
**Symptom:** Component errors in terminal
**Fix:** Check the terminal output for specific file/line errors

## Still Having Issues?

1. Check the **terminal output** - Next.js shows detailed errors there
2. Check **browser console** - Client-side errors appear here
3. Check **Network tab** - See which requests are failing
4. Review **error.tsx** - Custom error page shows error details

## Related Files

- `next.config.mjs` - Next.js configuration
- `src/app/error.tsx` - Error boundary component
- `src/app/global-error.tsx` - Global error handler
- `src/components/common/DevServiceWorkerCleanup.tsx` - Dev helper

---

**Last Updated:** December 2024  
**Status:** All fixes applied and tested

