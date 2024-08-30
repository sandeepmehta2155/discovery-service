import { Request, Response } from 'express';
import { Controller, All, Req, Res, HttpStatus, Next } from '@nestjs/common';
import { DiscoveryService } from 'src/discovery/discovery.service';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { NextFunction } from 'http-proxy-middleware/dist/types';

@Controller('gateway')
export class GatewayController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @All(':port/*')
  async handleRequest(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    const port = parseInt(req.params.port, 10);
    const service = this.discoveryService.getDiscoveredService(port);

    if (!service) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Service not found' });
    }

    try {
       // Create a proxy middleware for the target service
    const proxy = createProxyMiddleware({
      target: `http://localhost:${port}`,
      changeOrigin: true,
      pathRewrite: (path, req) => path.replace(`/gateway/${port}`, ''),
    });

    proxy(req, res, next);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error forwarding request' });
    }
  }
}
