import { resolveStatus } from '../../sections/MultiSection/multiSectionResolver';
import { SectionItemGroupType, SectionListsType } from '../../../db/section-types';
import { RowKeyType } from '../../../types';

export const commandOptions = {
  'all complete': 'complete',
  'all incomplete': 'incomplete',
  'none started': 'not started',
};

export const tabNames = ['Account', 'Declarations', 'Risk'];
export default async function statusResolver(
  tab: string,
  command: string,
  sectionsList: {
    jobId: RowKeyType;
    contactId: string;
    sections: { title: string; sectionList: SectionItemGroupType[] }[];
  }
) {
  if (!tabNames.includes(tab) || !Object.keys(commandOptions).includes(command)) return;

  const { sections } = sectionsList;

  // Set all the fields relevant to Accounts & Declarations
  if (tab === 'Account') {
    const AccountDeclarationsSections = sections
      .filter((group) => ['Account', 'Declarations'].includes(group.title))
      .flatMap((s) => s.sectionList);

    for (const section of AccountDeclarationsSections) {
      await updateTableEntries(section, commandOptions[command as keyof typeof commandOptions]);
    }
  }

  // Set all the fields relevant to Risk
  if (tab === 'Risk') {
    const Risks = sections.filter((group: { title: string }) => ['Risk'].includes(group.title));
    const RisksSections = [...Risks[0].sectionList];

    for (const section of RisksSections) {
      await updateTableEntries(section, commandOptions[command as keyof typeof commandOptions]);
    }
  }
}

async function updateTableEntries(section: SectionItemGroupType, status: string) {
  const table = section.table;
  const tableData = await table.where(section.uid).toArray();
  const ids = tableData.map((data: { id: string }) => data.id);

  ids.forEach((id: string) => {
    table.update(id, resolveStatus(status));
  });
}

export async function setInitialSelectedId(sections: SectionListsType, setSelectedSectionId: (id: unknown) => void) {
  const section = sections[0].sectionList[0];
  const tableData = await section.table.where(section.uid).toArray();
  setSelectedSectionId(`${section.table.name}_${tableData[0].id}`);
}
