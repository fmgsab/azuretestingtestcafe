const filterItems = (items: Record<string, string>[], lookup: string) => items.filter((item) => item?.itemType?.includes(lookup));
const getItemtypes = (data: object) => Object.values(data).flatMap((key) => key);

export const getAllItemTypes = (data: object, lookup: string) => {
  return filterItems(getItemtypes(data), lookup);
};
