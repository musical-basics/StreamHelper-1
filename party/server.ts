import type * as Party from "partykit/server";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  onMessage(message: string, sender: Party.Connection) {
    // Broadcast every message to all connected clients (including sender)
    this.room.broadcast(message);
  }

  onConnect(conn: Party.Connection) {
    console.log(`[PartyKit] Client connected: ${conn.id}`);
  }

  onClose(conn: Party.Connection) {
    console.log(`[PartyKit] Client disconnected: ${conn.id}`);
  }
}

Server satisfies Party.Worker;
