export function json2Csv(items: any[]): string {
  if (items.length === 0) {
    return "";
  }

  const headers = new Set<string>();
  items.forEach((item) => {
    Object.keys(item).forEach((key) => headers.add(key));
  });

  const headerArray = Array.from(headers);

  const replacer = (key: any, value: any) => (value === null ? "" : value);

  return [
    headerArray.join(","),
    ...items.map((row) =>
      headerArray
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(",")
    ),
  ].join("\r\n");
}

export function downloadTextAsCsv(text: string, fileName: string): void {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
