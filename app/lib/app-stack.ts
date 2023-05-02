import * as cdk from 'aws-cdk-lib';
import * as iot from 'aws-cdk-lib/aws-iot';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface IoTGardenDevice {
  thingName: string;
  attributePayload: {
    attributes: {
      temperatureRange: string;
      moistureRange: string;
      followSun: string;
    };
  };
}

export interface Config {
  devices: IoTGardenDevice[];
}

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, config: Config, props?: cdk.StackProps) {
    super(scope, id, props);

    config.devices.forEach((device: IoTGardenDevice) => {
      // Create a new AWS IoT Thing using the props passed
      new iot.CfnThing(this, toPascalCase(device.thingName), {
        ...device
      });
    }
    )
  }
}

function toPascalCase(s: string): string {
  return s
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}