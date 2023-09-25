export const roles = {
  accountHolder: 'Account Holder',
  accountant: 'Accountant',
  authorityToAct: 'Authority To Act',
  director: 'Director',
  driver: 'Driver',
  employeeEmployer: 'Employee/Employer',
  executor: 'Executor',
  familyRelation: 'Family Relation',
  jointAccountHolder: 'Joint Account Holder',
  lawyer: 'Lawyer',
  namedInsured: 'Named Insured',
  powerOfAttorney: 'Power of Attorney',
  secondaryContact: 'Secondary Contact',
  shareholder: 'Shareholder',
  trustee: 'Trustee',
};

export const itemTypes = {
  house: { value: 'house', label: 'Houses' },
  content: { value: 'content', label: 'Household Contents' },
  farmBuilding: { value: 'farmBuilding', label: 'Farm Buildings' },
  commercialBuilding: { value: 'commercialBuilding', label: 'Commercial Buildings' },
  otherContent: { value: 'otherContent', label: 'Other Contents' },
  busInterruption: { value: 'busInterruption', label: 'Business Interruption' },
  vehicle: { value: 'vehicle', label: 'Vehicles' },
  watercraft: { value: 'watercraft', label: 'Watercraft' },
  liability: { value: 'liability', label: 'Liability' },
  animal: { value: 'animal', label: 'Animals' },
  fleet: { value: 'fleet', label: 'Grouped Vehicles' },
  specialtyRisk: { value: 'specialtyRisk', label: 'Specialty Risk Referrals' },
  kiwifruit: { value: 'kiwifruit', label: 'Kiwifruit' },
  orchard: { value: 'orchard', label: 'Orchard Fruit' },
  transit: { value: 'transit', label: 'Goods in Transit' },
  crop: { value: 'crop', label: 'Crop' },
  contractWork: { value: 'contractWork', label: 'Contract Works' },
  livestock: { value: 'livestock', label: 'Livestock / Animals' },
};

export const itemSubtypes = {
  vehicle: {
    cvu: 'Car, Van or Ute',
    tractor: 'Tractor',
    unspecifiedFarmVehicles: 'Unspecified farm vehicles',
    trailer: 'Trailer',
    atv: 'All terrain vehicle / quad bike',
    truck: 'Truck',
    drawn: 'Other Implement (drawn)',
    digger: 'Digger/excavator',
    irrigatorCentre: 'Irrigator - centre pivot',
    utv: 'Off road utility task vehicle',
    motorbike: 'Motorbike',
    mower: 'Mower',
    wagon: 'Wagon (feed out/silage)',
    caravan: 'Caravan',
    spreader: 'Spreader',
    selfPowered: 'Other Vehicle (self powered)',
    irrigatorTravelling: 'Irrigator - travelling',
    forkLift: 'Fork lift',
    horseFloat: 'Horse float',
    baler: 'Baler',
    sprayEquipment: 'Spray equipment',
    rideOnMower: 'Ride-on mower',
    postRammer: 'Post rammer',
    motorhome: 'Motorhome',
    bulldozer: 'Bulldozer',
    forageHarvester: 'Forage harvester',
    hydraLadder: 'Hydra ladder',
    horseTruck: 'Horse truck',
    powerHarrow: 'Power harrow',
    fel: 'Front end loader(FEL)/bucket/fork',
    header: 'Header',
    irrigatorLinear: 'Irrigator - linear',
    roundBaler: 'Round baler',
    crate: 'Crate',
  },
  house: {
    dwelling: 'Dwelling',
  },
  farmBuilding: {
    implementShed: 'Implement Shed',
    ufb: 'Unspecified Farm Buildings',
    hayshed: 'Hayshed',
    workshop: 'Workshop',
    woolshed: 'Woolshed',
    dairyShed: 'Dairy Shed',
    pumpShed: 'Pump Shed',
    otherSpecifiedBuilding: 'Other Specified Building',
    farmFencing: 'Farm Fencing',
    boreAndWellShaft: 'Bore and Well Shaft',
    office: 'Office',
    calfShed: 'Calf Shed',
    poultryShed: 'Poultry Shed',
    bridge: 'Bridge',
    unspecifiedCulverts: 'Unspecified Culverts',
    silo: 'Silo / Vat',
    windmachine: 'Windmachine',
    deerShed: 'Deer Shed',
    stables: 'Stables',
    plasticHouse: 'Plastic house',
    fertiliser: 'Fertiliser / Manure Bin',
    coveredYards: 'Covered Yards',
    specifiedCulvert: 'Specified Culvert',
    growingStructure: 'Growing Structure',
    herdHome: 'Herd Home',
    winteringBarn: 'Wintering Barn',
    coolstore: 'Coolstore',
    barn: 'Barn',
    packhouse: 'Packhouse',
    piggery: 'Piggery',
    fixedPlant: 'Fixed Plant',
    underpass: 'Underpass',
    glassHouse: 'Glass house',
    shelterBelt: 'Shelter Belt',
    openSidedBuilding: 'Open Sided Building',
    cowShelter: 'Cow Shelter',
    powerPole: 'Power Pole',
  },
  commercialBuilding: {
    implementShed: 'Implement Shed',
    hayshed: 'Hayshed',
    workshop: 'Workshop',
    otherSpecifiedBuilding: 'Other Specified Building',
    office: 'Office',
    motel: 'Motel',
    poultryShed: 'Poultry Shed',
    warehouse: 'Warehouse',
    retailShop: 'Retail Shop',
    stables: 'Stables',
    plasticHouse: 'Plastic house',
    growingStructure: 'Growing Structure',
    herdHome: 'Herd Home',
    coolstore: 'Coolstore',
    packhouse: 'Packhouse',
    piggery: 'Piggery',
    restaurant: 'Restaurant/Cafe',
    factory: 'Factory',
    multiUnit: 'Multi Unit / Body Corporate',
    glassHouse: 'Glass house',
    hall: 'Hall',
    resthome: 'Resthome',
    hotel: 'Hotel',
    church: 'Church',
    wineryBuilding: 'Winery Building',
    petrolStation: 'Petrol Station',
    kindergarten: 'Kindergarten',
    sportsClub: 'Sports Club',
  },
  content: {
    household: 'Household contents',
    landlords: "Landlord's contents",
    holidayHome: 'Holiday home contents',
  },
  otherContent: {
    generalFarm: 'General Farm Contents',
    milk: 'Milk',
    baledHay: 'Baled Hay',
    generalCommercial: 'General Commercial Contents',
    fixedPlant: 'Fixed Plant',
    tenantsImprovements: "Tenant's Improvements",
    stock: 'Stock',
    portablePlantAndEquip: 'Portable Plant & Equipment',
  },
  busInterruption: {
    dairyFarm: 'Dairy Farm',
    commercial: 'Commercial',
    nonDairyFarm: 'Non Dairy Farm',
    horticultural: 'Horticultural',
    isDairyFarm: (itemSubtype: unknown): boolean => Boolean(itemSubtype) && itemSubtype === 'Dairy Farm',
    isCommercial: (itemSubtype: unknown): boolean => Boolean(itemSubtype) && itemSubtype === 'Commercial',
    isHorticultural: (itemSubtype: unknown): boolean => Boolean(itemSubtype) && itemSubtype === 'Horticultural',
    isNonHorticultural: (itemSubtype: unknown): boolean => Boolean(itemSubtype) && itemSubtype !== 'Horticultural',
  },
  watercraft: {
    canoeKayak: 'Canoe/Kayak',
    dinghyInflatable: 'Dinghy/Inflatable Craft',
    dinghyRowTender: 'Dinghy/Row boat/Tender',
    jetSki: 'Jet Ski',
    paddleSurfBoard: 'Paddleboard/Surf board',
    powerBoat: 'Power Boat',
    sailBoatYacht: 'Sail Boat/Yacht',
    sailBoatUnpowered: 'Sail boat (unpowered/no motor)',
    windKiteSurfer: 'Windsurfer/Kite surfer',
    otherBoat: 'Other boat (unpowered/no motor)',
  },
};

export const usages = {
  private: 'Private',
  farm: 'Farm',
  commercial: 'Commercial',
};

export const occupancies = {
  owner: 'Owner/Family Member',
  tenanted: 'Tenanted',
  employee: 'Employee',
  holidayHome: 'Holiday Home',
  ownerOccupied: 'Owner occupied',
  unoccupied: 'Unoccupied',
};

export const commonAreaTypes = {
  driveWaysOnly: 'Driveways only',
  other: 'Other',
};

export const propertyTypes = {
  ruralLifestyle: 'Rural/Lifestyle',
};

export const buildingAreaTypes = {
  domesticUnit: 'Domestic Unit',
  garageStandAlone: 'Garage - Stand alone',
  balconyDeck: 'Balcony/Deck',
  carport: 'Carport',
  porchVerandah: 'Porch/Verandah',
  sleepout: 'Sleepout (no plumbing)',
  garageBasement: 'Garage - basement',
  selfContainedUnit: 'Self contained unit',
  swimmingPool: 'Swimming pool',
  gardenShed: 'Garden shed',
  tennisCourt: 'Tennis Court',
  glasshouse: 'Glasshouse',
  domesticShed: 'Domestic shed',
  ductedAirConditioning: 'Ducted air conditioning',
  plasticHouse: 'Plastic house',
  other: 'Other',
};

export const farmBuildingAreas = {
  mainBuildingArea: 'Main Building Area',
};

export const oldBuildingYears = {
  rewireOrReroof: 1950,
  historicOrScrim: 1940,
};

export const convert = {
  metresToFeet: 3.28084,
  feetToMetres: 0.3048,
  gstExcToInc: 1.15,
};

export const coverTypes = {
  comprehensive: 'Comprehensive',
  thirdPartyFireTheft: 'Third Party, Fire & Theft',
  thirdPartyOnly: 'Third Party Only',
  fireTheft: 'Fire & Theft',
  fireOnly: 'Fire Only',
  onLandOnly: 'On land only',
};

export const securityFeatures = {
  windowBollards: { value: 'windowBollards', label: 'Window Bollards' },
  windowLocks: { value: 'windowLocks', label: 'Window Locks' },
  windowBars: { value: 'windowBars', label: 'Window Bars' },
  monitoredBurglarAlarm: { value: 'monitoredBurglarAlarm', label: 'Monitored burglar Alarm' },
  deadboltsToExternalDoors: { value: 'deadboltsToExternalDoors', label: 'Deadbolts to external doors' },
  safesWithinBuildings: { value: 'safesWithinBuildings', label: 'Safes within Buildings' },
  securityLighting: { value: 'securityLighting', label: 'Security Lighting' },
  securityPatrols: { value: 'securityPatrols', label: 'Security Patrols' },
  maximumCashHeld: { value: 'maximumCashHeld', label: 'Maximum amount of cash held/carried' },
  other: { value: 'other', label: 'Other' },
};

export const settlementTypes = {
  nominatedReplacement: 'Nominated Replacement',
  nominatedReplacementValue: 'Nominated Replacement Value',
  presentDayValue: 'Present Day Value',
  functionalReplacement: 'Functional Replacement',
  functionalReplacementValue: 'Functional Replacement Value',
};

const n100million = 100000000;
const n115million = 115000000;
export const numericCondition = {
  maxValue100million: n100million,
  maxValue115million: n115million,
  maxBuildingArea: 9999,
  maxNumberOfBales: 999,
  defaultSumInsuredExcGst: n100million,
  defaultSumInsuredIncGst: n115million,
  defaultMinYear: 1880,
  shortStringMax: 255,
};

export const otherContents = {
  generalFarm: 'General Farm Contents',
  milk: 'Milk',
  baledHay: 'Baled Hay',
  generalCommercial: 'General Commercial Contents',
  fixedPlant: 'Fixed Plant',
  tenantsImprovements: "Tenant's Improvements",
  stock: 'Stock',
  portablePlantAndEquip: 'Portable Plant & Equipment',
};

export const operatorType = {
  ownerOperator: 'Owner operator',
  ownerWithFarmManager: 'Owner with farm manager',
  farmOwnerInSharemilkingAgreement: 'Farm owner in sharemilking agreement',
  sharemilkerInSharemilkingAgreement: 'Sharemilker in sharemilking agreement',
  contractMilker: 'Contract milker',
};

export const itemStored = {
  lockedBuilding: 'Locked building/structure',
  lockedVehicle: 'Locked vehicle',
  unlockedBuilding: 'Unlocked building/structure or open air',
  unlockedVehicle: 'Unlocked vehicle',
};

export const insuredEvents = {
  comprehensive: 'Comprehensive',
  onLandOnly: 'On land only',
  accidentalLoss: 'Accidental loss',
  definedEvents: 'Defined events',
  accidentalBreakdown: 'Accidental breakdown',
};

export const vehicleLocation = {
  parkedOnRoad: 'Parked on road',
  lockedGarage: 'Locked garage',
  parkedOffRoad: 'Parked off road',
};

export const liabilityTypes = {
  statutory: 'statutory',
  employers: 'employers',
  moralObligation: 'moralObligation',
  dairyMilkContamination: 'dairyMilkContamination',
  propertyInCare: 'propertyInCare',
  coolstore: 'coolstore',
  sprayingDrift: 'sprayingDrift',
  harvester: 'harvester',
  licensedBuilder: 'licensedBuilder',
  wineHoneyOlive: 'wineHoneyOlive',
  defectDesign: 'defectDesign',
};

export const storageTypes = {
  trailered: 'Trailered',
  permanentlyMoored: 'Permanently moored',
};
