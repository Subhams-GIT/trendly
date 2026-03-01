import { IncomingMessage, ServerResponse } from 'http';
import type { customRequest } from '../global';

export async function healthCheckController(req: customRequest, res: ServerResponse): Promise<void> {
    console.log({url:req.url,body:req.body,queryparams:req.queryparams});
    if (req.url === '/health' && req.method === 'GET') {
        const healthStatus = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(healthStatus));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
}
