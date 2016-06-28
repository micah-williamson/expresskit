import {Reflect} from '../reflect';
import {fatal} from '../error';

export type ValidationDataTypes = 'string' | 'number' | 'object' | 'array';

export interface IValidationTags {
  when?: string | [string, string];
  not?: string | [string, string];
}

export interface IValidationRules extends IValidationTags {
  [key: string]: any;

  required?: boolean | [boolean, string];
  type?: ValidationDataTypes | [any, string];
  minLength?: number | [number, string];
  maxLength?: number | [number, string];
  min?: number | [number, string];
  max?: number | [number, string];
  pattern?: RegExp | [RegExp, string];
  values?: string | [string, string];
}

export class DTOManager {
  
  /**
   * Validates DTOs coming IN (from the client)
   */
  public static validate(data: any, dto: any): string {
    let dtoProperties = Reflect.getMetadata('DTO', dto.prototype);
    for(var i = 0; i < dtoProperties.length; i++) {
      let dtoProperty = dtoProperties[i];
      let validationRules: IValidationRules[] = Reflect.getMetadata('Validation', dto.prototype, dtoProperty);
      if(validationRules) {
        for(let k = 0; k < validationRules.length; k++) {
          let validationRuleSet = validationRules[k];
          let validators: any[] = [];

          // These need to be done in order
          let validationTuples: [string, Function][] = [
            ['required', this.validateRequired],
            ['type', this.validateType],
            ['minLength', this.validateMinLength],
            ['maxLength', this.validateMaxLength],
            ['min', this.validateMin],
            ['max', this.validateMax],
            ['pattern', this.validatePattern],
            ['values', this.validateValues]
          ];

          for(let j = 0; j < validationTuples.length; j++) {
            let validationTuple = validationTuples[j];
            
            let key = validationTuple[0];
            let method = validationTuple[1];

            if(validationRuleSet.hasOwnProperty(key)) {
              validators.push(validationTuple);
            }
          }

          for(let j = 0; j < validators.length; j++) {
            let validator = validators[j];
            let validatorKey = validator[0];
            let validatorValue = validationRuleSet[validatorKey][0];
            let validatorErr = validationRuleSet[validatorKey][1];
            let validatorMethod = validator[1];

            let err = validatorMethod.call(this, data, dtoProperty, validatorValue, validatorErr);

            if(err) {
              return err;
            }
          }
        }
      }
    }

    return null;
  }

  /**
   * Validates DTOs going OUT (from the server)
   */
  public static scrubIn(data: any, dto: any) {
    let dtoProperties = Reflect.getMetadata('DTO', dto.prototype);

    if(dtoProperties) {
      // Scrub properties out
      for(var i = 0; i < dtoProperties.length; i++) {
        let dtoProperty = dtoProperties[i];
        let scrubIn = Reflect.getMetadata('ScrubIn', dto.prototype, dtoProperty);

        if(scrubIn) {
          delete data[dtoProperty];
        }
      }
    }
  }
  
  /**
   * Validates DTOs going OUT (from the server)
   */
  public static scrubOut(data: any, dto: any) {
    let dtoProperties = Reflect.getMetadata('DTO', dto.prototype);

    if(dtoProperties) {
      // Scrub properties out
      for(var i = 0; i < dtoProperties.length; i++) {
        let dtoProperty = dtoProperties[i];
        let scrubOut = Reflect.getMetadata('ScrubOut', dto.prototype, dtoProperty);
        
        if(scrubOut) {
          delete data[dtoProperty];
        }
      }
    }
  }
  
  /**
   * Returns an error string if the required property is missing
   */
  private static validateRequired(data: any, property: string, value: any, err?: string): string {
    if(data.hasOwnProperty(property)) {
      return null;
    }

    return err || `Required property missing: ${property}`;
  }

  /**
   * Returns an error string if the required property is missing
   */
  private static validateType(data: any, property: string, type: any, err?: string): string {
    if(data.hasOwnProperty(property)) {
      let isType = false;

      switch(type) {
        case 'string':
          isType = typeof data[property] === 'string';
          break;
        case 'number':
          isType = typeof data[property] === 'number';
          break;
        case 'object':
          if(typeof data[property] === 'object') {
            if(!data[property].hasOwnProperty('length')) {
              isType = true;
            }
          }
          break;
        case 'array':
          if(typeof data[property] === 'object') {
            if(data[property].hasOwnProperty('length')) {
              isType = true;
            }
          }
          break;
        default:
          return 'Implementation Error: unknown type ' + type;
      }

      if(isType) {
        return null;
      }

      return err || `${property} was expected to be ${type}`;
    }
    
    return null;
  }

  /**
   * 
   */
  private static validateMinLength(data: any, property: string, length: number, err?: string): string {
    if(data[property] && data[property].length) {
      if(data[property].length >= length) {
        return null;
      }

      return err || `${property} expected to have a minimum length of ${length}`;
    }

    return null;
  }

  /**
   * 
   */
  private static validateMaxLength(data: any, property: string, length: number, err?: string): string {
    if(data[property] && data[property].length) {
      if(data[property].length < length) {
        return null;
      }

      return err || `${property} exceeds the maximum length of ${length}`;
    }

    return null;
  }

  /**
   * 
   */
  private static validateMin(data: any, property: string, value: number, err?: string): string {
    if(data.hasOwnProperty(property)) {
      if(+data[property] >= value) {
        return null;
      }

      return err || `${property} must be at least ${value}`;
    }

    return null;
  }

  /**
   * 
   */
  private static validateMax(data: any, property: string, value: number, err?: string): string {
    if(data.hasOwnProperty(property)) {
      if(+data[property] < value) {
        return null;
      }

      return err || `${property} cannot exceed ${value}`;
    }

    return null;
  }

  /**
   * 
   */
  private static validatePattern(data: any, property: string, pattern: RegExp, err?: string): string {
    if(data.hasOwnProperty(property)) {
      if(pattern.test(data[property])) {
        return null;
      }

      return err || `${property} does not satisfy pattern ${pattern}`;
    }

    return null;
  }

  /**
   * 
   */
  private static validateValues(data: any, property: string, values: string, err?: string): string {
    let valueArr = values.split(',');

    if(data.hasOwnProperty(property)) {
      for(var i = 0; i < valueArr.length; i++) {
        if(valueArr[i].trim() === data[property]) {
          return null;
        }
      }

      return err || `${data[property]} in ${property} is not in the list of accepted values: ${values}`;
    }

    return null;
  }
}