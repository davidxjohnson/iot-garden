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
export async function discoverDefaultAccount(): Promise<string> {
    const stsClient = new STSClient({ credentials: defaultProvider({ profile: 'default' }) });

    // Get the caller identity to retrieve the account ID
    const command = new GetCallerIdentityCommand({});
    const response = await stsClient.send(command);
    stsClient.destroy();
    return response.Account ?? '';
}

// the defaultRegion function is used for cases where the region is required  
export async function discoverDefaultRegion(): Promise<string> {
    const iotClient = new IoTClient({});
    const region = await iotClient.config.region();
    iotClient.destroy();
    // console.info(`default account is ${await discoverDefaultAccount() ?? ''}`);
    return region;
};

export async function queryThings(queryString: string, region?: string): Promise<string[]> {
    // Query the index using the IoT client
    if (typeof (region) === 'undefined') {
        region = await discoverDefaultRegion()
    };
    const indexName = 'AWS_Things';
    const command = new SearchIndexCommand({
        indexName,
        queryString: `${queryString}`
    });
    const iotClient = new IoTClient({ region: region });
    const response = await iotClient.send(command);
    const things = response.things?.map(thing => thing.thingName) ?? [];
    iotClient.destroy();
    return things as string[];
}

