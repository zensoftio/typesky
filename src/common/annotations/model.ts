import 'reflect-metadata';

const ATTRIBUTE_LIST = Symbol('attribute_list');

interface AttributeDefinitionOptions {
  type?: Function;
  optional?: boolean;
  nullable?: boolean;
  defaultValue?: any;
}

class AttributeDefinition {
  constructor(public type: Function,
              public name: string | symbol,
              public generic?: Function,
              public options: AttributeDefinitionOptions = {}) {
  }
}

export const attr = (options?: Function | AttributeDefinitionOptions) => (target: Object, propertyKey: string | symbol) => {
  if (!Reflect.get(target, ATTRIBUTE_LIST)) {
    Reflect.set(target, ATTRIBUTE_LIST, []);
  }

  const type = options instanceof Function ? options : options && options.type;

  const attributeList = Reflect.get(target, ATTRIBUTE_LIST);

  attributeList.push(new AttributeDefinition(
    Reflect.getMetadata('design:type', target, propertyKey),
    propertyKey,
    type,
    options instanceof Function ? undefined : options
  ));
};

interface StrategyList {
  [key: string]: (json: any, attribute: AttributeDefinition, constructor: Function) => void;
}

const strategyGenerator = (entityResolver: (json: any, constructor: Function) => any,
                           propertyResolver: (json: any, attribute: AttributeDefinition, constructor: Function) => any): StrategyList => {
  return {
    Array: (json: any, attribute: AttributeDefinition, constructor: Function) => {
      if (!(json instanceof Array)) {
        throw new Error(`${constructor.name}::${attribute.name} is not an Array`);
      }
      return json.map((it: any) => {
        if (!attribute.generic) {
          throw new Error(`${constructor.name}::${attribute.name} has not specified type`);
        }
        return propertyResolver(
          it,
          new AttributeDefinition(attribute.generic, `${attribute.name}[]`), attribute.generic
        );
      });
    },

    Boolean: (json: any, attribute: AttributeDefinition) =>
      (json instanceof String) ? attribute.type(json === 'true') : attribute.type(json),

    String: (json: any, attribute: AttributeDefinition) => attribute.type(json),

    Object: (json: any, attribute: AttributeDefinition) => attribute.type(json),

    Number: (json: any, attribute: AttributeDefinition, constructor: Function) => {
      const num = attribute.type(json);
      if (Number.isNaN(num)) {
        throw new Error(`${constructor.name}::${attribute.name} is not a Number`);
      }
      return num;
    },

    Default: (json: any, attribute: AttributeDefinition) => entityResolver(json, attribute.type)
  };
};

interface DefaultValueStrategyList {
  [key: string]: (attribute: AttributeDefinition) => void;
}

// need to add checking the data type and throw an exception?
const defaultValueStrategy: DefaultValueStrategyList = {

  Array: (attribute: AttributeDefinition) => {
    if ((attribute.options.defaultValue instanceof Array)) {
      return attribute.options.defaultValue;
    }
    return [];
  },

  Boolean: (attribute: AttributeDefinition) => {
    if (attribute.options.defaultValue) {
      return (attribute.options.defaultValue instanceof String) ? attribute.type(attribute.options.defaultValue === 'true')
        : attribute.type(attribute.options.defaultValue);
    }
    return false;
  },

  String: (attribute: AttributeDefinition) =>
    attribute.options.defaultValue ? attribute.type(attribute.options.defaultValue) : '',

  Object: (attribute: AttributeDefinition) => attribute.type(attribute.options.defaultValue),

  Number: (attribute: AttributeDefinition) => {
    if (attribute.options.defaultValue) {
      const num = attribute.type(attribute.options.defaultValue);
      if (Number.isNaN(num)) {
        return 0;
      }
      return num;
    }
    return 0;
  },

  Default: (attribute: AttributeDefinition) => attribute.type(attribute.options.defaultValue)

};

const checkProperty = (json: any, attribute: AttributeDefinition, constructor: Function) => {
  if (json === null || json === undefined) {
    if (attribute.options.optional) {
      const checkDefault = defaultValueStrategy[attribute.type.name] || defaultValueStrategy.Default;
      return checkDefault(attribute);
    } else if (attribute.options.nullable) {
      return json;
    } else {
      throw new Error(`${constructor.name}::${attribute.name} is not optional or nullable field`);
    }
  }
  const checkPropertyStrategyList = strategyGenerator(checkJson, checkProperty);
  const checkPropertyStrategy = checkPropertyStrategyList[attribute.type.name] || checkPropertyStrategyList.Default;
  return checkPropertyStrategy(json, attribute, constructor);
};

export const checkJson = (json: any = {}, constructor: Function) => {
  const attributeList: AttributeDefinition[] = Reflect.get(constructor.prototype, ATTRIBUTE_LIST);
  return attributeList.map(attribute => checkProperty(json[attribute.name], attribute, constructor));
};

const instantiateProperty = (json: any, attribute: AttributeDefinition, constructor: Function) => {
  if (json === null || json === undefined) {
    if (attribute.options.optional) {
      const checkDefault = defaultValueStrategy[attribute.type.name] || defaultValueStrategy.Default;
      return checkDefault(attribute);
    } else if (attribute.options.nullable) {
      return json;
    } else {
      throw new Error(`${constructor.name}::${attribute.name} is not optional or nullable field`);
    }
  }
  const checkPropertyStrategyList = strategyGenerator(instantiateJson, instantiateProperty);
  const checkPropertyStrategy = checkPropertyStrategyList[attribute.type.name] || checkPropertyStrategyList.Default;
  return checkPropertyStrategy(json, attribute, constructor);
};

export const instantiateJson = <T>(json: any = {}, constructor: any): T => {
  const attributeList: AttributeDefinition[] = Reflect.get(constructor.prototype, ATTRIBUTE_LIST);
  const instance = new constructor();
  attributeList.forEach(
    attribute => instance[attribute.name] = instantiateProperty(json[attribute.name], attribute, constructor)
  );
  return instance;
};
