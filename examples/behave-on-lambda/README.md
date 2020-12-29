# Behave on Lambda

Run `behave` on AWS Lambda. In this example, the `behaviors.json` file is packaged with serverless module

Note: Assertions will not working on this serverless deployment because the records are not persisted

Note: All behaviors configured via the Http API will not be persisted. It is better add the needed behaviors in the `behaviors.json` file that will be loaded when the function is executed.


# Local development

```shell
yarn
yarn dev
```

# Deploy
```shell
yarn deploy
```
