import {
    queryThings,
    createPolicyDocument,
    createThingGroup
} from "./iot-cruds.js";

const things = await queryThings('attributes.customerId:123456789012')
    .catch((err) => {
        console.info("queryThings returned error:", err);
        process.exit(1);
    });
console.info("queryThings returned:", things);

const policyDocument = await createPolicyDocument('123456789012')
    .catch((err) => {
        console.info("createPolicyDocument returned error:", err);
        process.exit(1);
    });
console.info("createPolicyDocument returned:", policyDocument);

const thingGroupArn = await createThingGroup('123456789012', 'iot-garden')
    .catch((err) => {
        console.info("createThingGroup returned error:", err);
        process.exit(1);
    });
console.info("createThingGroup returned:", thingGroupArn)

    // Specify the policy name and document
// const policyName = 'test';
// const policyDocument = {};

// // Create the policy using the IoT client
// const createPolicyInput = {
//     policyName: policyName,
//     policyDocument: JSON.stringify(policyDocument)
// };
// const createPolicyCommand = new CreatePolicyCommand(createPolicyInput);
// const createPolicyResponse = await iotClient.send(createPolicyCommand)
//     .catch((err) => {
//         console.error(err);
//         // process.exit(1);
//     });

// console.info("create policy returned:", createPolicyResponse);

// // list policies using the IoT client
// const listPoliciesInput = {
//     marker: "",
//     pageSize: Number("20"),
//     ascendingOrder: true
// };
// const listPoliciesCommand = new ListPoliciesCommand(listPoliciesInput);
// const listPoliciesResponse = await iotClient.send(listPoliciesCommand)
//     .catch((err) => {
//         console.error(err);
//         process.exit(1);
//     });

// console.info("list policies returned:", listPoliciesResponse);

// // attach policy to principal
// const attachPolicyInput = {
//     policyName: policyName, // required
//     target: "arn:aws:iot:us-east-2:836801583228:cert/c8d1aba90288e49f1c5dbb57bc9b82d601ab09204180e9a875bd7a4ba4d7d994" // required
// };
// const attachPolicyCommand = new AttachPolicyCommand(attachPolicyInput);
// const attachPolicyResponse = await iotClient.send(attachPolicyCommand)
//     .catch((err) => {
//         console.error(err);
//         process.exit(1);
//     });

// console.info("policy attached returned:", attachPolicyResponse);

// // delete a policy using the IoT client
// const deletePolicyInput = {
//     policyName: policyName,
//     policyDocument: JSON.stringify(policyDocument)
// };
// const deleteCommand = new DeletePolicyCommand(deletePolicyInput);
// const deleteResponse = await iotClient.send(deleteCommand)
//     .then()
//     .catch((err) => {
//         console.error(err);
//         process.exit(1);
//     });

// console.info("delete policy returned:", deleteResponse);

