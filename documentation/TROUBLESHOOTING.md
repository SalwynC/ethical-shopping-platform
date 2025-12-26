# Troubleshooting Guide

## Chunk Loading Errors (400 Bad Request, ChunkLoadError)

If you encounter errors like:
- `Failed to load resource: the server responded with a status of 400 (Bad Request)`
- `ChunkLoadError: Loading chunk XXX failed`
- `Minified React error #423`

### Quick Fix Steps:

1. **Stop the development server** (Ctrl+C)

2. **Clear build cache and service workers:**
   ```bash
   # Windows PowerShell
   cd frontend
   if (Test-Path .next) { Remove-Item -Recurse -Force .next }
   if (Test-Path "public\sw.js") { Remove-Item -Force "public\sw.js" }
   if (Test-Path "public\workbox-*.js") { Remove-Item -Force "public\workbox-*.js" }
   
   # Or use the npm script (Windows)
   npm run clean:win
   ```

3. **Clear browser cache:**
   - Open DevTools (F12)
   - Right-click the refresh button
   - Select "Empty Cache and Hard Reload"
   - Or manually clear cache: Settings > Privacy > Clear browsing data > Cached images and files

4. **Unregister service workers in browser:**
   - Open DevTools (F12)
   - Go to Application tab
   - Click "Service Workers" in the left sidebar
   - Click "Unregister" for any registered service workers
   - Go to "Cache Storage" and delete all caches

5. **Restart the development server:**
   ```bash
   npm run dev
   ```

### Why This Happens:

- **Stale build cache**: The `.next` folder contains cached build artifacts that may reference old chunk files
- **Service worker caching**: PWA service workers cache old chunk references even after rebuilds
- **Browser cache**: Browsers cache JavaScript chunks, and old references can break when chunks are regenerated
- **Hot reload issues**: Sometimes Next.js hot reload doesn't properly invalidate all chunks

### Prevention:

The project now includes:
- **DevServiceWorkerCleanup**: Automatically unregisters service workers in development mode
- **PWA disabled in dev**: Service workers are disabled during development to prevent caching issues
- **Clean scripts**: Use `npm run clean:win` (Windows) or `npm run clean` (Unix) to quickly clear caches

### If Issues Persist:

1. Close all browser tabs with localhost:3000
2. Clear all browser data for localhost
3. Restart your computer (sometimes helps with locked files)
4. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

