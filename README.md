# Type Sky

Starter Kit for Frontend applications

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

For running this application you need to have [NodeJs](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/).
We recommend to use [NVM](https://github.com/creationix/nvm) for managing NodeJs versions
For NVM installation please refer to [manual](https://github.com/creationix/nvm#install--update-script)

### Installing

```
npm install
```

### Run application

```
npm run start
```

If you need to compile application for deployment

```
npm run build
```

## Running the tests

```
npm run test
```

## Deployment

TODO: fill this

## Built With

* [React.js](https://github.com/facebook/react/) - Component Library
* [TypeScript](https://www.typescriptlang.org/) - Primary language
* [MobX](https://github.com/mobxjs/mobx) - State management library

## Data and Action flow

There is 4 roles (layers) in the system: Mapper, Component, Service, Storage

### Mapper

Mapper is data provider for Components (based in MobX). Mapper is a simple TS Class with properties annotated as ``@computed`` or ``@observable``. Class should implement ``Injectable`` unterface and be annotated as ``@mapper``. Also can contain simple methods. System provides ``BaseMapper`` class with default (empty) implementation of ``Injectable`` interface.

**Main rule:** read from storage, provide to component

### Component

Component is regular ReactJS component (class or functional) annotated with ``@observer``. Avoid using any state or props related methods. MobX will handle them.

**Main rule:** read from store, pass logic processing to service

### Service

Service is a simple TS class that implements ``Injectable`` interface and is annotated as ``@service``. Proceed all business logic here. Fetching from remote API should be also proceeded here. System provides ``BaseService`` class with default (empty) implementation of ``Injectable`` interface.

**Main rule:** execute all logic here, including fetching from remote source, no changes in the system, pass it to repository

### Storage

Storage is a simple TS class that implements ``Injectable`` interface and is annotated as ``@storage``. This is a one and only one data source is the system. Changes (CRUD) should be proceeded only here. All methods should be annotated as ``@action``. System provides base generic ``DefaultRecordStorage<T>`` class.

**Main rule:** only data changes allowed here. no side effects!

### 4 layers

![prototype__1_](https://git.zensoft.io/os-incubator/typesky/uploads/c45597c823ec8aec8e672f94f969223b/prototype__1_.png)

## Dependency Injection

System provides a versatile Dependency Injection mechanism.

### Model Layer Entities
Model Layer entities are registered via ``@service``, ``@store``, ``@mapper`` decorators, or on rare ocasions via ``@injectable`` decorator. Following decorators are available to resolve dependencies for model layer entities:

* ``@injectConstructor`` for constructor arguments of your layers
* ``@injectProperty`` for property injections
* ``@injectMethod`` for setter-based injections

**Note:** All constructor arguments SHOULD be decorated dependencies.

#### Dependency registration
System relays on automated dependency registration. You need to specify any new unit (service, mapper, storage) in ``./src/layers.ts``, so dependency registration will be able to load implementations for your interfaces.

### Component dependencies

To leverage dependency injection mechanism for components use ``withDependencies()`` Higer Order Component. Describe dependencies of your component in a separate interface, like this one:

```Typescript
interface Dependencies extends ComponentDependencies {
  todoService: TodoService
  todoMapper: TodoMapper
}
```

Then, declare your Props interface like this:

```Typescript
interface Props extends WithDependencies<Dependencies> {
	user: User.BaseModel
	// ...
}
```
This will add a `deps` field to your props that you will access your dependencies from.

After building your component, export it like this:

```TypeScript
export default withDependencies<Dependencies>({
  todoService: 'TodoService',
  todoMapper: 'TodoMapper',
})(TodoListView)
```

Note that string identifiers in `withDependencies` argument should match registration keys of your dependencies.

#### Deprecated

**Note:** ``@injectAware`` decorator is deprecated and will be removed in upcoming versions. Please, migrate your code to `withDependencies` HOC.

To leverage dependency injection mechanism for components use ``@injectAware`` decorator. This allows usage of ``@injectProperty`` and ``@injectMethod`` decorators on your component to receive dependencies.

**Note:** ``@injectConstructor`` decorator is not (and will not be) supported for components.

``awakeAfterInjection()`` lifecycle hook is available for inject-aware components. It is called after all dependencies are provided to component. Use this hook to initialize any properties that relay on your dependencies.

**Note:** ``@injectAware`` decorator works properly with inheritance and will handle parent class dependencies.

### Testing

To test your component that works with `withDependencies()` just import the plain component and mock it's deps prop properly.

#### Deprecated

``@injectAware`` annotation works differently in test environment: dependencies for components are resolved from isolated containers instead of defaultContainer. In test, to access isolated container for your component call ``Container.containerForComponent(ComponentClass.name)``. Use the isolated container to register dependencies of your component for test. Refer to `./src/tests/common/annotations/dependency-injection.spec.ts` for examples.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/zensoftio/typesky/releases). 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details

