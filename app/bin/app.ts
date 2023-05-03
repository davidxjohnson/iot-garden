#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import Ajv from 'ajv';
var fs = require('fs');
import { Command } from 'commander';
import { IotGardenConfig, IotGardenStack } from '../lib/app-stack';

const flags: Command = new Command();
flags
  .option('-c --config <string>', 'The configuration file to use.', './config/config.json')
  .option('-s --schema <string>', 'The config schema check file to use.', './config/config-schema.json')
  .showHelpAfterError()
  .parse();
const configFile: string = flags.opts()['config'];
const schemaFile: string = flags.opts()['schema'];

// Load the configuration file and config schema file
const config: IotGardenConfig = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
const configSchema = JSON.parse(fs.readFileSync(schemaFile, 'utf-8'));

// Create a new instance of the Ajv validator
// Validate the configuration file against the JSON schema
const ajv = new Ajv();
const validate = ajv.compile(configSchema);
const isValid = validate(config);
if (!isValid) {
  console.error('Invalid configuration file:', configFile, validate.errors);
  process.exit(1);
}

// create the stack for a single customer in mind
const app = new cdk.App();
const stackName = config['stackName'] + '-' + config['customerId'];
new IotGardenStack(app, stackName, config, { //props:

  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});

// console.info(app.synth());
