import React from 'react';
import { RadioGroupWidget, Scope, SumInsuredWidget } from '@fmg/ui';
import { nq } from 'models';

export function ClientProvideSumInsured({ question = nq.sumInsured.question }) {
  return (
    <Scope highlight>
      <Scope.Source>
        <RadioGroupWidget
          name={nq.overrideSystemSumInsured.name}
          question={nq.overrideSystemSumInsured.question}
          options={[
            { label: 'Use system calculation', value: nq.false.name },
            { label: nq.yes.question, value: nq.true.name },
          ]}
          required
        />
      </Scope.Source>
      <Scope.Target condition={(override) => override && nq.true.name === override}>
        <SumInsuredWidget name={nq.sumInsured.name} question={question} required />
      </Scope.Target>
    </Scope>
  );
}
