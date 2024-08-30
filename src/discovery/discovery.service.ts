import { Injectable } from '@nestjs/common';
import * as net from 'net';
import axios from 'axios';

@Injectable()
export class DiscoveryService {
  private readonly portRange: number[] = Array.from({ length: 6001 }, (_, i) => i + 3000);

  async scanPorts(): Promise<number[]> {
    const openPorts: number[] = [];
    for (const port of this.portRange) {
      if (await this.isPortOpen(port)) {
        openPorts.push(port);
      }
    }
    return openPorts;
  }

  private isPortOpen(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(200);
      socket.once('connect', () => {
        socket.destroy();
        resolve(true);
      });
      socket.once('timeout', () => {
        socket.destroy();
        resolve(false);
      });
      socket.once('error', () => {
        resolve(false);
      });
      socket.connect(port, '127.0.0.1');
    });
  }

  async identifyHttpServices(): Promise<any[]> {
    const openPorts = await this.scanPorts();
    const httpServices = [];

    for (const port of openPorts) {
      try {
        const response = await axios.get(`http://localhost:${port}`);
        httpServices.push({
          port,
          status: response.status,
          data: response.data,
        });
      } catch (error) {
        // If the request fails, it's not an HTTP service
      }
    }

    return httpServices;
  }
}
