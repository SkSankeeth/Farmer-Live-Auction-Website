// Lightweight Socket.IO client loader using dynamic import from CDN
let socket = null;

export async function connectRealtime(baseUrl = 'http://localhost:5000') {
  if (socket) return socket;
  if (!window.io) {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.socket.io/4.7.5/socket.io.min.js';
      s.crossOrigin = 'anonymous';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  socket = window.io(baseUrl, { transports: ['websocket'], reconnection: true });
  return socket;
}

export function getSocket() {
  return socket;
}





