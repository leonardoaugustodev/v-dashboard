// export function generateId(type: string) {
//     const hash = new Date().valueOf().toString();
//     return <string>`${type}_${hash}`;
// }
import md5 from 'md5';

export const generateId = async (type: string, data?: any) => {
  if (!data) data = `${new Date().valueOf().toString()}${type}`;

  data = `${data}${Math.floor(Math.random() * 10000)}`;

  const hash = md5(data);
  return <string>`${type}_${hash}`;
};
