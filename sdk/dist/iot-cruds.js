// all functions herein assume the aws context is set before calling. 
import { IoTClient, SearchIndexCommand } from '@aws-sdk/client-iot';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';
// import {
//     IoTClient,
//     DeletePolicyCommand,
//     CreatePolicyCommand,
//     AttachPolicyCommand,
//     ListPoliciesCommand
// } from "@aws-sdk/client-iot";
// the defaultRegion function is used for cases where the region is required  
export async function discoverDefaultAccount() {
    var _a;
    const stsClient = new STSClient({ credentials: defaultProvider({ profile: 'default' }) });
    // Get the caller identity to retrieve the account ID
    const command = new GetCallerIdentityCommand({});
    const response = await stsClient.send(command);
    stsClient.destroy();
    return (_a = response.Account) !== null && _a !== void 0 ? _a : '';
}
// the defaultRegion function is used for cases where the region is required  
export async function discoverDefaultRegion() {
    const iotClient = new IoTClient({});
    const region = await iotClient.config.region();
    iotClient.destroy();
    // console.info(`default account is ${await discoverDefaultAccount() ?? ''}`);
    return region;
}
;
export async function queryThings(queryString, region) {
    var _a, _b;
    // Query the index using the IoT client
    if (typeof (region) === 'undefined') {
        region = await discoverDefaultRegion();
    }
    ;
    const indexName = 'AWS_Things';
    const command = new SearchIndexCommand({
        indexName,
        queryString: `${queryString}`
    });
    const iotClient = new IoTClient({ region: region });
    const response = await iotClient.send(command);
    const things = (_b = (_a = response.things) === null || _a === void 0 ? void 0 : _a.map(thing => thing.thingName)) !== null && _b !== void 0 ? _b : [];
    iotClient.destroy();
    return things;
}
