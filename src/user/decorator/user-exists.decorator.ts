import { Injectable } from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { UserService } from "../user.service";

export function UserExists(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
      registerDecorator({
          name: 'UserExists',
          target: object.constructor,
          propertyName: propertyName,
          options: validationOptions,
          validator: UserExistsRule,
        });
    };
}

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExistsRule implements ValidatorConstraintInterface {
    constructor(private user: UserService) {}
    
    async validate(value: string) {
        const user = await this.user.count({email: value});
        if (user) {
            return false;
        } else {
            return true;
        }
    }
    
    defaultMessage(args: ValidationArguments) {
        return `User already exists :c`;
    }
}

export function UserExistsId(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
      registerDecorator({
          name: 'UserExistsId',
          target: object.constructor,
          propertyName: propertyName,
          options: validationOptions,
          validator: UserExistsRuleId,
        });
    };
}

@ValidatorConstraint({ name: 'UserExistsId', async: true })
@Injectable()
export class UserExistsRuleId implements ValidatorConstraintInterface {
    constructor(private user: UserService) {}
    
    async validate(value: number) {
        const user = await this.user.count({id: value});
        if (user) {
            return true;
        } else {
            return false;
        }
    }
    
    defaultMessage(args: ValidationArguments) {
        return `User already exists id :c`;
    }
}