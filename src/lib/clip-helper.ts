export function extractClipId(clipUrl: string): string | null {
  // Match various Twitch clip URL formats
  const clipPatterns = [
    /clips\.twitch\.tv\/([a-zA-Z0-9_-]+)/,
    /(?:www\.)?twitch\.tv\/\w+\/clip\/([a-zA-Z0-9_-]+)/
  ]
  
  for (const pattern of clipPatterns) {
    const match = clipUrl.match(pattern)
    if (match) {
      return match[1]
    }
  }
  
  return null
}