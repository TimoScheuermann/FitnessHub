import { UnprocessableEntityException } from '@nestjs/common';

export class FormValidator {
  public static throwEx(key: string, message: string): void {
    throw new UnprocessableEntityException({ key, message });
  }

  public static checkString(s: string, key: string, message: string): string {
    if (!s || s.length === 0) {
      this.throwEx(key, message);
    }
    return s;
  }

  public static checkStringArray(
    array: string[],
    key: string,
    message: string,
  ): string[] {
    if (!array || array.length === 0) {
      this.throwEx(key, message);
    }
    const filtered = array.filter((x) => x.length > 0);
    if (filtered.length === 0) {
      this.throwEx(key, message);
    }

    return filtered;
  }

  public static checkNumber(n: number, key: string, message: string): number {
    if (!n || typeof n !== 'number') {
      this.throwEx(key, message);
    }

    return n;
  }

  public static checkNumberMinMax(
    n: number,
    min: number,
    max: number,
    key: string,
    message: string,
  ): number {
    if (n < min || n > max) {
      this.throwEx(key, message);
    }
    return n;
  }
}
