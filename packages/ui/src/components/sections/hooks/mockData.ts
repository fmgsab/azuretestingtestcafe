import { MockDB } from '../../../test/mock-model-sections';
import { RowKeyType } from '../../../types';

const jobId = 'test_1';
const contactId = 'test_1';
const db = new MockDB();
export const sectionLists = [
  {
    title: 'Account',
    sectionList: [
      {
        name: 'Key Information',
        table: db.keyInfo,
        uid: { contactId: contactId, jobId: jobId, type: 'keyInfo' },
        isGroup: false,
      },
    ],
  },
  {
    title: 'Declarations',
    sectionList: [
      {
        name: 'Disclosure Statement',
        table: db.disclosureStatement,
        uid: { contactId: contactId, jobId: jobId, type: 'disclosureStatement' },
        isGroup: false,
      },
    ],
  },
  {
    title: 'Risk',
    sectionList: [
      { name: 'house', table: db.house, uid: { contactId: contactId, jobId: jobId, type: 'house' }, isGroup: true },
      {
        name: 'Household Contents',
        table: db.householdContent,
        uid: { contactId: contactId, jobId: jobId, type: 'householdContent' },
        isGroup: true,
      },
      {
        name: 'Farm Buildings',
        table: db.farmBuilding,
        uid: { contactId: contactId, jobId: jobId, type: 'farmBuilding' },
        isGroup: true,
      },
    ],
  },
];

const riskItem = (n: RowKeyType, tableName: string) => ({
  contactId: contactId,
  jobId: jobId,
  type: tableName,
  name: 'MockType',
  tableName: tableName,
  hasStarted: true,
  id: n,
  hasCompleted: true,
  hasError: false,
});

const getNRiskItems = (count: number, tableName: string) => {
  const returnArray = [];
  for (let i = 0; i < count; i++) {
    returnArray.push(riskItem(String(i + 1), tableName));
  }
  return returnArray;
};

// Case 1A not-first of many
export const mockData1A = [
  getNRiskItems(1, 'keyInfo'),
  getNRiskItems(1, 'disclosureStatement'),
  getNRiskItems(0, 'house'),
  getNRiskItems(2, 'householdContent'),
  getNRiskItems(0, 'farmBuilding'),
];

// Case 1B first of many
export const mockData1B = mockData1A;

// Case 2A Only item with items above
export const mockData2A = [
  getNRiskItems(1, 'keyInfo'),
  getNRiskItems(1, 'disclosureStatement'),
  getNRiskItems(2, 'house'),
  getNRiskItems(1, 'householdContent'),
  getNRiskItems(0, 'farmBuilding'),
];

// Case 2B Only item with no items above but items below
export const mockData2B = [
  getNRiskItems(1, 'keyInfo'),
  getNRiskItems(1, 'disclosureStatement'),
  getNRiskItems(0, 'house'),
  getNRiskItems(1, 'householdContent'),
  getNRiskItems(2, 'farmBuilding'),
];

// Case 2C Only item with no items above or below
export const mockData2C = [
  getNRiskItems(1, 'keyInfo'),
  getNRiskItems(1, 'disclosureStatement'),
  getNRiskItems(0, 'house'),
  getNRiskItems(1, 'householdContent'),
  getNRiskItems(0, 'farmBuilding'),
];
