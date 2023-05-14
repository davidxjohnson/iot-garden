import {
    discoverDefaultRegion,
    discoverDefaultAccount,
    queryThings,
    createPolicy,
    createThingGroup,
    createThing,
    addThingToThingGroup,
    attachPolicy
} from "./iot-cruds.js";

// resource names
const customerId = '123456789012';
const namePrefix = 'iot-garden';
const thingQuery = 'thingName:' + namePrefix + '-*';
const groupName = namePrefix + '-group-' + customerId;
const thingName = namePrefix + '-thing-' + customerId + '-001';
const policyName = namePrefix + '-policy-' + customerId;

// Set up IoT client with AWS region
let region, account = undefined;
if (typeof (region) === 'undefined') {
    region = await discoverDefaultRegion()
};
if (typeof (account) === 'undefined') {
    account = await discoverDefaultAccount()
};

const things = await queryThings(thingQuery, region)
    .catch((err) => {
        console.info("queryThings returned error:", err);
        process.exit(1);
    });
console.info("queryThings returned:", things);

const thingGroup = await createThingGroup(customerId, groupName, region)
    .catch((err) => {
        console.info("createThingGroup returned error:", err);
        process.exit(1);
    });
if (thingGroup.$metadata.httpStatusCode === 200) {
    console.info("thingGroup " + groupName + " exists.")
};
const thingGroupArn = thingGroup.thingGroupArn ?? '';
console.info("thingGroupArn:", thingGroupArn)

const thing = await createThing(customerId, thingName, region)
    .catch((err) => {
        console.info("createThing returned error:", err);
        process.exit(1);
    });
if (thing.$metadata.httpStatusCode === 200) {
    console.info("thing " + thingName + " exists.")
};
const thingArn = thing.thingArn ?? '';
console.info("thingArn:", thingArn)

let policy = await createPolicy(customerId, policyName, region, account)
    .catch((err) => {
        console.info("createPolicy returned error:", err);
        process.exit(1);
    });
if (policy.$metadata.httpStatusCode === 200) {
    console.info("policy " + policyName + " exists.")
};
const policyArn = policy.policyArn ?? '';
console.info("createPolicy returned:", policyArn);

await attachPolicy(policyName, thingGroupArn, region)
    .catch((err) => {
        console.info("attachPolicy returned error:", err);
        process.exit(1);
    });
console.info("attachPolicy: " + policyArn + " added to " + thingGroupArn);

await addThingToThingGroup(thingArn, thingGroupArn, region)
    .catch((err) => {
        console.info("addThingToThingGroup returned error:", err);
        process.exit(1);
    });
console.info("addThingToThingGroup: thing " + thingArn + " added to group " + thingGroupArn);