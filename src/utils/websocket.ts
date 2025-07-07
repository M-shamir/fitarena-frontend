// utils/websocket.ts
let socket: WebSocket | null = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

export const setupNotificationSocket = (showNotification: (msg: string) => void) => {
  if (socket) return socket; // Return existing connection if it exists

  
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost/ws/notifications/';
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log('✅ WebSocket connected');
    reconnectAttempts = 0; // Reset reconnect attempts on successful connection
  };

  socket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        if (data.type === 'notification') {
            showNotification(data.message);
        }
    } catch (error) {
        console.error('Error parsing notification:', error);
    }
};

  socket.onclose = (event) => {
    console.log('🔒 WebSocket closed', event);
    if (reconnectAttempts < maxReconnectAttempts) {
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000); 
      setTimeout(() => {
        reconnectAttempts++;
        setupNotificationSocket(showNotification);
      }, delay);
    }
  };

  socket.onerror = (error) => {
    console.error('❌ WebSocket error', error);
  };

  return socket;
};

export const closeNotificationSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};