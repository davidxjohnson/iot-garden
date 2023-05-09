"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// asset-input/node_modules/cdk-iot-core-certificates/lib/lambda/util/iot.js
var require_iot = __commonJS({
  "asset-input/node_modules/cdk-iot-core-certificates/lib/lambda/util/iot.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getCertIdFromARN = void 0;
    exports2.getCertIdFromARN = (arn) => {
      return arn.split("/")[1];
    };
  }
});

// asset-input/node_modules/cdk-iot-core-certificates/lib/lambda/adapters/iot.js
var require_iot2 = __commonJS({
  "asset-input/node_modules/cdk-iot-core-certificates/lib/lambda/adapters/iot.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.iotAdaptor = void 0;
    var iot_12 = require_iot();
    exports2.iotAdaptor = (iot) => {
      return {
        createThing: async (thingRequest) => {
          return iot.createThing(thingRequest).promise();
        },
        createKeysAndCertificates: async () => {
          return iot.createKeysAndCertificate({
            setAsActive: true
          }).promise();
        },
        createPolicy: async (thingName) => {
          return iot.createPolicy({
            policyName: thingName,
            policyDocument: policyDoc
          }).promise();
        },
        attachPrincipalPolicy: async (props) => {
          await iot.attachPrincipalPolicy(props).promise();
        },
        attachThingPrincipal: async (props) => {
          return iot.attachThingPrincipal(props).promise();
        },
        listThingPrincipals: async (thingName) => {
          return iot.listThingPrincipals({
            thingName
          }).promise();
        },
        detachPrincipalPolicy: async (props) => {
          await iot.detachPrincipalPolicy(props).promise();
        },
        detachThingPrincipal: async (props) => {
          return iot.detachThingPrincipal(props).promise();
        },
        updateCertificateToInactive: async (certArn) => {
          await iot.updateCertificate({
            certificateId: iot_12.getCertIdFromARN(certArn),
            newStatus: "INACTIVE"
          }).promise();
        },
        deleteCertificate: async (certArn) => {
          await iot.deleteCertificate({
            certificateId: iot_12.getCertIdFromARN(certArn)
          }).promise();
        },
        deletePolicy: async (policyName) => {
          await iot.deletePolicy({
            policyName
          }).promise();
        },
        deleteThing: async (thingName) => {
          await iot.deleteThing({
            thingName
          }).promise();
        }
      };
    };
    var policyDoc = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iot:Publish",
        "iot:Subscribe",
        "iot:Connect",
        "iot:Receive"
      ],
      "Resource": [
        "*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iot:GetThingShadow",
        "iot:UpdateThingShadow",
        "iot:DeleteThingShadow"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}`;
  }
});

// asset-input/node_modules/cdk-iot-core-certificates/lib/lambda/adapters/thing.js
var require_thing = __commonJS({
  "asset-input/node_modules/cdk-iot-core-certificates/lib/lambda/adapters/thing.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.thingAdaptor = void 0;
    exports2.thingAdaptor = (iotAdaptor) => {
      return {
        create: async (thingName) => {
          const { thingArn } = await iotAdaptor.createThing({
            thingName
          });
          console.info(`Thing created with ARN: ${thingArn}`);
          const { certificateId, certificateArn, certificatePem, keyPair } = await iotAdaptor.createKeysAndCertificates();
          const { PrivateKey } = keyPair;
          const { policyArn } = await iotAdaptor.createPolicy(thingName);
          console.info(`Policy created with ARN: ${policyArn}`);
          await iotAdaptor.attachPrincipalPolicy({
            policyName: thingName,
            principal: certificateArn
          });
          console.info("Policy attached to certificate");
          await iotAdaptor.attachThingPrincipal({
            principal: certificateArn,
            thingName
          });
          console.info("Certificate attached to thing");
          return {
            certId: certificateId,
            certPem: certificatePem,
            privKey: PrivateKey,
            thingArn
          };
        },
        delete: async (thingName) => {
          const { principals } = await iotAdaptor.listThingPrincipals(thingName);
          for await (const certificateArn of principals) {
            await iotAdaptor.detachPrincipalPolicy({
              policyName: thingName,
              principal: certificateArn
            });
            console.info(`Policy detached from certificate for ${thingName}`);
            await iotAdaptor.detachThingPrincipal({
              principal: certificateArn,
              thingName
            });
            console.info(`Certificate detached from thing for ${certificateArn}`);
            await iotAdaptor.updateCertificateToInactive(certificateArn);
            console.info(`Certificate marked as inactive for ${certificateArn}`);
            await iotAdaptor.deleteCertificate(certificateArn);
            console.info(`Certificate deleted from thing for ${certificateArn}`);
            await iotAdaptor.deleteThing(thingName);
            console.info(`Thing deleted with name: ${thingName}`);
          }
          await iotAdaptor.deletePolicy(thingName);
          console.info(`Policy deleted: ${thingName}`);
        }
      };
    };
  }
});

// asset-input/node_modules/cdk-iot-core-certificates/lib/lambda/index.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var aws_sdk_1 = require("aws-sdk");
var iot_1 = require_iot2();
var thing_1 = require_thing();
var thingHandler = thing_1.thingAdaptor(iot_1.iotAdaptor(new aws_sdk_1.Iot()));
exports.handler = async (event) => {
  const { RequestType, LogicalResourceId, RequestId, StackId } = event;
  try {
    const thingName = event.ResourceProperties.ThingName;
    if (RequestType === "Create") {
      const { thingArn, certId, certPem, privKey } = await thingHandler.create(thingName);
      return {
        Status: "SUCCESS",
        PhysicalResourceId: thingArn,
        LogicalResourceId,
        RequestId,
        StackId,
        Data: {
          thingArn,
          certId,
          certPem,
          privKey
        }
      };
    } else if (event.RequestType === "Delete") {
      await thingHandler.delete(thingName);
      return {
        Status: "SUCCESS",
        PhysicalResourceId: event.PhysicalResourceId,
        LogicalResourceId,
        RequestId,
        StackId
      };
    } else if (event.RequestType === "Update") {
      return {
        Status: "SUCCESS",
        PhysicalResourceId: event.PhysicalResourceId,
        LogicalResourceId,
        RequestId,
        StackId
      };
    } else {
      throw new Error("Received invalid request type");
    }
  } catch (err) {
    const Reason = err.message;
    return {
      Status: "FAILED",
      Reason,
      RequestId,
      StackId,
      LogicalResourceId,
      // @ts-ignore
      PhysicalResourceId: event.PhysicalResourceId || LogicalResourceId
    };
  }
};
