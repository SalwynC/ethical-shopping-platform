"use client";

import { useEffect } from "react";

/**
 * Development helper to unregister service workers and clear caches
 * This prevents stale service workers from causing chunk loading errors
 */
export function DevServiceWorkerCleanup() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    // Unregister all service workers
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().then((success) => {
            if (success) {
              console.log("[Dev] Service worker unregistered");
            }
          });
        }
      });

      // Clear all caches
      if ("caches" in window) {
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              console.log("[Dev] Clearing cache:", cacheName);
              return caches.delete(cacheName);
            }),
          );
        });
      }
    }
  }, []);

  return null;
}

