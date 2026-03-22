export interface SSEMessage {
  event: string;
  data: string;
}

export interface SSESession {
  id: string;
  createdAt: number;
  lastSeenAt: number;
  stream: ReadableStream<Uint8Array>;
  send(message: SSEMessage): void;
  close(): void;
}

export class SessionStore {
  private readonly sessions = new Map<string, SSESession>();

  createSession(): SSESession {
    const id = crypto.randomUUID();
    let controller: ReadableStreamDefaultController<Uint8Array> | null = null;

    const stream = new ReadableStream<Uint8Array>({
      start(ctrl) {
        controller = ctrl;
      },
      cancel: () => {
        this.sessions.delete(id);
      },
    });

    const session: SSESession = {
      id,
      createdAt: Date.now(),
      lastSeenAt: Date.now(),
      stream,
      send: (message) => {
        session.lastSeenAt = Date.now();
        controller?.enqueue(
          new TextEncoder().encode(`event: ${message.event}\ndata: ${message.data}\n\n`),
        );
      },
      close: () => {
        controller?.close();
        this.sessions.delete(id);
      },
    };

    this.sessions.set(id, session);
    return session;
  }

  get(id: string): SSESession | undefined {
    return this.sessions.get(id);
  }

  prune(maxAgeMs: number): number {
    const now = Date.now();
    let removed = 0;
    for (const session of this.sessions.values()) {
      if (now - session.lastSeenAt > maxAgeMs) {
        session.close();
        removed += 1;
      }
    }
    return removed;
  }
}
