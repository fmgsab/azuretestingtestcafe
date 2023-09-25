import { z, ZodSchema } from 'zod';
import { checkSizeIfSet, toNumber } from '@fmg/utils';
import { extractPathValue } from './utils';
import { numericCondition } from '../data-dictionary/constants';

const { defaultSumInsuredExcGst, defaultSumInsuredIncGst, defaultMinYear, shortStringMax } = numericCondition;

type CommonOptions = {
  optional?: boolean;
};

type NumberOptions = CommonOptions & {
  min?: number;
  max?: string | number;
};

type DecimalOptions = NumberOptions & {
  decimalPlaces?: number;
};

export const formatNumber = (value: string | number, minimumFractionDigits = 0) =>
  !isNaN(toNumber(value)) ? new Intl.NumberFormat('en-NZ', { minimumFractionDigits }).format(toNumber(value)) : '';

export const reqMessage = 'Required';
export const required = { required_error: reqMessage };
export const getNumRangeMessage = (min: number | string, max: number | string) =>
  `Enter a value between ${typeof min === 'string' ? min : formatNumber(min)} and ${typeof max === 'string' ? max : formatNumber(max)}`;
export const getMaxMessage = (max: number | string) => `Must contain no more than ${formatNumber(max)} characters`;

export const getMinMessage = (min: number | string) => `Contents must be over ${formatNumber(min)} to be specified`;

// TODO: can we and modify schema with custom values from here?
const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
    case z.ZodIssueCode.invalid_union:
      if (ctx.data == null) {
        return { message: reqMessage };
      }
      return { message: ctx.defaultError };
    case z.ZodIssueCode.invalid_union_discriminator:
      return { message: reqMessage };
    default:
      return { message: ctx.defaultError };
  }
};

z.setErrorMap(customErrorMap);

export function toOptional<T extends z.ZodTypeAny>(schema: T) {
  return schema.optional().nullish();
}

export function toRequired<T extends z.ZodString>(schema: T, message: string = reqMessage) {
  return schema.min(1, { message }).default('');
}

export function asKey() {
  return z.string().uuid();
}

export function asRequiredString(max: string | number = -1, message: string = reqMessage) {
  let sch = z.string(required);
  sch = sch.min(1, { message });

  if (toNumber(max) > 0) {
    sch = sch.max(toNumber(max), { message: getMaxMessage(max) });
  }

  return sch.default('');
}

export function asString(max: string | number = -1, regExp?: RegExp) {
  let sch = z.string(required);

  if (regExp) {
    sch = sch.regex(regExp, { message: 'Invalid format' });
  }

  if (toNumber(max) > 0) {
    sch = sch.max(toNumber(max), { message: getMaxMessage(max) });
  }

  return sch;
}

export function asShortText() {
  return asRequiredString(shortStringMax);
}

export function asOptionalShortText(regExp?: RegExp) {
  return asOptionalString(shortStringMax, regExp);
}

export function asOptionalString(max = -1, regExp?: RegExp) {
  return toOptional(asString(max, regExp));
}

export const maxYear = new Date().getFullYear() + 1;

export const asYearMessage = (min: number = defaultMinYear, max: number = maxYear) => `Enter a valid year between ${min} and ${max}`;
export function asYear(optional = false, min = defaultMinYear, max = maxYear) {
  const message = asYearMessage(min, max);

  const sch = asString()
    .max(4, { message })
    .refine(
      (val) => {
        if (optional && !val) return true;
        if (!val.match(/\d{4}/)) return false;

        const n = parseInt(val);
        return n >= min && n <= max;
      },
      { message }
    );
  return optional ? toOptional(sch) : sch.default('');
}

export function asYearRange() {
  return asRange(defaultMinYear, maxYear, true, false, asYearMessage(defaultMinYear, maxYear));
}

export function asOptionalBoolean() {
  return toOptional(z.boolean());
}

export function asNumber() {
  return asString().regex(/^[0-9]+$/g, { message: 'Must only contain numbers' });
}

export function asRequiredNumeric(max = 0) {
  return asPosNumeric(max);
}

export function asOptionalNumeric(max = 0) {
  return asPosNumeric(max, true);
}

export function asPosNumeric(max = 0, optional = false) {
  let sch = optional ? z.number() : z.number(required);

  // TODO CG Check this block
  if (!optional) {
    sch = sch.min(1, { message: reqMessage });
  }

  sch = sch.positive({ message: getNumRangeMessage(1, max) });

  if (max > 0) {
    sch = sch.lte(max, { message: getNumRangeMessage(1, max) });
  }

  return optional ? toOptional(sch) : sch;
}

export function asPosNumericMinMax(min = 1, max = defaultSumInsuredExcGst, optional = false) {
  let sch = optional ? z.coerce.number() : z.coerce.number(required);

  sch = sch.gte(min, { message: getMinMessage(min) });
  sch = sch.lte(max, { message: getNumRangeMessage(min, max) });

  return optional ? sch.optional().default(0) : sch.default(0);
}

export function asRequiredSumInsured(max = defaultSumInsuredExcGst) {
  return asPosInteger(max).default('');
}

export function asRequiredSumInsuredGstIncl(max = defaultSumInsuredIncGst) {
  return asPosInteger(max).default('');
}

export function asRequiredSumInsuredPair() {
  return z.object({ gstExclusive: asRequiredSumInsured(), gstInclusive: asRequiredSumInsuredGstIncl() }).default({});
}

export function asOptionalSumInsured(max = defaultSumInsuredExcGst) {
  return asPosInteger(max, true);
}

export function asOptionalSumInsuredGstIncl(max = defaultSumInsuredIncGst) {
  return asPosInteger(max, true);
}

export function asOptionalSumInsuredPair() {
  return z.object({ gstExclusive: asOptionalSumInsured(), gstInclusive: asOptionalSumInsuredGstIncl() }).optional();
}

const defaultMinRange = 1;
const defaultMaxRange = defaultSumInsuredExcGst;
export function asRange(min = defaultMinRange, max = defaultMaxRange, integersOnly = false, optional = false, customRangeMessage?: string) {
  const rangeMessage = { message: customRangeMessage ?? getNumRangeMessage(min, max) };
  const noDecimalsMessage = { message: 'No decimals' };
  const requiredMessage = { message: reqMessage };
  min = toNumber(min);
  max = toNumber(max);

  // NOTE (CG): react-format-number always returns defined, which messes with the "required" behaviour of the zod schema!
  const sch = z
    .string()
    .or(z.number())
    .refine((val) => {
      return optional ? true : Boolean(val); // This is the 'required' check
    }, requiredMessage)
    .refine((val) => {
      const n = toNumber(val);
      return n >= min && n <= max; // Check for range
    }, rangeMessage)
    .refine((val) => {
      return integersOnly ? !`${val}`.match(/\./) : true; // Check for decimals
    }, noDecimalsMessage);

  return optional ? toOptional(sch) : sch.default('');
}

export function asPosInteger(max: string | number = 0, optional = false, min = 1) {
  const sch = (optional ? asString() : asRequiredString()).refine(
    (val) => {
      if (optional && !val) return true;
      if (!val.match(/^\d{1,3}(,\d{3})+|\d+$/)) return false;

      const n = toNumber(val);
      return n >= min && n <= toNumber(max);
    },
    {
      message: getNumRangeMessage(min, max),
    }
  );
  return optional ? toOptional(sch) : sch.default('');
}

export function asInteger(props: DecimalOptions) {
  return asDecimal({ ...props, decimalPlaces: 0 });
}

export function asDecimal({ optional = false, min = 1, max = 0, decimalPlaces = 2 }: DecimalOptions) {
  const sch = (optional ? asString() : asRequiredString()).refine(
    (val) => {
      if (optional && !val) return true;
      const number = toNumber(val);
      const regex = new RegExp(`^\\d{1,3}(,\\d{3})+|\\d+\\.?\\d{0,${decimalPlaces}}$`);
      if (!String(number).match(regex)) return false;

      const n = number;
      return n >= min && n <= toNumber(max);
    },
    {
      message: getNumRangeMessage(min, decimalPlaces ? formatNumber(max, decimalPlaces) : max),
    }
  );
  return optional ? toOptional(sch) : sch.default('');
}

export function asSet<T extends z.ZodTypeAny>(schema: T) {
  return z.set(schema, required);
}

export function asRequiredSet<T extends z.ZodTypeAny>(schema: T) {
  return z.set(schema, required).nonempty({ message: reqMessage }).default(new Set([]));
}

export function asRequiredArray<T extends z.ZodTypeAny>(schema: T) {
  return z.array(schema, required).nonempty({ message: reqMessage });
}

export function asRequiredChoices() {
  return z
    .union([asRequiredArray(asRequiredString()), asRequiredSet(asRequiredString()), z.record(asRequiredString()), z.string()])
    .default('');
}

export function asEmail(max: string | number = 60) {
  let sch = z.string().email();
  sch.optional();
  if (toNumber(max) > 0) {
    sch = sch.max(toNumber(max), { message: getMaxMessage(max) });
  }
  return sch;
}

// TODO: expand on this to return more options
export function addRequiredIssues(
  condition: string | boolean | null | undefined | (() => boolean),
  path: string[],
  args: Record<string, unknown>,
  ctx: z.RefinementCtx
) {
  const satisfied = () => {
    if (condition == null) return false;

    if (typeof condition === 'string') {
      return ['true', 'Yes'].includes(condition);
    }

    if (typeof condition === 'function') {
      return condition();
    }

    return condition;
  };

  if (satisfied()) {
    for (const key of path) {
      if (!extractPathValue(args, key) || !checkSizeIfSet(extractPathValue(args, key))) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: reqMessage, path: [key] });
      }
    }
  }
}

export function addOtherIssues(condition: boolean, path: string, message: string, ctx: z.RefinementCtx) {
  if (condition) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: message,
      path: [path],
    });
  }
}

export function addValidationIssues(schema: ZodSchema, path: string, args: Record<string, unknown>, ctx: z.RefinementCtx) {
  const result = schema.safeParse(args[path]);
  if (!result.success) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: result.error.message,
      path: [path],
    });
  }
}
