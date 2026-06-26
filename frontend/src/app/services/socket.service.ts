import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

export interface ChatMessage {
  username: string;
  message: string;
  timestamp: string;
  type: 'message' | 'system';
}

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket | null = null;
  private readonly SERVER_URL = 'https://ad-chat-backend.onrender.com';

  connect(): void {
    if (!this.socket || !this.socket.connected) {
      const token = localStorage.getItem('token');
      this.socket = io(this.SERVER_URL, {
        transports: ['websocket'],
        auth: {
          token: token,
        },
      });

      this.socket.on('connect_error', (err) => {
        console.error('[Socket] Error de conexión:', err.message);
      });

      console.log('[Socket] Conectando al servidor...');
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  join(username: string): void {
    this.socket?.emit('join', { username });
  }

  sendMessage(username: string, message: string): void {
    this.socket?.emit('sendMessage', { username, message });
  }

  sendTyping(username: string, isTyping: boolean): void {
    this.socket?.emit('typing', { username, isTyping });
  }

  onMessage(): Observable<ChatMessage> {
    return new Observable((observer) => {
      this.socket?.on('receiveMessage', (data: ChatMessage) => {
        observer.next(data);
      });
    });
  }

  onMessageHistory(): Observable<ChatMessage[]> {
    return new Observable((observer) => {
      this.socket?.on('messageHistory', (data: ChatMessage[]) => {
        observer.next(data);
      });
    });
  }

  onUsersUpdate(): Observable<string[]> {
    return new Observable((observer) => {
      this.socket?.on('updateUsers', (users: string[]) => {
        observer.next(users);
      });
    });
  }

  onUserTyping(): Observable<{ username: string; isTyping: boolean }> {
    return new Observable((observer) => {
      this.socket?.on('userTyping', (data) => {
        observer.next(data);
      });
    });
  }
}
