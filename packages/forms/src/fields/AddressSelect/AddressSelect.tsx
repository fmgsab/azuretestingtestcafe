import React, { useEffect, useState } from 'react';
import { db } from 'models/src/@database';
import { DropdownWidget, UseScopeProps } from '@fmg/ui';

type Mode = 'physical';
type Address = {
  sourceDesc: string;
};
export function AddressSelect({
  name,
  question,
  mode,
  scope = {},
}: {
  name: string;
  question: string;
  mode?: Mode;
  scope?: UseScopeProps;
}) {
  const options = useAddressList({ name, mode });
  return <DropdownWidget name={name} question={question} options={options} required={true} size={10} scope={scope} />;
}

const modeFilter = (mode?: Mode) => {
  switch (mode) {
    case 'physical':
      return (addr: Address) => ['Physical', 'Postal/Physical'].includes(addr.sourceDesc);
    default:
      return () => true;
  }
};

export function useAddressList({ name, mode }: { name: string; mode?: Mode }) {
  const [options, setOptions] = useState<{ value: string; label: string }[]>();

  useEffect(() => {
    getAddressList({ name }).then((addresses) => {
      setOptions(
        addresses?.filter(modeFilter(mode)).map((address) => ({ value: `${address.fullAddress}`, label: `${address.fullAddress}` }))
      );
    });
  }, [name, mode]);

  return options;
}

async function getAddressList({ name }: { name: string }) {
  const table = await db.tables.find((t) => t.name === name);
  return table?.toArray();
}
