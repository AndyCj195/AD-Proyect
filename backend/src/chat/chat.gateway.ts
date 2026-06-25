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

  handleConnection(client: Socket) {
    console.log(`[SOCKET] Cliente conectado: ${client.id}`);
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
    @MessageBody() data: { username: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { username } = data;
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
    @MessageBody() data: { username: string; message: string },
    @ConnectedSocket() _client: Socket,
  ) {
    const msg: ChatMessage = {
      username: data.username,
      message: data.message,
      timestamp: new Date().toISOString(),
      type: 'message',
    };

    // Guardar en historial (máx 50 mensajes)
    this.messageHistory.push(msg);
    if (this.messageHistory.length > 50) this.messageHistory.shift();

    // Broadcast a todos los clientes
    this.server.emit('receiveMessage', msg);
    console.log(`[MSG] ${data.username}: ${data.message}`);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { username: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    // Notificar a todos EXCEPTO quien está escribiendo
    client.broadcast.emit('userTyping', data);
  }

  private getUsersList(): string[] {
    return [...this.connectedUsers.values()];
  }
}
