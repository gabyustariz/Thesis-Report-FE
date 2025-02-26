const parseFileSize = (formatSize: string): number => {
  const [value, unit] = formatSize.split(" ");
  const numericValue = Number.parseFloat(value);
  switch (unit.toUpperCase()) {
    case "KB":
      return numericValue * 1024;
    case "MB":
      return numericValue * 1024 * 1024;
    case "GB":
      return numericValue * 1024 * 1024 * 1024;
    default:
      return numericValue;
  }
};

const formatFileSize = (sizeBytes: number): string => {
  if (sizeBytes === 0) {
    return "0B";
  }
  const sizeNames = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (sizeBytes >= 1024 && i < sizeNames.length - 1) {
    sizeBytes /= 1024;
    i++;
  }
  return `${sizeBytes.toFixed(2)}${sizeNames[i]}`;
};

export { formatFileSize, parseFileSize };
