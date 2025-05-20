export class testClass {
  testMethod(x?: string) {}
}

export enum testEnum {
  x,
}

const x = 1;

export { x as y };

export async function testFunction(x: string) {
  return x + "test";
}

export const xx: object = [];
