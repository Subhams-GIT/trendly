import { IncomingMessage } from "http"

import "http";

declare module "http" {

  interface CustomRequest extends IncomingMessage {
    params?: Record<string, string>;
    queryparams?: Map<string, string>;
    body?: any;
    customProperty?: string;
  }
}

export interface customRequest extends IncomingMessage {
    body: any,
    user?: {
        id: string,
        name: string,
        email: string,
    },
    queryparams?: Map<string, string>,
    searchparams?: { [key: string]: string };
}

export type JWTPayload = {
    id: string,
    name: string,
    email: string,
}
