import axios from 'axios';
import { Request, Response } from 'express';
import { Controller, All, Req, Res, HttpStatus } from '@nestjs/common';
import { DiscoveryService } from 'src/discovery/discovery.service';

@Controller('gateway')
export class GatewayController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @All(':port/*')
  async handleRequest(@Req() req: Request, @Res() res: Response) {
    const port = parseInt(req.params.port, 10);
    const service = this.discoveryService.getDiscoveredService(port);

    if (!service) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Service not found' });
    }

    try {
      const response = await axios({
        method: req.method,
        url: `http://localhost:${port}${req.url.replace(`/gateway/${port}`, '')}`,
        data: req.body,
        headers: { ...req.headers },
      });

      res.status(response.status).json(response.data);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error forwarding request' });
    }
  }
}
