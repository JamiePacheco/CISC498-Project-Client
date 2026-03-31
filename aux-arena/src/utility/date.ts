
// used to parse Java instant produced in backend to local time stamp in 12 hour, AM PM format
export function formatTimestampWithLocale(timestampString: string): string {
  const date = new Date(timestampString);

  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    fractionalSecondDigits: 2,
    hour12: true // Set to true for 12-hour format (e.g., "01:47 PM")
  };
  
  const formattedTime = new Intl.DateTimeFormat('en-US', options).format(date);
  
  return formattedTime;
}
