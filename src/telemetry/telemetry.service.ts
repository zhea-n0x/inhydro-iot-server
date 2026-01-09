import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TelemetryService{
    private readonly logger = new Logger('Telemetry');

    handle(deviceId: string, payload: any){
        this.logger.log({
            deviceId,
            ts: Date.now(),
            payload
        })
    }
}