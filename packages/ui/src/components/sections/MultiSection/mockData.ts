export function generateTableItems(count: number) {
  let newItems = [];
  for (let i = 0; i < count; i++) {
    newItems.push({
      name: `tableItem ${i + 1}`,
    });
  }
  return newItems;
}
