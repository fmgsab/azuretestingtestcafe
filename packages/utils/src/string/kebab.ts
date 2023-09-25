export const stringToKebab = (str?: string) =>
  str
    ?.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.join('-')
    .toLowerCase();

// export default function stringToKebab(input?: string) {
//   try {
//     return convert(input);
//   } catch (error) {
//     return 'error';
//   }
// }
