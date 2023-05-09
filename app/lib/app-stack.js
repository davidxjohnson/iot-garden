"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IotGardenStack = void 0;
const cdk_iot_core_certificates_1 = require("cdk-iot-core-certificates");
const cdk = require("aws-cdk-lib");
class IotGardenStack extends cdk.Stack {
    constructor(scope, id, config, props) {
        super(scope, id, props);
        config['devices'].forEach((device) => {
            // Create a new AWS IoT Thing using the props passed
            // plus one additional one to specify the customerId
            device.attributePayload.attributes.customerId = config.customerId;
            const { thingArn, certId, certPem, privKey } = new cdk_iot_core_certificates_1.ThingWithCert(this, toPascalCase(device.thingName), {
                thingName: device.thingName,
                saveToParamStore: true,
                paramPrefix: 'devices',
            });
            // new iot.CfnThing(this, toPascalCase(device.thingName + 'Thing'), {
            //   ...device
            // });
        });
    }
}
exports.IotGardenStack = IotGardenStack;
function toPascalCase(s) {
    return s
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlFQUEwRDtBQUMxRCxtQ0FBbUM7QUF5Qm5DLE1BQWEsY0FBZSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzNDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsTUFBdUIsRUFBRSxLQUFzQjtRQUN2RixLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBc0IsRUFBRSxFQUFFO1lBQ25ELG9EQUFvRDtZQUNwRCxvREFBb0Q7WUFDcEQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUNsRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSx5Q0FBYSxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUNyRyxTQUFTLEVBQUUsTUFBTSxDQUFDLFNBQVM7Z0JBQzNCLGdCQUFnQixFQUFFLElBQUk7Z0JBQ3RCLFdBQVcsRUFBRSxTQUFTO2FBQ3ZCLENBQUMsQ0FBQztZQUNILHFFQUFxRTtZQUNyRSxjQUFjO1lBQ2QsTUFBTTtRQUNSLENBQUMsQ0FDQSxDQUFBO0lBQ0gsQ0FBQztDQUNGO0FBbkJELHdDQW1CQztBQUVELFNBQVMsWUFBWSxDQUFDLENBQVM7SUFDN0IsT0FBTyxDQUFDO1NBQ0wsS0FBSyxDQUFDLEdBQUcsQ0FBQztTQUNWLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzNELElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNkLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUaGluZ1dpdGhDZXJ0IH0gZnJvbSAnY2RrLWlvdC1jb3JlLWNlcnRpZmljYXRlcyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgaW90IGZyb20gJ2F3cy1jZGstbGliL2F3cy1pb3QnO1xuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICdAYXdzLWNkay9hd3MtaW90LWFjdGlvbnMnXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbi8vIGltcG9ydCAqIGFzIHNxcyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3FzJztcblxuaW50ZXJmYWNlIElvVEdhcmRlblRoaW5nIHtcbiAgdGhpbmdOYW1lOiBzdHJpbmc7XG4gIGF0dHJpYnV0ZVBheWxvYWQ6IHtcbiAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICBtY3U6IHN0cmluZztcbiAgICAgIG1hYzogc3RyaW5nO1xuICAgICAgLy8gdGhlIGFib3ZlIGF0dHJpYnV0ZXMgY29tZSBmcm9tIHRoZSBjb25maWcgZmlsZVxuICAgICAgLy8gdGhlIGZvbGxvd2luZyBhcmUgYWRkZWQgYnkgdGhlIGFwcFxuICAgICAgY3VzdG9tZXJJZDogc3RyaW5nO1xuICAgIH07XG4gIH07XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW90R2FyZGVuQ29uZmlnIHtcbiAgY3VzdG9tZXJJZDogc3RyaW5nO1xuICBzdGFja05hbWU6IHN0cmluZztcbiAgZGV2aWNlczogSW9UR2FyZGVuVGhpbmdbXTtcbn1cblxuZXhwb3J0IGNsYXNzIElvdEdhcmRlblN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgY29uZmlnOiBJb3RHYXJkZW5Db25maWcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbmZpZ1snZGV2aWNlcyddLmZvckVhY2goKGRldmljZTogSW9UR2FyZGVuVGhpbmcpID0+IHtcbiAgICAgIC8vIENyZWF0ZSBhIG5ldyBBV1MgSW9UIFRoaW5nIHVzaW5nIHRoZSBwcm9wcyBwYXNzZWRcbiAgICAgIC8vIHBsdXMgb25lIGFkZGl0aW9uYWwgb25lIHRvIHNwZWNpZnkgdGhlIGN1c3RvbWVySWRcbiAgICAgIGRldmljZS5hdHRyaWJ1dGVQYXlsb2FkLmF0dHJpYnV0ZXMuY3VzdG9tZXJJZCA9IGNvbmZpZy5jdXN0b21lcklkO1xuICAgICAgY29uc3QgeyB0aGluZ0FybiwgY2VydElkLCBjZXJ0UGVtLCBwcml2S2V5IH0gPSBuZXcgVGhpbmdXaXRoQ2VydCh0aGlzLCB0b1Bhc2NhbENhc2UoZGV2aWNlLnRoaW5nTmFtZSksIHtcbiAgICAgICAgdGhpbmdOYW1lOiBkZXZpY2UudGhpbmdOYW1lLFxuICAgICAgICBzYXZlVG9QYXJhbVN0b3JlOiB0cnVlLFxuICAgICAgICBwYXJhbVByZWZpeDogJ2RldmljZXMnLFxuICAgICAgfSk7XG4gICAgICAvLyBuZXcgaW90LkNmblRoaW5nKHRoaXMsIHRvUGFzY2FsQ2FzZShkZXZpY2UudGhpbmdOYW1lICsgJ1RoaW5nJyksIHtcbiAgICAgIC8vICAgLi4uZGV2aWNlXG4gICAgICAvLyB9KTtcbiAgICB9XG4gICAgKVxuICB9XG59XG5cbmZ1bmN0aW9uIHRvUGFzY2FsQ2FzZShzOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc1xuICAgIC5zcGxpdCgnLScpXG4gICAgLm1hcCgod29yZCkgPT4gd29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHdvcmQuc2xpY2UoMSkpXG4gICAgLmpvaW4oJycpO1xufSJdfQ==