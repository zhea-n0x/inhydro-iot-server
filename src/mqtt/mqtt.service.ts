import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as mqtt from 'mqtt';
import { TelemetryService } from '../telemetry/telemetry.service';
import { AckService } from "src/ack/ack.service";

Injectable()
export class MqttService{
    private client: mqtt.MqttClient;
    private readonly logger = new Logger(MqttService.name);

    constructor(
        private telemetry: TelemetryService,
        private ack: AckService
    ) { }

    async start() {
        this.client = mqtt.connect(process.env.MQtT_URL || 'mqtt://localhost:1883')

        this.client.on('connect', () => {
            this.logger.log('MQTT Connected')
            this.client.subscribe(['iot/+/telemetry', 'iot/+/ack'],
                (error) => {
                    if(error){
                        this.logger.error('Subscribe Failed!', error.message);
                    }else{
                        this.logger.log("Subscribed to topics!");
                    }
                }
            )
        })

        this.client.on('message', (topic, payload) => {
            this.route(topic, payload.toString())
        })
    }

    private handleTelemetry(topic: string, payload: any){
        if(!payload || typeof payload !== 'object'){
            this.logger.warn('Invalid telemetry payload shape');
            return
        }

        const deviceId = topic.split('/')[1]

        this.logger.log(`Telemetry from ${deviceId}`);
    }

    private handleAck(topic: string, payload: any){
        const deviceId = topic.split('/')[1]

        if(typeof payload.ok !== 'boolean'){
            this.logger.warn(`Malformed ACK from ${deviceId}`);
        }

        this.logger.log(`ACK from ${deviceId} -> ${payload.ok ? 'SUCCESS' : 'FAILED'}`)
    }

    private route(topic: string, message: string) {
        const parts = topic.split('/');

        if (parts.length < 3) return;

        const deviceId = parts[1];
        const type = parts[2];

        try {
            const payload = JSON.parse(message)

            if (type === 'telemetry') {
                this.handleTelemetry(deviceId, payload)
            }

            if (type === 'ack') {
                this.handleAck(deviceId, payload)
            }
        } catch (error) {
            this.logger.error('Invalid JSON Payload', error)
        }

    }

    publish(deviceId: string, payload: any) {
        this.client.publish(
            `iot/${deviceId}/cmd`,
            JSON.stringify(payload),
            { qos: 1 },
        )
    }
}

