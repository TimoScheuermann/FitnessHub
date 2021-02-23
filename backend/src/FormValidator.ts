import { UnprocessableEntityException } from '@nestjs/common';

export class FormValidator {
  public static throwEx(message: string): void {
    throw new UnprocessableEntityException(message);
  }

  public static checkString(s: string, message: string): string {
    if (!s || s.length === 0) {
      this.throwEx(message);
    }
    return s;
  }

  public static checkStringArray(
    array: string[],

    message: string,
  ): string[] {
    if (!array || array.length === 0) {
      this.throwEx(message);
    }
    const filtered = array.filter((x) => x.length > 0);
    if (filtered.length === 0) {
      this.throwEx(message);
    }

    return filtered;
  }

  public static compareStringArry(
    array: string[],
    compare: string[],

    message: string,
  ): string[] {
    return array.map((x) => {
      if (!compare.includes(x)) {
        this.throwEx(x + ' ' + message);
      }
      return x;
    });
  }

  public static checkNumber(n: number, message: string): number {
    if (!n || typeof n !== 'number') {
      this.throwEx(message);
    }

    return n;
  }

  public static checkNumberMinMax(
    n: number,
    min: number,
    max: number,
    message: string,
  ): number {
    if (n < min || n > max) {
      this.throwEx(message);
    }
    return n;
  }
}
