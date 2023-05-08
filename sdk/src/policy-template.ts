// export async function createPolicy(policyName: string, account: string, customerId: string): Promise<void> {
//     const policyDocument = {
//         "Version": "2012-10-17",
//         "Statement": [
//             {
//                 "Effect": "Allow",
//                 "Action": [
//                     "iot:Connect",
//                     "iot:Publish",
//                     "iot:Subscribe",
//                     "iot:Receive"
//                 ],
//                 "Resource": "arn:aws:iot:us-east-2:836801583228:topic//*",
//                 "Condition": {
//                     "StringEquals": {
//                         "iot:Connection.Thing.Attributes[customerId]": "123456789012"
//                     }
//                 }
//             }
//         ]
//     };
//     // Set up IoT client with AWS region
//     const iotClient = new IoTClient({});

//     // Create the policy
//     const command = new CreatePolicyCommand({
//         policyDocument,
//         policyName
//     });
//     await iotClient.send(command);
// }