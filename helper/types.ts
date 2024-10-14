// Definisikan tipe untuk pesan dan user
export interface Message {
    from: string;
    message: string;
    username: string;
    lastTimestamp?: string | number;
    to: string;

  }
  
  export interface User {
    userId: string;
    socketId: string;
  }