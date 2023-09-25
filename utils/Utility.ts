import {fail} from "assert";

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getJSONAdminData(): any {
  const adminData = require('../data/lookup-data.json');
  return adminData;
}

export function getEngineTypeArray(vehicleType: string): any {
  let engineTypesArray = [];
  for (const item of getJSONAdminData().engineTypes) {
    if (item.itemSubtype.includes(vehicleType)) {
      engineTypesArray = item.list;
      break;
    }
  }
  if (engineTypesArray.length < 1) {
    fail('Test failed -------> No Engine Type found for vehicle ' + vehicleType);
  }
  return engineTypesArray;
}

/**
 * typeToExtract is the field name on lookup-data.json file**/

export function getListArray(itemTypeToMatch: string, typeToExtract: string): any {
  let listArray = [];
  const genericTypes = getJSONAdminData()[typeToExtract];
  if (itemTypeToMatch != '') {
    for (const item of genericTypes) {
      if (item.itemType.includes(itemTypeToMatch)) {
        listArray = item.list;
        break;
      }
    }
  } else {
    listArray = genericTypes;
  }
  console.log(listArray);
  return listArray;
}
