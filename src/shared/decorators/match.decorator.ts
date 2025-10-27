import { registerDecorator,  ValidationOptions , ValidationArguments} from "class-validator";

export function Match(property:string, validationOption?:ValidationOptions){
    return function (object: any, propertyName: string){
        registerDecorator({
            name:'Match',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options:validationOption,
            validator:{

           
                validate(value: any, args: ValidationArguments){
                    const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
                },
                 defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${propertyName} must match ${relatedPropertyName}`;
        },
             }
        })
    }
}
