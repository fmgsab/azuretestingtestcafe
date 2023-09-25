import lookupJson from 'models/src/data-dictionary/lookup-data.json';
import classnames from 'classnames';
import { ReactNode, useState } from 'react';

const optionsOrder = [
  { id: 'keyValue', label: 'Key+Value' },
  { id: 'conditional', label: 'Conditional' },
  { id: 'simple', label: 'Simple' },
];
const noShowKeys = ['name', 'value', 'label'];
const showListGroups = getListsByComplexity(lookupJson);
type ChildrenProps = React.PropsWithChildren<object>;
interface ButtonProps {
  children?: ReactNode | string;
  className?: string;
}

type JSONValue = string | number | boolean | JSONObject | JSONArray | undefined | null;
interface JSONObject {
  [x: string]: JSONValue;
}
type JSONArray = Array<JSONValue>;

export function Lookup() {
  const [listKey, setListKey] = useState('');
  const [levelDownSelectedKeys, setLevelDownSelectedKeys] = useState([]);
  const [filterPairs, setFilterPairs] = useState({});
  const displayData = getDisplayData(lookupJson, listKey);
  const levelDownKeys = getLevelDownKeys(lookupJson, listKey);

  function handleLevelDownSelectedClick(value: string, key: string) {
    const newFilterPairs = { ...filterPairs, [key]: value };
    setFilterPairs(newFilterPairs);
  }

  function handleLevel0Select(key: string) {
    setListKey(key);
    setLevelDownSelectedKeys([]);
    setFilterPairs({});
  }

  function LookupFormArea() {
    return (
      <div className="flex h-full flex-1 flex-col overflow-auto px-4 py-2">
        <div className="flex">
          <Select
            name="listKeySelect"
            onChange={(e) => handleLevel0Select(e?.target?.value)}
            selected={listKey}
            options={showListGroups}
            placeholder="Select data key..."
            className=""
            label="List to show: "
          />
        </div>
        <h1 className={classnames('text-sm font-bold')}>Sub filters</h1>
        <div className={classnames('flex-wrap')}>
          {Array.isArray(levelDownKeys)
            ? levelDownKeys
                ?.filter((k) => !levelDownSelectedKeys.includes(k))
                ?.map((key: any) => {
                  return (
                    <>
                      <div className={classnames('py-0.5')}>
                        <Select
                          name="sublistKeySelect"
                          onChange={(e) => handleLevelDownSelectedClick(e?.target?.value, key)}
                          selected={(filterPairs as any)[key]}
                          options={getSublist(lookupJson, listKey, key)}
                          placeholder="Select data key..."
                          className=""
                          label={key + ': '}
                        />
                      </div>
                    </>
                  );
                })
            : null}
        </div>
        <Button onClick={() => setFilterPairs({})} className={classnames('w-fit flex-wrap hover:bg-red-100')}>
          Clear filters
        </Button>
        <h1 className={classnames('text-md font-bold')}>Filtered {listKey} results</h1>
        <div className={classnames('mb-2 flex-[2] overflow-auto  border-4 border-gray-200 p-2')}>
          {displayData?.map((val: any, valIndex: number) =>
            matchesFilters(val) ? (
              <p className={classnames('border-b-2 border-blue-300')} key={valIndex}>
                {JSON.stringify(val, null, 4)}
              </p>
            ) : (
              ''
            )
          )}
        </div>
        <h1 className={classnames('text-md font-bold')}>All {listKey} results</h1>
        <div className={classnames('border-3 flex-1 overflow-auto border-4 border-gray-200 p-2')}>
          {displayData?.map((val: any, valIndex: number) => (
            <p className={classnames('border-b-2 border-blue-300')} key={valIndex}>
              {JSON.stringify(val, null, 4)}
            </p>
          ))}
        </div>
      </div>
    );
  }

  /**
   * Check that val contains every key/value pair within filterPairs
   */
  function matchesFilters(val: any): boolean {
    let matches = 0;
    for (const key in val) {
      if ((filterPairs as any)[key] !== undefined) {
        if (val[key].includes((filterPairs as any)[key])) {
          matches++;
        }
      }
    }
    return matches === Object.keys(filterPairs).length;
  }

  function LookupWrapper({ children }: ChildrenProps) {
    return (
      <div style={{ height: 'calc(100vh - 32px)' }} className={classnames('flex flex-col overflow-hidden')}>
        {children}
      </div>
    );
  }

  function LookupHeader() {
    return (
      <div className={classnames('w-full')}>
        <h3 className={classnames('text-center text-lg font-bold')}>Lookup Data Viewer</h3>
      </div>
    );
  }

  function LookupAllJson() {
    return (
      <div className="border-gray-25 h-full w-[400px] border-r p-2">
        <h2 className={classnames('font-bold')}>All lookup data</h2>
        <pre className="h-full overflow-auto">{JSON.stringify(lookupJson, null, 4)}</pre>
      </div>
    );
  }

  function LookupMain({ children }: ChildrenProps) {
    return <div className={classnames('flex flex-1 overflow-hidden border border-purple-300')}>{children}</div>;
  }

  return (
    <LookupWrapper>
      <LookupHeader />
      <LookupMain>
        <LookupAllJson />
        <LookupFormArea />
      </LookupMain>
    </LookupWrapper>
  );
}

function getListsByComplexity(json: JSONObject) {
  const lookupEntries = Object.entries(json);
  const simple: JSONArray[] = [];
  const keyValue: JSONArray[] = [];
  const conditional: JSONArray[] = [];

  lookupEntries.forEach(([key, value]: [string, any]) => {
    if (typeof value[0] === 'string' || typeof value[0] === 'number') {
      simple.push([key, value]);
      return;
    }

    if (Array.isArray(value) && Object.values(value[0]).every((v) => typeof v === 'string')) {
      keyValue.push([key, value]);
      return;
    }

    conditional.push([key, value]);
  });

  simple.sort();
  keyValue.sort();
  conditional.sort();

  const all = {
    simple,
    keyValue,
    conditional,
  };
  return optionsOrder.map((k) => (all as any)[k.id]);
}

function getSublist(json: JSONObject, key: string, subKey: string) {
  const lookupEntries = Object.entries(json);
  const keyValue: JSONArray[] = [];
  const filteredEntries = lookupEntries.filter((a) => a[0] === key)[0][1];

  (filteredEntries as any).forEach((obj: any) => {
    Object.keys(obj).forEach((key) => {
      if (key === subKey) {
        try {
          obj[key].forEach((option: string) => {
            if (keyValue.flat().indexOf(option) === -1) {
              keyValue.push([option, obj[key]]);
            }
          });
        } catch (e) {
          console.log('Failed sublist generation');
        }
      }
    });
  });

  const all = {
    keyValue,
  };
  return optionsOrder.map((k) => (all as any)[k.id]);
}

function getDisplayData(json: any, key: string) {
  return json[key];
}

function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={classnames('bg-slate-200 px-2 active:bg-slate-200', {
        [className]: className,
      })}
    >
      {children}
    </button>
  );
}

function Select({
  name,
  label,
  options,
  onChange,
  className,
  selected,
  placeholder,
}: {
  name: string;
  label: string;
  options: string[][];
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  className: string;
  selected: string;
  placeholder: string;
}) {
  const id = `lookup-select-${name}`;

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={selected}
        onChange={onChange}
        name={name}
        className={classnames('bg-slate-100', { [className]: className })}
        placeholder={placeholder}
      >
        {options.map((optionGroup, opGroupIndex) => {
          return (
            <optgroup key={optionsOrder[opGroupIndex].id} label={optionsOrder[opGroupIndex].label}>
              {optionGroup?.map((op) => (
                <option key={op[0]} value={op[0]}>
                  {op[0]}
                </option>
              ))}
            </optgroup>
          );
        })}
      </select>
    </div>
  );
}

function getLevelDownKeys(json: JSONObject, key: string) {
  const level0 = json[key];
  const isArray = Array.isArray(level0);

  if (!isArray) return 'not sure what to do with this...';

  let level1Objects = 0;

  for (const level0Element of level0) {
    if (Array.isArray(level0Element)) {
      continue;
    }
    if (typeof level0Element === 'object') {
      level1Objects += 1;
    }
  }

  return level1Objects > 0 ? getKeysAllElements(level0) : 'no keys';
}

function getKeysAllElements(inArray: string[]) {
  const uniques = new Set();
  for (const inArrayElement of inArray) {
    const keys = Object.keys(inArrayElement);
    keys.forEach((k) => {
      uniques.add(k);
    });
  }
  const uniquesArray = Array.from(uniques);
  return uniquesArray.filter((v) => !noShowKeys.includes(v as string));
}
