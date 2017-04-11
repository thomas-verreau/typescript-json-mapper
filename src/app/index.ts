
// METADATA
// --------

class DecoratorMetadata {

    params: any[];

}

class PropertyMetadata {

    private decorators: {[key: string]: DecoratorMetadata} = <{[key: string]: DecoratorMetadata}> {};

    getDecoratorMetadata(key: string): DecoratorMetadata {
        let decoratorMetadata: DecoratorMetadata = this.decorators[key];

        if (decoratorMetadata === undefined) {
            decoratorMetadata = new DecoratorMetadata();
            this.decorators[key] = decoratorMetadata;
        }

        return decoratorMetadata;
    }

}

class ClassMetadata {

    public properties: {[key: string]: PropertyMetadata} = <{[key: string]: PropertyMetadata}> {};

    getPropertyMetadata(key: string): PropertyMetadata {
        let propertyMetadata: PropertyMetadata = this.properties[key];

        if (propertyMetadata === undefined) {
            propertyMetadata = new PropertyMetadata();
            this.properties[key] = propertyMetadata;
        }

        return propertyMetadata;
    }
}


class Metadata {

    private classes: {[key: string]: ClassMetadata} = <{[key: string]: ClassMetadata}> {};

    getClassMetadata(className: string): ClassMetadata {

        let classMetadata: ClassMetadata = this.classes[className];

        if (classMetadata === undefined) {
            classMetadata = new ClassMetadata();
            this.classes[className] = classMetadata;
        }

        return classMetadata;
    }

    setPropertyDecoratorMetadata(className: string, propName: string, decoratorName: string, metadata: any[]) {
        let classMetadata: ClassMetadata = this.getClassMetadata(className);
        let propertyMetadata: PropertyMetadata = classMetadata.getPropertyMetadata(propName);
        let decoratorMetadata: DecoratorMetadata = propertyMetadata.getDecoratorMetadata(decoratorName);
        decoratorMetadata.params = metadata;
    }

    getPropertyDecoratorMetadata(className: string, propName: string, decoratorName: string): DecoratorMetadata {
        let classMetadata: ClassMetadata = this.getClassMetadata(className);
        let propertyMetadata: PropertyMetadata = classMetadata.getPropertyMetadata(propName);
        return propertyMetadata.getDecoratorMetadata(decoratorName);
    }

    public static instance: Metadata = new Metadata();

}

// SERIALIZATION
// -------------

// Field

export class JsonFieldOptions {

    /**
     * Class of the object
     */
    type?: Object;

    /**
     * If no class, name of the field containing the typeMap key
     */
    typeField?: string;

    /**
     * Map of the classes given the value of typeField
     */
    typeMap?: {[key: string]: Object};

}

const JSONFIELD_KEY = "JsonField";

export function JsonField(options?: JsonFieldOptions) {

    return function (target: any, propertyKey: string) {
        // console.log(target, propertyKey);

        Metadata.instance.setPropertyDecoratorMetadata(target.constructor.name, propertyKey, JSONFIELD_KEY, [options]);
        // console.log(Metadata.instance);
    };
}

export function getJsonFieldOptions(target: any, propertyKey: string): any[] {
    let metadata = Metadata.instance.getPropertyDecoratorMetadata(target.name, propertyKey, JSONFIELD_KEY);
    // console.log(target.name, propertyKey, "serialized", metadata);
    return metadata.params[0];
}

export class ObjectMapper {

    private instanciateItem(json: any, typeClass?: Object, typeField?: string, typeMap?: {[key: string]: Object}): any {
        if (!typeClass) {
            typeClass = typeMap[json[typeField]];
            // console.log("typeName", typeName);
            // clazz = item[];
        }

        let object = Object.create(typeClass["prototype"]);
        this.copyFields(json, object, typeClass["name"])
        return object;
    }

    private copyFields(json: any, object: Object, className: string) {

        let classMetadata: ClassMetadata = Metadata.instance.getClassMetadata(className);
        for (let k in classMetadata.properties) {
            let prop = classMetadata.properties[k];
            let jsonField = prop.getDecoratorMetadata(JSONFIELD_KEY);
            let jsonFieldOptions: JsonFieldOptions = jsonField.params[0];
            if (jsonFieldOptions) {
                // console.log(k, jsonFieldOptions, json[k]);
                let srcData = json[k];
                if (srcData instanceof Array) {
                    object[k] = [];
                    for (let i = 0; i < srcData.length; i++) {
                        object[k].push(this.instanciateItem(srcData[i], jsonFieldOptions.type, jsonFieldOptions.typeField, jsonFieldOptions.typeMap));
                    }
                } else {
                    object[k] = this.instanciateItem(srcData, jsonFieldOptions.type, jsonFieldOptions.typeField, jsonFieldOptions.typeMap);
                }
            } else {
                object[k] = json[k];
            }
        }
    }

    readValue<T>(json: any, clazz: Object): T {
        let object: T = <T> Object.create(clazz["prototype"]);
        let className = clazz["name"];
        this.copyFields(json, object, className);
        return object;
    }

}
