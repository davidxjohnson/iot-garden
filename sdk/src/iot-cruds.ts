// all functions herein assume the aws context is set before calling. 

import {
    IoTClient,
    SearchIndexCommand,
    CreateThingGroupCommand,
    ThingGroupProperties
    // CreatePolicyCommand
} from '@aws-sdk/client-iot';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import {
    STSClient,
    GetCallerIdentityCommand
} from '@aws-sdk/client-sts';

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

export async function createThingGroup(customerId: string, thingGroupPrefix: string, region?: string): Promise<string> {
    // Set up IoT client with AWS region
    if (typeof (region) === 'undefined') {
        region = await discoverDefaultRegion()
    };
    const thingGroupName = thingGroupPrefix + '-' + customerId;
    const iotClient = new IoTClient({ region: region });

    // Create the thing group
    const thingGroupProperties: ThingGroupProperties = {
        attributePayload: {
            attributes: {
                customerId: customerId
            }
        },
        thingGroupDescription: 'Thing group for customer ' + customerId + "."
    }
    const command = new CreateThingGroupCommand({
        thingGroupName: thingGroupName,
        thingGroupProperties: thingGroupProperties,
        tags: [{ Key: 'customerId', Value: customerId }]
    });

    const response = await iotClient.send(command);
    iotClient.destroy();
    return response.thingGroupArn ?? '';
}

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

export async function createPolicyDocument(customerId: string, region?: string, account?: string): Promise<string> {
    if (typeof (region) === 'undefined') {
        region = await discoverDefaultRegion()
    };
    if (typeof (account) === 'undefined') {
        account = await discoverDefaultAccount()
    };
    const policyDocument = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "iot:Connect",
                    "iot:Publish",
                    "iot:Subscribe",
                    "iot:Receive"
                ],
                "Resource": "arn:aws:iot:" + region + ":" + account + ":topic/" + customerId,
                "Condition": {
                    "StringEquals": {
                        "iot:Connection.Thing.Attributes[customerId]": customerId
                    }
                }
            }
        ]
    };
    return JSON.stringify(policyDocument);
}
//     // Set up IoT client with AWS region
//     const iotClient = new IoTClient({ region: region });

//     // Create the policy
//     const command = new CreatePolicyCommand({
//         policyDocument,
//         policyName
//     });
//     await iotClient.send(command);
// }