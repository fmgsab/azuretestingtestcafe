import React from 'react';
import classnames from 'classnames';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ModelContext } from '../context/ModelContext';
import { type FormProps } from '../types';
import { useLoadTable } from '../hooks';

export function FormProviderWrapper({
  model,
  uid,
  onSubmit,
  children,
  defaultValues,
  mode = 'onChange',
  shouldValidateOnLoad = false,
  discriminator,
}: FormProps<unknown>) {
  const form = useForm({ resolver: zodResolver(model.schema), mode, defaultValues });

  const { result, isLoaded } = useLoadTable({ form, model, uid, defaultValues, discriminator });

  if (isLoaded == null || (model.table && !isLoaded)) return null;

  if (shouldValidateOnLoad) {
    form.trigger().then();
    form.watch();
  }

  const title = form.getValues('name');

  return (
    <FormProvider {...form}>
      <ModelContext.Provider value={{ ...model, uid, defaultValues: result ?? defaultValues }}>
        <h1 className={classnames('border-b-fmg-gray-200 border-b-1 p-4.5 mb-12 border-b text-center text-xl')}>{title}</h1>
        <form className="form-container" onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
          {children}
        </form>
      </ModelContext.Provider>
    </FormProvider>
  );
}
