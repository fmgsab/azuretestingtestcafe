import { db } from 'models/src/@database';
import { RowKeyType } from '../../../types';

export const contactId = 'contact_1';
export const jobId: RowKeyType = 1;
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
      { name: 'Houses', table: db.house, uid: { jobId, type: db.house?.name }, isGroup: true },
      {
        name: 'Household Contents',
        table: db.content,
        uid: { jobId, type: db.content?.name },
        isGroup: true,
      },
      {
        name: 'Farm Buildings',
        table: db.farmBuilding,
        uid: { jobId, type: db.farmBuilding?.name },
        isGroup: true,
      },
      {
        name: 'Commercial Buildings',
        table: db.commercialBuilding,
        uid: { jobId, type: db.commercialBuilding?.name },
        isGroup: true,
      },
      {
        name: 'Other Contents',
        table: db.otherContent,
        uid: { jobId, type: db.otherContent?.name },
        isGroup: true,
      },
      {
        name: 'Business Interruption',
        table: db.busInterruption,
        uid: { jobId, type: db.busInterruption?.name },
        isGroup: true,
      },
      {
        name: 'Vehicles',
        table: db.vehicle,
        uid: { jobId, type: db.vehicle?.name },
        isGroup: true,
      },
      {
        name: 'Watercraft',
        table: db.watercraft,
        uid: { jobId, type: db.watercraft?.name },
        isGroup: true,
      },
      {
        name: 'Liability ',
        table: db.liability,
        uid: { jobId, type: db.liability?.name },
        isGroup: true,
      },
      { name: 'Animals', table: db.animal, uid: { jobId, type: db.animal?.name }, isGroup: true },
      {
        name: 'Grouped Vehicles',
        table: db.fleet,
        uid: { jobId, type: db.fleet?.name },
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
