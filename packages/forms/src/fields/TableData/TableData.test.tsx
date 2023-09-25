import { db } from 'models';
import { render, renderHook, screen, waitFor, withFormWrapper } from '@fmg/ui/src/test/test-utils';
import { Data, TableData, TableSearchArgs, useTableData } from './TableData';
import React from 'react';

const houseData: Record<string, string | object>[] = [
  {
    name: 'test',
    sumInsured: {
      gstExclusive: 100,
      gstInclusive: 110,
    },
    excess: '300',
    jobId: '3ae39f99-9a6f-4ab4-81b6-c3108e49eb5b',
    id: '1',
    location: '1 House street',
  },
  {
    name: 'test',
    sumInsured: {
      gstExclusive: 100,
      gstInclusive: 110,
    },
    excess: '300',
    jobId: '4ae39f99-9a6f-4ab4-81b6-c3108e49eb5b',
    id: '2',
    location: '2 House street',
  },
];
const farmBuildingData: Record<string, string | object>[] = [
  {
    id: '1',
    jobId: '3ae39f99-9a6f-4ab4-81b6-c3108e49eb5b',
    location: '1 Farm Street',
  },
  {
    id: '2',
    jobId: '4ae39f99-9a6f-4ab4-81b6-c3108e49eb5b',
    location: '2 Farm Street',
  },
];
const commercialBuildingData: Record<string, string | object>[] = [
  {
    id: '1',
    jobId: '3ae39f99-9a6f-4ab4-81b6-c3108e49eb5b',
    location: '1 Commercial Street',
  },
  {
    id: '2',
    jobId: '4ae39f99-9a6f-4ab4-81b6-c3108e49eb5b',
    location: '2 Commercial Street',
  },
];

const locationMapper = (data: Data) => ({ value: data.location, label: data.location });

const tableSearchArgs: TableSearchArgs[] = [
  {
    tableName: 'house',
    searchCriteria: { jobId: '3ae39f99-9a6f-4ab4-81b6-c3108e49eb5b' },
    mapper: locationMapper,
  },
  {
    tableName: 'farmBuilding',
    searchCriteria: { jobId: '3ae39f99-9a6f-4ab4-81b6-c3108e49eb5b' },
    mapper: locationMapper,
  },
  {
    tableName: 'commercialBuilding',
    searchCriteria: { jobId: '3ae39f99-9a6f-4ab4-81b6-c3108e49eb5b' },
    mapper: locationMapper,
  },
];

beforeEach(async () => {
  await db.house.bulkAdd(houseData);
  await db.farmBuilding.bulkAdd(farmBuildingData);
  await db.commercialBuilding.bulkAdd(commercialBuildingData);
});

afterEach(async () => {
  await db.house.clear();
  await db.farmBuilding.clear();
  await db.commercialBuilding.clear();
});

describe('useTableData', () => {
  it('returns correct results with no search criteria or mapper', async () => {
    const data = houseData.concat(farmBuildingData);

    const searchArgs = [
      {
        tableName: 'house',
      },
      {
        tableName: 'farmBuilding',
      },
    ];

    const { result, rerender } = renderHook(() => useTableData(searchArgs));

    rerender();
    await waitFor(() => {
      expect(result.current).toEqual(data);
    });
  });

  it('returns correct results with criteria and no mapper', async () => {
    const data = houseData
      .concat(farmBuildingData)
      .concat(commercialBuildingData)
      .filter((d) => d.jobId === '3ae39f99-9a6f-4ab4-81b6-c3108e49eb5b');

    const tableSearchArgs: TableSearchArgs[] = [
      {
        tableName: 'house',
        searchCriteria: { jobId: '3ae39f99-9a6f-4ab4-81b6-c3108e49eb5b' },
      },
      {
        tableName: 'farmBuilding',
        searchCriteria: { jobId: '3ae39f99-9a6f-4ab4-81b6-c3108e49eb5b' },
      },
      {
        tableName: 'commercialBuilding',
        searchCriteria: { jobId: '3ae39f99-9a6f-4ab4-81b6-c3108e49eb5b' },
      },
    ];

    const { result, rerender } = renderHook(() => useTableData(tableSearchArgs));

    rerender();
    await waitFor(() => {
      expect(result.current).toEqual(data);
    });
  });

  it('returns correct results with criteria and mapper', async () => {
    const data = [
      { value: houseData[0].location, label: houseData[0].location },
      { value: farmBuildingData[0].location, label: farmBuildingData[0].location },
      { value: commercialBuildingData[0].location, label: commercialBuildingData[0].location },
    ];

    const tableSearchArgs: TableSearchArgs[] = [
      {
        tableName: 'house',
        searchCriteria: { jobId: '3ae39f99-9a6f-4ab4-81b6-c3108e49eb5b' },
        mapper: locationMapper,
      },
      {
        tableName: 'farmBuilding',
        searchCriteria: { jobId: '3ae39f99-9a6f-4ab4-81b6-c3108e49eb5b' },
        mapper: locationMapper,
      },
      {
        tableName: 'commercialBuilding',
        searchCriteria: { jobId: '3ae39f99-9a6f-4ab4-81b6-c3108e49eb5b' },
        mapper: locationMapper,
      },
    ];

    const { result, rerender } = renderHook(() => useTableData(tableSearchArgs));

    rerender();
    await waitFor(() => {
      expect(result.current).toEqual(data);
    });
  });
});

describe('<TableData />', () => {
  it('should render correctly', async () => {
    const stateSetter = vi.fn();

    vi.spyOn(React, 'useState').mockImplementation(() => [{ label: 'labelmock', value: 'labelmock' }, stateSetter]);

    const wrapper = withFormWrapper({ defaultValues: {} });
    render(<TableData name="location" question="TableData" tableSearchArgs={tableSearchArgs} />, { wrapper });
    expect(screen.getByText('labelmock')).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).toBeInTheDocument();
  });
});
