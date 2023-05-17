import { Command } from 'commander';
import {
    discoverDefaultRegion,
    discoverDefaultAccount,
    queryThings,
    createPolicy,
    createThingGroup,
    createThing,
    addThingToGroup,
    attachPolicy,
    createCertificate
} from "./iot-cruds.js";

const flags: Command = new Command()
    .option('-c, --customerId <customerId>', 'Customer ID', '123456789012')
    .option('-n, --namePrefix <namePrefix>', 'Name Prefix', 'iot-garden')
    .showHelpAfterError()
    .parse()

// resource names
const customerId = flags.opts()['customerId'];
const namePrefix = flags.opts()['namePrefix'];
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
console.info("List of things:", things);


const thingGroup = await createThingGroup(customerId, groupName, region)
    .catch((err) => {
        console.info("createThingGroup returned error:", err);
        process.exit(1);
    });
switch (thingGroup.$metadata.httpStatusCode) {
    case 200:
        console.info("thingGroup " + groupName + " already exists.")
        break;
    case 201:
        console.info("thingGroup " + groupName + " created.")
        break
};
const thingGroupArn = thingGroup.thingGroupArn ?? '';

const policy = await createPolicy(customerId, policyName, region, account)
    .catch((err) => {
        console.info("createPolicy returned error:", err);
        process.exit(1);
    });
switch (policy.$metadata.httpStatusCode) {
    case 200:
        console.info("thingPolicy " + policyName + " already exists.")
        break;
    case 201:
        console.info("thingPolicy " + thingName + " created.")
        break
};
// const policyArn = policy.policyArn ?? '';

await attachPolicy(policyName, thingGroupArn, region)
    .catch((err) => {
        console.info("attachPolicy returned error:", err);
        process.exit(1);
    });
console.info("attachPolicy: " + policyName + " attached to group " + groupName)

const thing = await createThing(customerId, thingName, region)
    .catch((err) => {
        console.info("createThing returned error:", err);
        process.exit(1);
    });
switch (thing.$metadata.httpStatusCode) {
    case 200:
        console.info("thing " + thingName + " already exists.")
        break;
    case 201:
        console.info("thing " + thingName + " created.")
        break
}
const thingArn = thing.thingArn ?? '';

await addThingToGroup(thingArn, thingGroupArn, region)
    .catch((err: any) => {
        console.info("addThingToThingGroup returned error:", err);
        process.exit(1);
    });
console.info("thing " + thingName + " joined to group " + groupName)

const certArn = await createCertificate(`/${namePrefix}/${customerId}/`, region)
    .catch((err) => {
        console.info("getCertArn returned error:", err);
        process.exit(1);
    });
console.info(`createCertificate returned: ${certArn}`);