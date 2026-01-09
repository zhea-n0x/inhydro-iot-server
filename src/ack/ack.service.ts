import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AckService{
    private readonly logger = new Logger('CommandAck');

    handle(deviceId: String, payload: any){
        this.logger.log({
            deviceId,
            commandId: payload.commandId,
            status: payload.status,
            ts: Date.now()
        })
    }
}