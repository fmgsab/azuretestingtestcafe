import React, { Children, useEffect, useState } from 'react';
import { z, ZodRawShape, ZodSchema, ZodString } from 'zod';
import { FieldProps } from '../types';
import { FormProviderWrapper } from '../providers/FormProviderWrapper';

export type CommonControlType = {
  pattern: string;
  message: string;
  requiredMessage?: string;
  maxChars: number;
  shouldValidateOnLoad: boolean;
} & Partial<FieldProps> &
  unknown;

export class StringType {
  #required: boolean;
  #pattern: RegExp | null;
  #max: number | null;
  readonly #fieldName: string;
  #requiredMessage: string;
  #errorMessage: string;
  #maxMessage: string;

  constructor(fieldName: string) {
    this.#fieldName = fieldName;
    this.#requiredMessage = '';
    this.#errorMessage = '';
    this.#pattern = null;
    this.#max = 0;
    this.#maxMessage = '';
    this.#required = false;
  }

  asRequired(required: boolean, message: string): StringType {
    this.#required = required;
    this.#requiredMessage = message;
    return this;
  }

  withPattern(pattern: string, message: string): StringType {
    if (pattern) {
      try {
        this.#pattern = new RegExp(pattern, 'g');
        this.#errorMessage = message;
      } catch (e: unknown) {
        throw new Error(`Invalid pattern for field ${this.#fieldName}`);
      }
    }
    return this;
  }

  withMaxLength(max: number, message: string): StringType {
    if (max) {
      this.#max = max;
      this.#maxMessage = message;
    }
    return this;
  }

  build(): ZodRawShape {
    let shape;

    if (this.#required) {
      shape = z.string({ required_error: this.#requiredMessage }).min(1, { message: this.#requiredMessage });
    }

    if (this.#pattern) {
      if (shape == null) {
        shape = z.string().regex(this.#pattern, { message: this.#errorMessage }).optional();
      } else {
        shape = (shape as ZodString).regex(this.#pattern, { message: this.#errorMessage });
      }
    }

    if (this.#max) {
      if (shape == null) {
        shape = z.string().max(this.#max, { message: this.#maxMessage }).optional();
      } else {
        shape = (shape as ZodString).max(this.#max, { message: this.#maxMessage });
      }
    }

    if (shape == null) {
      shape = z.string().optional();
    }

    return { [this.#fieldName]: shape };
  }
}

export function StoryForm<T>({
  children,
  ...args
}: { children: React.ReactElement | React.ReactElement[]; schema?: ZodSchema } & T & CommonControlType & Partial<FieldProps>) {
  const {
    name = '',
    message,
    requiredMessage,
    pattern,
    required,
    optedFor = '',
    maxChars,
    shouldValidateOnLoad,
    defaultValue,
    ...props
  } = args;

  const [shouldRevalidate, setShouldRevalidate] = useState(false);

  useEffect(() => {
    setShouldRevalidate(true);
  }, [message, requiredMessage, pattern, required, defaultValue]);

  useEffect(() => {
    setShouldRevalidate(false);
  }, []);

  const schema = (
    args.schema ??
    z
      .object(
        new StringType(name)
          .asRequired((required && true) || false, requiredMessage ?? message)
          .withPattern(pattern, message)
          .withMaxLength(maxChars, message)
          .build()
      )
      .merge(
        z.object({
          [optedFor]: z.boolean(),
        })
      )
  ).superRefine((args, ctx) => {
    if (args[optedFor]) {
      ctx.addIssue({ code: 'custom', message: requiredMessage ?? message, path: [name] });
    }
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    alert(JSON.stringify(data));
  };

  return (
    <FormProviderWrapper
      model={{ schema }}
      uid={1}
      onSubmit={onSubmit}
      mode="all"
      defaultValues={{ [name]: defaultValue }}
      shouldValidateOnLoad={shouldValidateOnLoad || shouldRevalidate}
    >
      {Children.map(children, (child) => {
        return React.cloneElement(child, {
          name: name || child.props.name,
          required: required || child.props.required,
          optedFor,
          ...props,
        });
      })}
    </FormProviderWrapper>
  );
}
