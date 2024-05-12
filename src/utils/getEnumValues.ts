const getEnumValues = <T>(enumObj: T): string[] => {
  return Object.values(enumObj) as string[];
};

export default getEnumValues;
