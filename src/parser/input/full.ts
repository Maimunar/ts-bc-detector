export const addOne = (x?: number) => {
  return x ? x + 1 : x;
};

export const outerFunction = () => {
  const innerFunction = () => {
    return "inner function";
  };

  return true;
};

export const x = 1;

export interface Point {
  x: number;
  y: number;
}

export class A {
  private x: number = 1;

  constructor(public param: number) {
    this.x = param;
  }

  protected addOne() {
    return this.x + 1;
  }

  public get getX() {
    return this.x;
  }

  public set setX(value: number) {
    this.x = value;
  }

  static staticMethod() {
    return "static method";
  }
}

export enum Direction {
  Up = 0,
  Down = 1,
  Left = 2,
  Right = 3,
}

const pos = "left";

export { pos as position };

export type Point2D = {
  x: number;
  y: number;
};

export default pos;
