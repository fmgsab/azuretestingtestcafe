import { z } from 'zod';

const string = z.string().default('');
const nullish = string.nullish();

export const leadShape = z.object({
  leadId: string,
  leadStatus: string,
  opUnitCode: string,
  allocatedTo: string,
  appointmentStart: string,
  title: nullish,
  firstName: string,
  middleName: string,
  lastName: string,
  preferredName: nullish,
  dateOfBirth: nullish,
  phoneType: nullish,
  phoneNumber: nullish,
  emailAddress: nullish,
  addressName: nullish,
  addressCO: nullish,
  addressLine1: nullish,
  addressLine2: nullish,
  addressLine3: nullish,
  city: nullish,
  postcode: nullish,
});

export const get = {
  input: string,
  output: z.array(leadShape),
};
