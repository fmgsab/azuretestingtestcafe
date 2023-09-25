import React, { Fragment, useEffect, useState } from 'react';
import { otherContent as model } from 'models';
import { FormProviderWrapper, HiddenWidget, IModel, RowKeyType, useSaveField, useSaveMultiFields, useSectionStatus } from '@fmg/ui';
import { ItemSubtype } from '../fields';
import { Data, TableSearchArgs } from '../fields/TableData/TableData';
import { GeneralFarmContents } from './Content/GeneralFarmContents';
import { MilkContents } from './Content/MilkContents';
import { GeneralCommercialContents } from './Content/GeneralCommercialContents';
import { FixedPlantContents } from './Content/FixedPlantContents';
import { TenantImprovementsContents } from './Content/TenantImprovementsContents';
import { StockContents } from './Content/StockContents';
import { BaledHayContents } from './Content/BaledHayContents';
import { PortablePlantContents } from './Content/PortablePlantContents';
import { useFormContext } from 'react-hook-form';

type WrapperProps = {
  uid: RowKeyType;
  model: IModel<typeof model.table>;
  defaultValues: typeof model.defaultValues | object;
  onSubmit: (data: model.FormValues) => void;
};

const useResetFields = () => {
  const saveMultiFields = useSaveMultiFields();

  return () => {
    saveMultiFields(
      {
        excess: '',
        presentDayValueSumInsured: '',
        nominatedReplacementSumInsured: '',
        basisOfSettlement: '',
        nonCollectionSumInsured: {
          gstExclusive: '',
          gstInclusive: '',
        },
        insuredEvent: '',
        sumInsured: {
          gstExclusive: '',
          gstInclusive: '',
        },
      },
      true
    );
  };
};

export function FormOtherContent({ uid }: { uid: RowKeyType }) {
  const { jobId } = useSectionStatus();

  const [itemSubtype, setItemSubtype] = useState<keyof typeof model.schema>();
  const [shouldReset, setShouldReset] = useState(false);

  useEffect(() => {
    if (itemSubtype) {
      setShouldReset(true);
    }
  }, [itemSubtype]);

  const itemSubtypes = model.itemSubtypes;

  const contentKeptInSearchArgs: TableSearchArgs[] = [
    {
      tableName: 'house',
      searchCriteria: { jobId },
      mapper: (data: Data) => ({ value: data.itemSubtype, label: data.itemSubtype }),
    },
    {
      tableName: 'farmBuilding',
      searchCriteria: { jobId },
      mapper: (data: Data) => ({ value: data.itemSubtype, label: data.itemSubtype }),
    },
    {
      tableName: 'commercialBuilding',
      searchCriteria: { jobId },
      mapper: (data: Data) => ({ value: data.itemSubtype, label: data.itemSubtype }),
    },
  ];

  const ItemSubTypeWrapper = ({ component: Component, shouldReset }: { component: React.ElementType; shouldReset: boolean }) => {
    const saveField = useSaveField();
    const { getValues } = useFormContext();
    const itemSubtypeOption = getValues('itemSubtype');
    const resetFields = useResetFields();

    useEffect(() => {
      if (itemSubtypeOption && !itemSubtype) {
        setItemSubtype(itemSubtypeOption);
      }
    }, [itemSubtypeOption]);

    const handleChangeName = (itemSubtype: string) => {
      if (shouldReset) {
        saveField({ name: 'name', value: itemSubtype }, true);
        resetFields();
        setShouldReset(false);
      } else {
        saveField({ name: 'name', value: itemSubtype }, true);
      }
      setItemSubtype(itemSubtype);
    };

    return <Component onChange={handleChangeName} name="itemSubtype" required />;
  };

  const Wrapper = ({ defaultValues, onSubmit, model, uid }: WrapperProps) => {
    return (
      <FormProviderWrapper
        uid={uid}
        model={model}
        onSubmit={onSubmit}
        mode="all"
        defaultValues={{ itemType: 'otherContent', ...defaultValues }}
      >
        <ItemSubTypeWrapper component={ItemSubtype} shouldReset={shouldReset} />
        {itemSubtype ? (
          <>
            {itemSubtype === itemSubtypes.generalFarm && <GeneralFarmContents />}
            {itemSubtype === itemSubtypes.milk && <MilkContents />}
            {itemSubtype === itemSubtypes.generalCommercial && <GeneralCommercialContents tableSearchArgs={contentKeptInSearchArgs} />}
            {itemSubtype === itemSubtypes.fixedPlant && <FixedPlantContents tableSearchArgs={contentKeptInSearchArgs} />}
            {itemSubtype === itemSubtypes.tenantsImprovements && <TenantImprovementsContents tableSearchArgs={contentKeptInSearchArgs} />}
            {itemSubtype === itemSubtypes.stock && <StockContents tableSearchArgs={contentKeptInSearchArgs} />}
            {itemSubtype === itemSubtypes.baledHay && <BaledHayContents />}
            {itemSubtype === itemSubtypes.portablePlantAndEquip && <PortablePlantContents />}
          </>
        ) : null}
      </FormProviderWrapper>
    );
  };

  return (
    <Fragment>
      <Wrapper
        uid={uid}
        model={{ schema: itemSubtype ? model.schema[itemSubtype] : model.schema.baseSchema, table: model.table }}
        defaultValues={itemSubtype ? model.defaultValues[itemSubtype]?.formDefaults : {}}
        onSubmit={() => {}}
      />
      <div className="my-10"></div>
    </Fragment>
  );
}
