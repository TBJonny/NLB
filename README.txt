# Next Level Barbershop — Patch v3

What changed:
- Pills added on each barber card (Call / Booksy where available / Prices).
- iOS/Android PWA: Service worker now registers; iOS meta tags added.
- Map embed updated to your latest Google Maps iframe.
- Loader and navbar icon now reference `apple-touch-icon.png` to avoid 404s.
- Service worker cache bumped to `nlb-v2` (forces fresh assets after first load).

How to deploy:
1. Upload/replace these files on your host (overwrite existing).
2. On your phone, **hard refresh** the site once to update the service worker.
   - Chrome/Android: Settings → Site settings → Clear cache for your domain, or open in Chrome and pull to refresh.
   - iOS Safari: Tap the address bar → reload; if installed to Home Screen, swipe-close and reopen.
3. Optional: Add to Home Screen for the full-screen app look.

