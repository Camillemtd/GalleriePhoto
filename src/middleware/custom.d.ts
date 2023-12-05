// custom.d.ts
import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    uid?: string; // Ajoutez une propriété uid optionnelle à la requête
  }
}
