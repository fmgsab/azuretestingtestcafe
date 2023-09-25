import { z } from 'zod';

const string = z.string();

export const lookup = {
  input: string,
  output: z.array(z.object({ uniqueId: string, fullAddress: string, sourceDesc: string })),
};

export const detail = {
  input: z.coerce.string(),
  output: z.object({
    uniqueId: z.coerce.string(),
    sourceId: z.coerce.string(),
    sourceDesc: string,
    sadId: z.coerce.string(),
    streetNumber: string,
    roadName: string,
    roadTypeName: string,
    city: string,
    country: string,
    postCode: string,
    addressType: string,
    fullAddress: string,
    nztmXcoord: string,
    nztmYcoord: string,
    gd2kXcoord: string,
    gd2kYcoord: string,
    meshblock: z.coerce.string(),
    parcelId: z.coerce.string(),
    postalLine1: string,
    postalLine2: string,
    postalLine3: string,
  }),
};
