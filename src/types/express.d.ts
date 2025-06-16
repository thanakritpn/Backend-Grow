import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: {
      id: number;
      email: string;
      username: string;
    }; // ปรับตาม Payload ของ JWT
  }
}