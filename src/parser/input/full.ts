export const addOne = (x?: number) => {
  return x ? x + 1 : x;
};

export const outerFunction = () => {
  const innerFunction = () => {
    return "inner function";
  };

  return innerFunction();
};

export function add(x: number, y: number): number | string {
  return x > 5 ? "too big" : x + y;
}

export function remove(x: number, y?: number) {
  return x < 5 ? "too small" : x - (y || 1);
}

export function sum(...x: number[]) {
  return x.reduce((acc, curr) => acc + curr, 0);
}

export function multiply(x: number, y: number = 1) {
  return x * y;
}

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
  Left = "left",
  Right = "right",
}

export enum One {
  one,
}

const pos = "left";

export { type Point2D, pos as position };

type Point2D = {
  x: number;
  y: number;
};

export default pos;
