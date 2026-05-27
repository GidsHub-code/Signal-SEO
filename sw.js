// SignalMe service worker — production push + click-to-open deep links + analytics

const ANALYTICS_ENDPOINT = "/api/push/event";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

function logEvent(type, data) {
  try {
    fetch(ANALYTICS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_type: type, ...data }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "SignalMe", body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "SignalMe";
  const url = data.url || "/";
  const notifId = data.notification_id || data.tag || url;
  // Dedupe across web/PWA/Android: tag by notification_id so the same logical
  // alert from any channel collapses into one visible notification.
  const tag = notifId;

  const options = {
    body: data.body || "",
    icon: data.image || "/icon-192.png",
    badge: "/icon-192.png",
    image: data.image || undefined,
    tag,
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200, 100, 200],
    silent: false,
    timestamp: data.timestamp ? Number(data.timestamp) : Date.now(),
    data: { url, notification_id: notifId, user_id: data.user_id || null },
  };

  event.waitUntil((async () => {
    await self.registration.showNotification(title, options);

    // App badge from unread count if provided, else from open notifications
    try {
      if (self.navigator && "setAppBadge" in self.navigator) {
        const count = typeof data.unread === "number"
          ? data.unread
          : (await self.registration.getNotifications()).length;
        await self.navigator.setAppBadge(count);
      }
    } catch {}

    // Foreground clients: nudge to refresh unread state
    try {
      const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      clients.forEach((c) => c.postMessage({ type: "push", url, notification_id: notifId }));
    } catch {}

    logEvent("delivered", { notification_id: notifId, user_id: data.user_id || null, url });
  })());
});

self.addEventListener("notificationclick", (event) => {
  const notif = event.notification;
  const url = notif.data?.url || "/";
  const notifId = notif.data?.notification_id || null;
  const userId = notif.data?.user_id || null;
  notif.close();

  event.waitUntil((async () => {
    try {
      if (self.navigator && "clearAppBadge" in self.navigator) await self.navigator.clearAppBadge();
    } catch {}

    logEvent("clicked", { notification_id: notifId, user_id: userId, url });

    const clientList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    // Reuse an existing window if available — opens exact chat/request screen
    for (const client of clientList) {
      if ("focus" in client) {
        try { await client.navigate(url); } catch {}
        return client.focus();
      }
    }
    if (self.clients.openWindow) return self.clients.openWindow(url);
  })());
});

self.addEventListener("notificationclose", (event) => {
  const notif = event.notification;
  logEvent("dismissed", {
    notification_id: notif.data?.notification_id || null,
    user_id: notif.data?.user_id || null,
    url: notif.data?.url || null,
  });
});
