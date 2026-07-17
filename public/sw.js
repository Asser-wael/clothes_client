self.addEventListener("push", (event) => {
  event.waitUntil(
    (async () => {
      let data = {};

      try {
        data = event.data ? event.data.json() : {};
      } catch (err) {
        console.error("Push data parse error:", err);
      }

      await self.registration.showNotification(data.title || "Notification", {
        body: data.body || "",
        icon: "/logo.png",
      });
    })()
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientsArr) => {
        if (clientsArr.length > 0) {
          clientsArr[0].focus();
        } else {
          clients.openWindow("/");
        }
      })
  );
});

// ✅ يخلي الـ Service Worker يتفعل فورًا بدون ما يستنى التاب القديم يتقفل
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});