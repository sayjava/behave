# Open API 3.0 and Swagger 2.0

This project showcases how to use Behave with Open Spec API 3.0 and Swagger 2.0. See the docs at [Behave Open API Spec docs](https://sayjava.github.io/behave/spec)

Behave can automatically generate mock endpoints from open spec 3.0 and swagger 2.0 spec files and use filesystem files to serve responses back to clients

## Running Open API 3.0 Example

This uses GitHub's Open Spec API to generate mocked endpoints that is useful for testing 

### Install Dependencies
```shell
yarn
```

### Start
```shell
yarn start-open-api
```

### Test

```shell
curl http://localhost:8080/users/followers
```

## Running Swagger 2.0 Example

This uses Bigcommerce's Swagger file to generate mocked endpoints that is useful for testing

### Install Dependencies
```shell
yarn
```
### Start
```shell
yarn start-swagger
```
### Test
```shell
curl http://localhost:8080/orders/2/metafields/4
```