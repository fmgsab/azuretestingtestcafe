import { schema, FormValues } from 'models/src/content.table';
import { itemSubtypes } from 'models';
import { v4 } from 'uuid';
const key = v4();

describe('content.table', () => {
  describe('schema', () => {
    it('should validate a valid form values object', () => {
      const validFormValues: FormValues = {
        basisOfSettlement: 'replacement',
        excess: '500',
        hasContentsInStorage: 'false',
        hasFixedCarpetCover: 'false',
        hasShortTermGuest: 'false',
        hasSpecifiedItems: 'false',
        hasUnRepairedEqcDamage: 'false',
        isBodyCorpManaged: 'false',
        isCommercialUse: 'false',
        itemSubtype: itemSubtypes.content.household,
        itemType: 'contents',
        lifeStyleBlockContents: 'false',
        location: 'Christchurch',
        name: 'My Content',
        occupancy: 'ownerOccupied',
        occupation: 'Software Developer',
        specifiedItems: [
          {
            basisOfSettlement: 'replacement',
            details: 'Some details',
            key,
            specifiedItem: 'Some item',
            sumInsured: {
              gstExclusive: 1000,
              gstInclusive: 1150,
            },
            valuationProvided: new Set(['some-value']),
          },
        ],
        sumInsured: {
          gstExclusive: '10000',
          gstInclusive: '11500',
        },
        valueOfContentsInStorage: '1000',
        waterSupply: 'mains',
      };
      expect(schema.parse(validFormValues)).toEqual(validFormValues);
    });

    it('should throw an error if basisOfSettlement is missing', () => {
      const invalidFormValues: FormValues = {
        excess: '500',
        hasContentsInStorage: 'false',
        hasFixedCarpetCover: 'false',
        hasShortTermGuest: 'false',
        hasSpecifiedItems: 'false',
        hasUnRepairedEqcDamage: 'false',
        isBodyCorpManaged: 'false',
        isCommercialUse: 'false',
        itemSubtype: itemSubtypes.content.household,
        itemType: 'contents',
        lifeStyleBlockContents: 'false',
        location: 'Christchurch',
        name: 'My Content',
        occupancy: 'ownerOccupied',
        occupation: 'Software Developer',
        specifiedItems: [
          {
            basisOfSettlement: 'replacement',
            details: 'Some details',
            key,
            specifiedItem: 'Some item',
            sumInsured: {
              gstExclusive: 1000,
              gstInclusive: 1150,
            },
            valuationProvided: new Set(['some-value']),
          },
        ],
        sumInsured: {
          gstExclusive: '10000',
          gstInclusive: '11500',
        },
        valueOfContentsInStorage: '1000',
        waterSupply: 'mains',
        basisOfSettlement: '',
      };
      expect(() => schema.parse(invalidFormValues)).toThrow();
    });

    it('should throw an error if itemSubtype is missing', () => {
      const invalidFormValues: FormValues = {
        basisOfSettlement: 'replacement',
        excess: '500',
        hasContentsInStorage: 'false',
        hasFixedCarpetCover: 'false',
        hasShortTermGuest: 'false',
        hasSpecifiedItems: 'false',
        hasUnRepairedEqcDamage: 'false',
        isBodyCorpManaged: 'false',
        isCommercialUse: 'false',
        itemType: 'contents',
        lifeStyleBlockContents: 'false',
        location: 'Christchurch',
        name: 'My Content',
        occupancy: 'ownerOccupied',
        occupation: 'Software Developer',
        specifiedItems: [
          {
            basisOfSettlement: 'replacement',
            details: 'Some details',
            key,
            specifiedItem: 'Some item',
            sumInsured: {
              gstExclusive: 1000,
              gstInclusive: 1150,
            },
            valuationProvided: new Set(['some-value']),
          },
        ],
        sumInsured: {
          gstExclusive: '10000',
          gstInclusive: '11500',
        },
        valueOfContentsInStorage: '1000',
        waterSupply: 'mains',
        itemSubtype: '',
      };
      expect(() => schema.parse(invalidFormValues)).toThrow();
    });

    it('should throw an error if sumInsured is missing', () => {
      const invalidFormValues: FormValues = {
        basisOfSettlement: 'replacement',
        excess: '500',
        hasContentsInStorage: 'false',
        hasFixedCarpetCover: 'false',
        hasShortTermGuest: 'false',
        hasSpecifiedItems: 'false',
        hasUnRepairedEqcDamage: 'false',
        isBodyCorpManaged: 'false',
        isCommercialUse: 'false',
        itemSubtype: itemSubtypes.content.household,
        itemType: 'contents',
        lifeStyleBlockContents: 'false',
        location: 'Christchurch',
        name: 'My Content',
        occupancy: 'ownerOccupied',
        occupation: 'Software Developer',
        specifiedItems: [
          {
            basisOfSettlement: 'replacement',
            details: 'Some details',
            key,
            specifiedItem: 'Some item',
            sumInsured: {
              gstExclusive: 1000,
              gstInclusive: 1150,
            },
            valuationProvided: new Set(['some-value']),
          },
        ],
        valueOfContentsInStorage: '1000',
        waterSupply: 'mains',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        sumInsured: undefined,
      };

      expect(() => schema.parse(invalidFormValues)).toThrow();
    });

    it('should have no error if specifiedItems is missing', () => {
      const invalidFormValues: FormValues = {
        basisOfSettlement: 'replacement',
        excess: '500',
        hasContentsInStorage: 'false',
        hasFixedCarpetCover: 'false',
        hasShortTermGuest: 'false',
        hasSpecifiedItems: 'true',
        hasUnRepairedEqcDamage: 'false',
        isBodyCorpManaged: 'false',
        isCommercialUse: 'false',
        itemSubtype: itemSubtypes.content.household,
        itemType: 'contents',
        lifeStyleBlockContents: 'false',
        location: 'Christchurch',
        name: 'My Content',
        occupancy: 'ownerOccupied',
        occupation: 'Software Developer',
        sumInsured: {
          gstExclusive: '10000',
          gstInclusive: '11500',
        },
        valueOfContentsInStorage: '1000',
        waterSupply: 'mains',
        specifiedItems: [],
      };

      expect(() => schema.parse(invalidFormValues)).toBeTruthy();
    });

    it('should throw an error if specifiedItems.sumInsured.gstExclusive is less than minGstExclusive', () => {
      const invalidFormValues: FormValues = {
        basisOfSettlement: 'replacement',
        excess: '500',
        hasContentsInStorage: 'false',
        hasFixedCarpetCover: 'false',
        hasShortTermGuest: 'false',
        hasSpecifiedItems: 'true',
        hasUnRepairedEqcDamage: 'false',
        isBodyCorpManaged: 'false',
        isCommercialUse: 'false',
        itemSubtype: itemSubtypes.content.household,
        itemType: 'contents',
        lifeStyleBlockContents: 'false',
        location: 'Christchurch',
        name: 'My Content',
        occupancy: 'ownerOccupied',
        occupation: 'Software Developer',
        specifiedItems: [
          {
            basisOfSettlement: 'replacement',
            details: 'Some details',
            key,
            specifiedItem: 'Some item',
            sumInsured: {
              gstExclusive: 4000,
              gstInclusive: 4600,
            },
            valuationProvided: new Set(['some-value']),
          },
        ],
        sumInsured: {
          gstExclusive: '10000',
          gstInclusive: '11500',
        },
        valueOfContentsInStorage: '1000',
        waterSupply: 'mains',
      };

      expect(() => schema.parse(invalidFormValues)).toThrow();
    });

    it('should throw an error if specifiedItems.sumInsured.gstExclusive is greater than maxGstExclusive', () => {
      const invalidFormValues: FormValues = {
        basisOfSettlement: 'replacement',
        excess: '500',
        hasContentsInStorage: 'false',
        hasFixedCarpetCover: 'false',
        hasShortTermGuest: 'false',
        hasSpecifiedItems: 'true',
        hasUnRepairedEqcDamage: 'false',
        isBodyCorpManaged: 'false',
        isCommercialUse: 'false',
        itemSubtype: itemSubtypes.content.household,
        itemType: 'contents',
        lifeStyleBlockContents: 'false',
        location: 'Christchurch',
        name: 'My Content',
        occupancy: 'ownerOccupied',
        occupation: 'Software Developer',
        specifiedItems: [
          {
            basisOfSettlement: 'replacement',
            details: 'Some details',
            key,
            specifiedItem: 'Some item',
            sumInsured: {
              gstExclusive: 1000000000,
              gstInclusive: 1150000000,
            },
            valuationProvided: new Set(['some-value']),
          },
        ],
        sumInsured: {
          gstExclusive: '10000',
          gstInclusive: '11500',
        },
        valueOfContentsInStorage: '1000',
        waterSupply: 'mains',
      };

      expect(() => schema.parse(invalidFormValues)).toThrow();
    });
  });
});
