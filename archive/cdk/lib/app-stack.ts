import { ThingWithCert } from 'cdk-iot-core-certificates';
import * as cdk from 'aws-cdk-lib';
import * as iot from 'aws-cdk-lib/aws-iot';
import * as actions from '@aws-cdk/aws-iot-actions'
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface IoTGardenThing {
  thingName: string;
  attributePayload: {
    attributes: {
      mcu: string;
      mac: string;
      // the above attributes come from the config file
      // the following are added by the app
      customerId: string;
    };
  };
}

export interface IotGardenConfig {
  customerId: string;
  stackName: string;
  devices: IoTGardenThing[];
}

export class IotGardenStack extends cdk.Stack {
  constructor(scope: Construct, id: string, config: IotGardenConfig, props?: cdk.StackProps) {
    super(scope, id, props);

    config['devices'].forEach((device: IoTGardenThing) => {
      // Create a new AWS IoT Thing using the props passed
      // plus one additional one to specify the customerId
      device.attributePayload.attributes.customerId = config.customerId;
      const { thingArn, certId, certPem, privKey } = new ThingWithCert(this, toPascalCase(device.thingName), {
        thingName: device.thingName,
        saveToParamStore: true,
        paramPrefix: 'devices',
      });
      // new iot.CfnThing(this, toPascalCase(device.thingName + 'Thing'), {
      //   ...device
      // });
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