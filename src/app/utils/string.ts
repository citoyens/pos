export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^a-z0-9-]/g, "") // Remove all non-word chars
    .replace(/^-+/g, "") // Remove leading -
    .replace(/-+$/g, ""); // Remove trailing -
};

export const refinedKitchenName = (name: string): string => {
  return name.toUpperCase().replace("COCINA", "").trim();
};

export const replaceLineBreak = (param: any) =>
  typeof param === "string" ? param.replace(/\n/g, "").trim() : param;

export const replaceCommasWithPeriods = (param: string) =>
  param.replace(/,/g, ".");

export const clearSpecialCharacters = (text: string): string => {
  const result = text
    .replace(/(.)/g, (format) => format.toUpperCase())
    // .replace(/\s/g, "-")
    .replace(/\./g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return replaceLineBreak(result);
};
