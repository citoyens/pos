type DocumentType = { [key in string]: string[] };

const fdgyDocumentTypes: DocumentType = {
  COL: [
    "Cedula de ciudadanía",
    "Cedula de extranjería",
    "Permiso por protección temporal",
    "Pasaporte",
  ],
  MEX: [
    "Cedula de extranjería",
    "Registro federal del causante",
    "CPF",
    "Pasaporte",
  ],
  PER: ["DNI", "Carnet de extranjería", "Pasaporte"],
};

export const getDocumentTypes = (
  companyCode: string,
  country: string
): string[] => {
  if (companyCode === "fdgy") {
    return fdgyDocumentTypes[country]?.map((el) => el.toUpperCase()) ?? ["ID"];
  }
  return ["ID"];
};
