const parseFileSize = (size: string): number => {
  const [value, unit] = size.split(" ");
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

export default parseFileSize;