import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

export interface ChatMessage {
  username: string;
  message: string;
  timestamp: string;
  type: 'message' | 'system';
}

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Map: socketId → username
  private connectedUsers = new Map<string, string>();
  // Historial de mensajes (últimos 50)
  private messageHistory: ChatMessage[] = [];

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization;
      if (!token) {
        console.log(`[SOCKET] Conexión rechazada: Token no proporcionado para cliente ${client.id}`);
        client.disconnect();
        return;
      }

      const jwtToken = token.startsWith('Bearer ') ? token.replace('Bearer ', '') : token;
      const payload = await this.jwtService.verifyAsync(jwtToken, {
        secret: process.env.JWT_SECRET || 'ad-project-secret-2024',
      });

      client.data = { username: payload.username, userId: payload.sub };
      console.log(`[SOCKET] Cliente conectado y autenticado: ${payload.username} (${client.id})`);
    } catch (err) {
      console.log(`[SOCKET] Conexión rechazada: Token inválido para cliente ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const username = this.connectedUsers.get(client.id);
    if (username) {
      this.connectedUsers.delete(client.id);
      const sysMsg: ChatMessage = {
        username: 'Sistema',
        message: `${username} se ha desconectado`,
        timestamp: new Date().toISOString(),
        type: 'system',
      };
      this.server.emit('receiveMessage', sysMsg);
      this.server.emit('updateUsers', this.getUsersList());
      console.log(`[SOCKET] ${username} desconectado`);
    }
  }

  @SubscribeMessage('join')
  handleJoin(
    @ConnectedSocket() client: Socket,
  ) {
    const username = client.data?.username;
    if (!username) {
      client.disconnect();
      return;
    }
    
    this.connectedUsers.set(client.id, username);

    // Enviar historial de mensajes al nuevo usuario
    client.emit('messageHistory', this.messageHistory);

    // Notificar a todos que alguien se unió
    const sysMsg: ChatMessage = {
      username: 'Sistema',
      message: `${username} se unió al chat`,
      timestamp: new Date().toISOString(),
      type: 'system',
    };
    this.server.emit('receiveMessage', sysMsg);
    this.server.emit('updateUsers', this.getUsersList());

    console.log(`[SOCKET] ${username} se unió`);
    return { event: 'joinedOk', data: { username } };
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: { message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const username = client.data?.username;
    if (!username) {
      client.disconnect();
      return;
    }

    const msg: ChatMessage = {
      username: username,
      message: data.message,
      timestamp: new Date().toISOString(),
      type: 'message',
    };

    // Guardar en historial (máx 50 mensajes)
    this.messageHistory.push(msg);
    if (this.messageHistory.length > 50) this.messageHistory.shift();

    // Broadcast a todos los clientes
    this.server.emit('receiveMessage', msg);
    console.log(`[MSG] ${username}: ${data.message}`);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const username = client.data?.username;
    if (!username) return;

    // Notificar a todos EXCEPTO quien está escribiendo
    client.broadcast.emit('userTyping', { username, isTyping: data.isTyping });
  }

  private getUsersList(): string[] {
    return [...this.connectedUsers.values()];
  }
}
