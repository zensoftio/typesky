// Type definitions for jwt-client v0.2.1
// Project: https://github.com/pauldijou/jwt-client
// Definitions by: Timoteo Ponce <https://github.com/timoteoponce>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped


declare module 'jwt-client' {
  
  interface JWTHeader {
    typ: string;
    alg: string;
  }
  
  interface JWTObject {
    header: JWTHeader;
    claim: any;
    signature: string;
  }
  
  /**
   * Read a string value (normally an HTTP header)
   * from JSON Web Token to an Object
   */
  function read(header: string): JWTObject;
  
  /**
   * Given a JWT object, stringify it back to
   * its JWT representation.
   */
  function write(value: JWTObject): string;
  
  function keep(value: JWTObject | string, key?: any, storage?: any): void;
  
  function remember(key: string): void;
  
  function forget(key: string): void;
  
  function get(key: string): string;
  
  function set(value: any, key: string): string;
  
  function validate(value: JWTObject | string, issuer?: any, audience?: any): boolean;
}

