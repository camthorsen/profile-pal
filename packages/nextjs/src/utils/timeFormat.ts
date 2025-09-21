export function formatTime(seconds: number): string {
  if (seconds < 0) {
    return '00:00';
  }
  
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  return formatTime(seconds);
}

export function parseTimeToSeconds(timeString: string): number {
  const match = timeString.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    throw new Error('Invalid time format. Expected MM:SS');
  }
  
  const minutes = Number.parseInt(match[1]!, 10);
  const seconds = Number.parseInt(match[2]!, 10);
  
  if (seconds >= 60) {
    throw new Error('Seconds must be less than 60');
  }
  
  return minutes * 60 + seconds;
}
