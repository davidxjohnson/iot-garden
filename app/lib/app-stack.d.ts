import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
interface IoTGardenThing {
    thingName: string;
    attributePayload: {
        attributes: {
            mcu: string;
            mac: string;
            customerId: string;
        };
    };
}
export interface IotGardenConfig {
    customerId: string;
    stackName: string;
    devices: IoTGardenThing[];
}
export declare class IotGardenStack extends cdk.Stack {
    constructor(scope: Construct, id: string, config: IotGardenConfig, props?: cdk.StackProps);
}
export {};
