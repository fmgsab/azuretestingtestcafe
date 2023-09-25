import colorsDesign from './colors.json';
import { useState } from 'react';
import classnames from 'classnames';

type Color = {
  id: string;
  isInTw: boolean;
  order: number;
  hex: {
    string: string;
  };
  hsl: {
    string: string;
    h: number;
    s: number;
    l: number;
  };
  hsla: {
    string: string;
    h: number;
    s: number;
    l: number;
    a: number;
  };
  rgba: {
    string: string;
    r: number;
    g: number;
    b: number;
    a: number;
  };
};

const sortMap = {
  hex: sortHex,
  rgba: sortHex,
  hsla: sortHsla,
  hsl: sortHsl,
};

export function Colors() {
  const [colors, setColors] = useState<Color[]>(colorsDesign);
  const [sortBy, setSortBy] = useState('custom');
  const [filter, setFilter] = useState(true);

  function handleSort(key: string) {
    setSortBy(key);

    if (key === 'custom') {
      setColors(colors.sort(sortCustom));
      return;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setColors(colors.sort(sortMap[key]));
  }

  const filteredColors = filter ? colors.filter((c) => c.isInTw) : colors;

  return (
    <div style={{ height: 'calc(100vh - 32px)' }} className="flex flex-col">
      <div className="mb pl-3 pr-2">
        <SortButton label={'custom'} handler={() => handleSort('custom')} isActive={'custom' === sortBy} className="mb-3" />
        <div className="flex justify-start">
          <div className="mb-3">
            <SortButton label={'TW'} handler={() => setFilter(!filter)} isActive={filter} />
          </div>
          {Object.keys(sortMap).map((key, keyIndex) => (
            <div className="mb-3 flex-1" key={keyIndex}>
              <SortButton label={key} handler={() => handleSort(key)} isActive={key === sortBy} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ul>
          {filteredColors.map((c, cIndex) => {
            const [whole, part] = `${c.hsl.l}`.split('.');
            return (
              <li key={cIndex} className="my hover:bg-slate-200">
                <div className="flex justify-start" style={{ fontFamily: 'monospace' }}>
                  <span className="w-5">{cIndex + 1}</span>
                  <div className="w-8">{c.isInTw ? <span>&#9989;</span> : ''}</div>
                  <div className=" flex flex-1 px-3">
                    <div className="mr-6 h-5 w-10 border border-black px-3" style={{ backgroundColor: c.hex.string }}></div>
                    <div className="flex-1 px-3">{c.hex.string}</div>
                  </div>
                  <div className=" flex flex-1 px-3">
                    <div className="mr-6 h-5 w-10 border border-black px-3" style={{ backgroundColor: c.rgba.string }}></div>
                    <div className="flex w-8 justify-end">{`${c.rgba.r}`.padStart(3, ' ')},</div>
                    <div className="flex w-8 justify-end">{`${c.rgba.g}`.padStart(3, ' ')},</div>
                    <div className="flex w-8 justify-end">{`${c.rgba.b}`.padStart(3, ' ')},</div>
                    <div className="ml-2 w-8">{`${c.rgba.a}`}</div>
                  </div>
                  <div className="flex flex-1 px-3">
                    <div className="mr-6 h-5 w-10 border border-black px-3" style={{ backgroundColor: c.hsla.string }}></div>
                    <div className="flex w-8 justify-end">{`${c.hsla.h}`.padStart(3, ' ')},</div>
                    <div className="flex w-8 justify-end">{`${c.hsla.s}`.padStart(3, ' ')},</div>
                    <div className="flex w-8 justify-end">{`${c.hsla.l}`.padStart(3, ' ')},</div>
                    <div className="ml-2 w-8">{`${c.hsla.a}`}</div>
                  </div>
                  <div className="flex flex-1 px-3">
                    <div className="mr-6 h-5 w-10 border border-black px-3" style={{ backgroundColor: c.hsla.string }}></div>
                    <div className="mr-6 h-5 w-10 border border-black px-3" style={{ backgroundColor: c.hsl.string }}></div>
                    <div className="flex w-8 justify-end">{`${c.hsl.h}`.padStart(3, ' ')},</div>
                    <div className="flex w-8 justify-end">{`${c.hsl.s}`.padStart(3, ' ')},</div>
                    <div className="ml-2 flex w-10">
                      <span className="w-6 text-end">{whole}</span>
                      <span className="justify-start">{part ? `.${part}` : ''}</span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

type SortButtonType = {
  handler: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isActive: boolean;
  label: string;
  className?: string;
};

function SortButton({ handler, isActive, label, className }: SortButtonType) {
  return (
    <button
      className={classnames('rounded px-3 hover:bg-slate-200', {
        'bg-slate-100': !isActive,
        'border border-slate-500 bg-slate-300 hover:bg-slate-400': isActive,
        [`${className}`]: className,
      })}
      onClick={handler}
    >
      {label}
    </button>
  );
}

function sortHex(a: Color, b: Color) {
  return a.hex.string.localeCompare(b.hex.string);
}

function sortHsla(a: Color, b: Color, dir = 1) {
  const hResult = dir * (a.hsla.h - b.hsla.h);
  const sResult = hResult === 0 ? dir * (a.hsla.s - b.hsla.s) : hResult;
  const lResult = sResult === 0 ? dir * (a.hsla.l - b.hsla.l) : sResult;
  return lResult === 0 ? dir * (a.hsla.a - b.hsla.a) : lResult;
}

function sortHsl(a: Color, b: Color) {
  return a.hsl.l - b.hsl.l;
}

function sortCustom(a: Color, b: Color) {
  return a.order - b.order;
}
