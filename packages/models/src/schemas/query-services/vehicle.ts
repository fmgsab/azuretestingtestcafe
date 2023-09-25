import { z } from 'zod';

const string = z.string();

export const vehicleShape = z.object({
  vehicle: z.object({
    plate: z.object({
      plateNumber: string,
      plateType: string,
      plateEffectiveDate: string,
    }),
    registration: z.object({
      previousCountryOfRegistration: string,
      firstRegistrationDateInNewZealand: string,
      registeredOverseas: string,
    }),
    yearOfManufacture: string,
    make: string,
    model: string,
    mvrModel: string,
    bodyStyle: string,
    vehicleType: string,
    vin: string,
    engineNumber: string,
    chassis: string,
    mainColour: string,
    ccRating: string,
    power: string,
    countryOfOrigin: string,
    assemblyType: string,
    grossVehicleMass: string,
    numberOfSeats: string,
    fuelType: string,
    numberOfAxles: string,
    axleType: string,
    wheelbase: string,
    vehicleUsage: string,
    odometerUnit: string,
    odometerReading: z.object({
      reading: string,
      readingDate: string,
      readingUnit: string,
      source: string,
    }),
    transmission: z.object({
      type: string,
      speeds: string,
    }),
    modelCode: string,
    modelVariant: string,
  }),
  note: z.object({
    alert: string,
  }),
  valuation: z.array(
    z.object({
      description: string,
      fifteenDigit: string,
      year: string,
      make: string,
      model: string,
      avgWholesale: string,
      avgRetail: string,
      goodRetail: string,
      newPrice: string,
      minValue: string,
      maxValue: string,
    })
  ),
});

export const lookup = {
  input: string,
  output: vehicleShape,
};
