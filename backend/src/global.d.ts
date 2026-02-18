import { IncomingMessage } from "http"

export interface customRequest extends IncomingMessage{
    body:any
}