export const toArr = (obj: object) =>
  Object.entries(obj).map((value) => {
    const values = Object.values(value[1]);
    return {
      name: value[0],
      base: values[5],
      values: values,
    };
  });

interface Color {
  name: string;
  base: string;
  values: string[];
}

export const toJson = (obj: Color) => {
  const keys = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  const values = obj.values;
  const entries = keys.map((entry, index) => [entry, values[index]]);
  return {
    [obj.name]: Object.fromEntries(entries),
  };
};
