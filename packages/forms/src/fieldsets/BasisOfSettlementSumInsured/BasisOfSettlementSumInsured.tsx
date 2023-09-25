import { BasisOfSettlement, SumInsured } from '../../fields';
import { settlementTypes } from 'models';
import React, { Fragment } from 'react';

export const BasisOfSettlementSumInsured = () => {
  return (
    <>
      <BasisOfSettlement />
      <SumInsured name="presentDayValueSumInsured" question="Present day value" required />
      <SumInsured
        name="nominatedReplacementSumInsured"
        question="Nominated replacement"
        scope={{
          source: 'basisOfSettlement',
          condition: settlementTypes.nominatedReplacementValue,
        }}
        required
      />
    </>
  );
};
