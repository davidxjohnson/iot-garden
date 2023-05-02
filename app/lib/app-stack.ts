import * as cdk from 'aws-cdk-lib';
import * as iot from 'aws-cdk-lib/aws-iot';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface Config {
  thingName: string;
  attributePayload: {
    attributes: {
      temperatureRange: string;
      moistureRange: string;
      followSun: string;
    };
  };
}

export class AppStack extends cdk.Stack {
  //constructor(scope: Construct, id: string, props?: cdk.StackProps, thing?: iot.CfnThing) {
  constructor(scope: Construct, id: string, config: Config, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a new AWS IoT Thing using the props passed
    const thing = new iot.CfnThing(this, toPascalCase(config.thingName), {
      ...config
      // thingName: 'my-iot-garden-thing',
      // attributePayload: {
      //   attributes: {
      //     temperatureRange: "65,95",
      //     moistureRange: "50,80",
      //     followSun: "true"
      //   }
      // }
    });
    // console.info(thing);
    // new iot.CfnThing(this, 'MyIotThing', {
    //   ...config['things']
    // });
  }
}

function toPascalCase(s: string): string {
  return s
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}