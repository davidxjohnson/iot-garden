// all functions herein assume the aws context is set before calling. 

import {
    IoTClient,
    SearchIndexCommand,
    CreateThingGroupCommand, CreateThingGroupCommandOutput, ThingGroupProperties,
    CreateThingCommand, CreateThingCommandOutput,
    AddThingToThingGroupCommand, AddThingToThingGroupCommandOutput,
    DescribeThingGroupCommand, DescribeThingGroupCommandOutput,
    DescribeThingCommand, DescribeThingCommandOutput,
    GetPolicyCommand, GetPolicyCommandOutput,
    CreatePolicyCommand, CreatePolicyCommandOutput,
    AttachPolicyCommand, AttachPolicyCommandInput, AttachPolicyCommandOutput,
    CreateKeysAndCertificateCommand, CreateKeysAndCertificateCommandOutput
} from '@aws-sdk/client-iot';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import {
    STSClient,
    GetCallerIdentityCommand
} from '@aws-sdk/client-sts';
import {
    SSMClient,
    GetParameterCommand, GetParameterCommandOutput,
    PutParameterCommand, PutParameterCommandOutput
} from '@aws-sdk/client-ssm';
// import { stringify } from 'querystring';
// import { error } from 'console';

// the defaultRegion function is used for cases where the region is required  
export async function discoverDefaultAccount(): Promise<string> {
    // Get the caller identity to retrieve the account ID
    const command = new GetCallerIdentityCommand({});
    const stsClient = new STSClient({ credentials: defaultProvider({ profile: 'default' }) });
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

async function checkCertExists(parameterName: string, region: string): Promise<GetParameterCommandOutput | void> {
    const ssmClient = new SSMClient({ region: region }); // Replace with your desired region
    const command = new GetParameterCommand({ Name: parameterName, WithDecryption: true });
    const response = await ssmClient.send(command)
        .catch((err) => {
            if (err.name !== 'ParameterNotFound') {
                ssmClient.destroy();
                throw err; // Certificate does not exist
            }
        });
    ssmClient.destroy();
    return response;
};

// function to return the certificate ARN from parameter store, or by creating a new iot certificate
// and storing the certificate information in parameter store. Either way, a certificate ARN is returned.
export async function createCertificate(paramPath: string, region: string): Promise<string> {
    // using a naming convention for the parameter name
    const certParam: void | GetParameterCommandOutput =
        await checkCertExists(`${paramPath}certificateArn`, region)
    if (certParam !== undefined) {
        // certificate arn found in parameter store
        return certParam?.Parameter?.Value ?? '';
    };
    // Create a certificate
    const iotClient = new IoTClient({ region: region });
    const response: CreateKeysAndCertificateCommandOutput =
        await iotClient
            .send(new CreateKeysAndCertificateCommand({ setAsActive: true, }));
    iotClient.destroy();
    const certificateArn = response.certificateArn ?? '';
    const certificatePem = response.certificatePem ?? '';
    const publicKey = response.keyPair?.PublicKey ?? '';
    const privateKey = response.keyPair?.PrivateKey ?? '';
    putInParameterStore(`${paramPath}certificateArn`, certificateArn, region);
    putInParameterStore(`${paramPath}certificatePem`, certificatePem, region);
    putInParameterStore(`${paramPath}publicKey`, publicKey, region);
    putInParameterStore(`${paramPath}privateKey`, privateKey, region);
    // console.log(certificateArn);
    // console.log(certificatePem);
    // console.log(keyPair.publicKey);
    // console.log(keyPair.privateKey);
    // store certificate information in parameter store
    return certificateArn;
}

async function putInParameterStore(parameterName: string, parameterValue: string, region: string): Promise<PutParameterCommandOutput> {
    const putParameterCommand = new PutParameterCommand({
        Name: parameterName,
        Value: parameterValue,
        Type: "SecureString",
        Overwrite: true
    });
    const ssmClient = new SSMClient({ region: region });
    const response: PutParameterCommandOutput =
        await ssmClient.send(putParameterCommand);
    return response
}

export async function addThingToGroup(thingArn: string, thingGroupArn: string, region: string): Promise<AddThingToThingGroupCommandOutput> {
    // Add the thing to the thing group
    const command = new AddThingToThingGroupCommand({
        thingGroupArn: thingGroupArn,
        thingArn: thingArn,
        overrideDynamicGroups: false
    });
    const iotClient = new IoTClient({ region: region });
    const response: AddThingToThingGroupCommandOutput = await iotClient.send(command);
    iotClient.destroy();
    return response
}

export async function describeThing(thingName: string, region: string): Promise<DescribeThingCommandOutput> {
    // return arn of a thing group with a given name
    const input = {
        thingName: thingName, // required
    };
    const iotClient = new IoTClient({ region: region });
    const response: DescribeThingCommandOutput = await iotClient.send(new DescribeThingCommand(input));
    return response;
}

export async function createThing(customerId: string, thingName: string, region: string): Promise<DescribeThingCommandOutput> {
    // check if thing group exists and return data if it does
    const thingExists = await describeThing(thingName, region)
        .catch((error) => {
            if (error.name !== 'ResourceNotFoundException') {
                throw error;
            }
        });
    if (thingExists !== undefined) {
        return thingExists // resource exists, return description
    }
    // Create the thing
    const command = new CreateThingCommand({
        thingName: thingName,
        attributePayload: {
            attributes: {
                customerId: customerId
            }
        }
        // tags: [{ Key: 'customerId', Value: customerId }] // tags aren't available for things
    });

    // Set up IoT client with AWS region
    const iotClient = new IoTClient({ region: region });
    const response: CreateThingCommandOutput = await iotClient.send(command);
    iotClient.destroy();
    response.$metadata.httpStatusCode = 201;
    return response ?? '';
}

export async function describeThingGroup(thingGroupName: string, region: string): Promise<DescribeThingGroupCommandOutput> {
    // return arn of a thing group with a given name
    const input = {
        thingGroupName: thingGroupName, // required
    };
    const iotClient = new IoTClient({ region: region });
    const response: DescribeThingGroupCommandOutput = await iotClient.send(new DescribeThingGroupCommand(input));
    return response;
}

export async function getPolicy(policyName: string, region: string): Promise<GetPolicyCommandOutput> {
    // Describe a policy with a given name
    const input = {
        policyName: policyName, // required
    };

    const iotClient = new IoTClient({ region: region });
    const response: GetPolicyCommandOutput = await iotClient.send(new GetPolicyCommand(input));
    return response;
}

export async function createThingGroup(customerId: string, thingGroupName: string, region: string): Promise<CreateThingGroupCommandOutput> {
    // check if thing group exists and return data if it does
    const groupExists = await describeThingGroup(thingGroupName, region)
        .catch((error) => {
            if (error.name !== 'ResourceNotFoundException') {
                throw error;
            }
        });
    if (groupExists !== undefined) {
        return groupExists // resource exists, return description
    }
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

    // Set up IoT client with AWS region
    const iotClient = new IoTClient({ region: region });
    let response: CreateThingGroupCommandOutput = await iotClient.send(command);
    iotClient.destroy();
    response.$metadata.httpStatusCode = 201;
    return response
}

export async function queryThings(queryString: string, region: string): Promise<string[]> {
    // Query the index using the IoT client
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

export async function createPolicy(customerId: string, policyName: string, region: string, account: string): Promise<CreatePolicyCommandOutput> {
    // check if thing group exists and return data if it does
    const policyExists = await getPolicy(policyName, region)
        .catch((error) => {
            if (error.name !== 'ResourceNotFoundException') {
                throw error;
            }
        });
    if (policyExists !== undefined) {
        return policyExists // resource exists, return description
    }
    // create a policy
    const policyDocument = await createPolicyDocument(customerId, region, account);
    const input = {
        policyName: policyName, // required
        policyDocument: policyDocument, // required
        tags: [ // TagList
            { // Tag
                Key: "customerId",
                Value: customerId,
            },
        ]
    }
    const command = new CreatePolicyCommand(input);
    const iotClient = new IoTClient({ region: region });
    const response = await iotClient.send(command);
    iotClient.destroy();
    response.$metadata.httpStatusCode = 201;
    return response;
}
// creates a custom policy document based on customerId
export async function createPolicyDocument(customerId: string, region: string, account: string): Promise<string> {
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

// attaches a policy to a thingGroup (or other identity)
export async function attachPolicy(policyName: string, targetArn: string, region: string): Promise<AttachPolicyCommandOutput> {
    const input: AttachPolicyCommandInput = { // AttachPolicyRequest
        policyName: policyName, // required
        target: targetArn, // required
    };
    const iotClient = new IoTClient({ region: region });
    const response: AttachPolicyCommandOutput = await iotClient.send(new AttachPolicyCommand(input));
    iotClient.destroy();
    return response;
}
