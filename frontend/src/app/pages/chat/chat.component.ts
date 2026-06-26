import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketService, ChatMessage } from '../../services/socket.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesEnd') messagesEnd!: ElementRef;

  messages: ChatMessage[] = [];
  connectedUsers: string[] = [];
  newMessage = '';
  currentUser = '';
  typingUsers: string[] = [];
  private typingTimeout: any;
  private subscriptions: Subscription[] = [];
  private shouldScroll = true;
  private isCurrentlyTyping = false;

  constructor(
    private socket: SocketService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getUsername() || 'Anónimo';

    // Conectar socket y unirse al chat
    this.socket.connect();
    this.socket.join(this.currentUser);

    // Suscribirse a eventos
    this.subscriptions.push(
      this.socket.onMessageHistory().subscribe((history) => {
        this.messages = history;
        this.shouldScroll = true;
        this.cdr.detectChanges();
      }),

      this.socket.onMessage().subscribe((msg) => {
        this.messages.push(msg);
        this.shouldScroll = true;
        this.cdr.detectChanges();
      }),

      this.socket.onUsersUpdate().subscribe((users) => {
        this.connectedUsers = users;
        this.cdr.detectChanges();
      }),

      this.socket.onUserTyping().subscribe(({ username, isTyping }) => {
        if (username === this.currentUser) return;
        if (isTyping) {
          if (!this.typingUsers.includes(username))
            this.typingUsers.push(username);
        } else {
          this.typingUsers = this.typingUsers.filter((u) => u !== username);
        }
        this.cdr.detectChanges();
      }),
    );
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.socket.disconnect();
  }

  send(): void {
    const msg = this.newMessage.trim();
    if (!msg) return;
    this.socket.sendMessage(this.currentUser, msg);
    this.newMessage = '';
    this.socket.sendTyping(this.currentUser, false);
    this.isCurrentlyTyping = false;
  }

  onTyping(): void {
    if (!this.isCurrentlyTyping) {
      this.isCurrentlyTyping = true;
      this.socket.sendTyping(this.currentUser, true);
    }
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.isCurrentlyTyping = false;
      this.socket.sendTyping(this.currentUser, false);
    }, 2000);
  }

  logout(): void {
    this.socket.disconnect();
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  isOwnMessage(msg: ChatMessage): boolean {
    return msg.username === this.currentUser;
  }

  formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString('es-EC', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private scrollToBottom(): void {
    try {
      this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    } catch {}
  }
}
