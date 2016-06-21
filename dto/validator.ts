import {Reflect} from '../reflect';
import fatal from '../error';

export class DTOValidator {
  
  /**
   * Validates DTOs coming IN (from the client)
   */
  public static validateIn(data: any, dto: any) {
    let dtoProperties = Reflect.getMetadata('DTO', dto);
    
    let err = this.validateRequired(data, dtoProperties, dto);
    
    if(err) {
      return err;
    }
    
    // Scrub properties in
    for(var i = 0; i < dtoProperties.length; i++) {
      let dtoProperty = dtoProperties[i];
      let scrubIn = Reflect.getMetadata('ScrubIn', dto, dtoProperty);
      
      if(scrubIn) {
        delete data[dtoProperty];
      }
    }
  }
  
  /**
   * Validates DTOs going OUT (from the server)
   */
  public static validateOut(data: any, dto: any) {
    let dtoProperties = Object.keys(dto.prototype);
    
    // Scrub properties out
    for(var i = 0; i < dtoProperties.length; i++) {
      let dtoProperty = dtoProperties[i];
      let scrubIn = Reflect.getMetadata('ScrubIn', dto, dtoProperty);
      
      if(scrubIn) {
        delete data[dtoProperty];
      }
    }
  }
  
  /**
   * Validates all required properties exist.
   * If all required properties exist, undefined will be returned.
   * If a missing required property is found, an error string will be returned.
   */
  private static validateRequired(data: any, dtoProperties: string[], dto: any): string {
    for(var i = 0; i < dtoProperties.length; i++) {
      let dtoProperty = dtoProperties[i];
      
      let required = Reflect.getMetadata('Required', dto, dtoProperty);
      
      if(required && (data[dtoProperty] === undefined || data[dtoProperty] === null)) {
        return `Required property missing: ${dtoProperty}`;
      }
    }
    
    return null;
  }
}