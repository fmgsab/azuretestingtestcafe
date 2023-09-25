import { db } from 'models/src/@database';
import { RowKeyType } from '../../../types';

export const contactId = 'contact_2';
export const jobId: RowKeyType = 2;

const sections = [
  {
    title: 'Account',
    sectionList: [
      {
        name: 'Key Information',
        table: db.keyInfo,
        uid: { jobId, type: db.keyInfo?.name },
        isGroup: false,
      },
      {
        name: 'Your Business',
        table: db.businessInfo,
        uid: { jobId, type: db.businessInfo?.name },
        isGroup: true,
      },
      {
        name: 'Locations',
        table: db.location,
        uid: { jobId, type: db.location?.name },
        isGroup: false,
      },
    ],
  },
  {
    title: 'Declarations',
    sectionList: [
      {
        name: 'Disclosure Statement',
        table: db.disclosure,
        uid: { jobId, type: db.disclosure?.name },
        isGroup: false,
      },
      {
        name: 'GI Questions',
        table: db.giQuestion,
        uid: { jobId, type: db.giQuestion?.name },
        isGroup: false,
      },
      {
        name: 'Client Acknowledgement',
        table: db.acknowledgement,
        uid: { jobId, type: db.acknowledgement?.name },
        isGroup: false,
      },
    ],
  },
  {
    title: 'Risk',
    sectionList: [
      {
        name: 'Kiwifruit',
        table: db.kiwifruit,
        uid: { jobId, type: db.kiwifruit?.name },
        isGroup: true,
      },
      {
        name: 'Orchard Fruit',
        table: db.orchard,
        uid: { jobId, type: db.orchard?.name },
        isGroup: true,
      },
      {
        name: 'Goods in Transit',
        table: db.transit,
        uid: { jobId, type: db.transit?.name },
        isGroup: true,
      },
      {
        name: 'Liability ',
        table: db.liability,
        uid: { jobId, type: db.liability?.name },
        isGroup: true,
      },
      {
        name: 'Contract Works',
        table: db.contractWork,
        uid: { jobId, type: db.contractWork?.name },
        isGroup: true,
      },
      { name: 'Crop', table: db.crop, uid: { jobId, type: db.crop?.name }, isGroup: true },
      {
        name: 'Livestock / Animals',
        table: db.livestock,
        uid: { jobId, type: db.livestock?.name },
        isGroup: true,
      },
      {
        name: 'Life & Health Referral',
        table: db.lifeHealthReferral,
        uid: { jobId, type: db.lifeHealthReferral?.name },
        isGroup: false,
      },
      {
        name: 'Specialty Risk Referrals',
        table: db.specialtyRisk,
        uid: { jobId, type: db.specialtyRisk?.name },
        isGroup: true,
      },
    ],
  },
];

export default sections;
