# Behave on Lambda

Run `behave` on AWS Lambda. In this example, the `behaviors.json` file is packaged with serverless module

Note: Assertions will not working on this serverless deployment because the records are not persisted

Note: All behaviors configured via the Http API will not be persisted. It is better add the needed behaviors in the `behaviors.json` file that will be loaded when the function is executed.


This uses the excellent [Serverless Framework](https://www.serverless.com/examples/) to deploy a sample behave system on AWS Lambda

# Local development

### Install dependencies
```bash
yarn
```

### Start
```bash
yarn
```

## Test
When the Serverless frameworks runs the server locally, it appends `dev` to the endpoint, hence `http://localhost:3000/dev/hello` instead of `http://localhost/hello` as configured in the `behavior.json` file
```bash

curl http://localhost:3000/dev/hello 
```
