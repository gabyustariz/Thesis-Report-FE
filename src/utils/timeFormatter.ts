const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m${remainingSeconds > 0 ? `, ${remainingSeconds}s` : ""}`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const remainingSeconds = seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const secondsLeft = remainingSeconds % 60;

    let result = `${hours}h`;
    if (minutes > 0) {
      result += `, ${minutes}m`;
    }
    if (secondsLeft > 0) {
      result += `, ${secondsLeft}s`;
    }
    return result;
  }
};

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  return date.toLocaleString("es-ES", options);
};

export { formatDuration, formatDate };
