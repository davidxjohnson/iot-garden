# iot-garden
(Code, wiki, project board and diagrams for an IOT-based automated garden.)

**Progress:**
* May - researching how to use the AWS IoT SDK to create a stack, learning what is required to securely register a device and send telemetry to the cloud. Good success creating a stack using SDK - i.e. thing, thing group, authentication with certificates, security policy, creation of certificates, securely storing certificats etc.  
* April - prototype device and sketch for ESP32, research into hosting on AWS IoT, exploring CDK for IoT stack creation, abandoned CDK approach as it has limitations that aren't present in the SDK or CLI. Hosting on AWS looks promising, but just not with CDK.

**Directory Structure:**
* The [/sdk](/sdk) directory contains TypeScript code based on AWS IoT SDK. This is designed to create or delete  a "stack" for a given customer ID.
* The [/sketch](/sketch) directory contains the IoT device code (C++).
* The [/archive/cdk](/archive/cdk) directory is a failed attempt to use AWS CDK to create/destroy a customer stack. It's a real disapoinment because it had potential to do this with relative ease (based on CloudFormation). Unfortunately, I kept running into problems with the CDK, mostly related to CloudFormation - i.e. is CF doesn't do it, neither does CDK (without creating something custom).