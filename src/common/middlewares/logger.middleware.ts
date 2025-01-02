import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    const {
      method,
      originalUrl: endpoint,
      headers,
      body,
      hostname: host,
    } = req;

    // Tentukan nama file log dengan format tanggal
    const date = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    const logDir = path.join(process.cwd(), 'storage', 'logs'); // Folder storage/logs
    const logFilePath = path.join(logDir, `${date}.log`);

    // Pastikan folder logs tersedia
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Tangkap respons
    res.on('finish', () => {
      const elapsedTime = Date.now() - startTime;
      const responseStatusCode = res.statusCode;

      // Data log
      const logEntry = {
        timestamp: new Date().toISOString(),
        host,
        method,
        endpoint,
        headers,
        body,
        responseStatusCode,
        responseTime: `${elapsedTime}ms`,
        responseBody: res.locals.responseBody || 'N/A',
      };

      // Simpan ke file
      fs.appendFileSync(logFilePath, `${JSON.stringify(logEntry)}\n`);
    });

    next();
  }
}
