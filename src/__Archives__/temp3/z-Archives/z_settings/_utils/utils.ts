
export function getPlatformTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

