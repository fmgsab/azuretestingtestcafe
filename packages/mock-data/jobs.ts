import { faker } from '@faker-js/faker';
import { date } from '@fmg/utils';

const workItem = () => {
  const isComplete = faker.datatype.boolean();
  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    description: faker.person.fullName(),
    timestamp: date(faker.date.recent({ days: 3 }).toISOString()),
    completeState: [isComplete, ['In progress', 'Submitted'].at(Number(isComplete))],
  };
};

const job = () => {
  const isComplete = faker.datatype.boolean();
  const viewed = date(faker.date.recent({ days: 3 }).toISOString());
  return {
    id: faker.string.uuid(),
    accountName: faker.company.name(),
    accountHolder: faker.person.fullName(),
    viewed,
    closed: isComplete ? date(faker.date.recent().toISOString()) : '',
  };
};

export const createJobs = (num: number) => {
  return Array.from(Array(num).keys()).map(() => job());
};

export const createWorkItemData = (num: number) => {
  return Array.from(Array(num).keys()).map(() => workItem());
};
