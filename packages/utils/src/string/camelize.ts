import { z, ZodTypeAny } from 'zod';

export function camelize(input: z.infer<ZodTypeAny>): z.infer<ZodTypeAny> {
  if (typeof input !== 'object' || input === null) {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((item) => camelize(item));
  }

  const camelCaseObj: Record<string, unknown> = {};
  for (const key in input) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      const camelCaseKey = key
        .replace(/(^[A-Z]+$)/g, (_, letter) => letter.toLowerCase())
        .replace(/(^[A-Z])/g, (_, letter) => letter.toLowerCase())
        .replace(/([A-Z]+)([A-Z])/g, (_, p1, p2) => p1.toLowerCase() + p2)
        .replace(/[_-]([a-z])/g, (_, letter) => letter.toUpperCase());
      camelCaseObj[camelCaseKey] = camelize(input[key]);
    }
  }
  return camelCaseObj;
}
