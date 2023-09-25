import { ExcessContents, Options, SumInsured } from '../../fields';
import { itemStored } from 'models';
import { SumInsuredWithOptions } from '../../fields/SumInsuredWithOptions/SumInsuredWithOptions';
import { Scope } from '@fmg/ui';

export const PortablePlantContents = () => {
  return (
    <>
      <Scope highlight>
        <Scope.Source>
          <Options name="storageLocation" question="Items stored" lookupKey="storages" required />
        </Scope.Source>
        <Scope.Target condition={itemStored.lockedVehicle}>
          <Options name="vehicleLocation" question="Storage Location" lookupKey="vehicleLocations" required />
        </Scope.Target>
      </Scope>

      <Scope highlight>
        <Scope.Source>
          <SumInsuredWithOptions name="sumInsuredOption" question="Sum Insured" lookupKey="sumInsured" required />
        </Scope.Source>

        <Scope.Target condition="Other" required>
          <SumInsured name="sumInsured" question="Other" required />
        </Scope.Target>
      </Scope>

      <ExcessContents />
    </>
  );
};
