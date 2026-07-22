// Will Scarcat — Push notification service worker stub
// Full implementation pending (Phase 4)

self.addEventListener('push', (event) => {
  if (!event.data) return
  const data = event.data.json()
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'Will Scarcat', {
      body: data.body ?? 'New rewards available for your cat.',
      icon: '/images/willlogo.jpg',
      badge: '/images/willlogo.jpg',
      data: { url: data.url ?? '/dapp' },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow(event.notification.data?.url ?? '/dapp')
  )
})
