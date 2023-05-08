import { IoTClient, SearchIndexCommand } from '@aws-sdk/client-iot';
export async function queryThings(queryString) {
    var _a, _b;
    // Set up IoT client with AWS region
    const iotClient = new IoTClient({});
    // Specify the index name
    const indexName = 'AWS_Things';
    // Query the index using the IoT client
    const command = new SearchIndexCommand({
        indexName,
        queryString: `${queryString}`
    });
    const response = await iotClient.send(command);
    const things = (_b = (_a = response.things) === null || _a === void 0 ? void 0 : _a.map(thing => thing.thingName)) !== null && _b !== void 0 ? _b : [];
    return things;
}
