export const formatTime = (seconds: number) => {
  if(seconds < 60 )
    return `${Math.floor(seconds)}s`
  const mins = (seconds) / 60
  if(mins < 60)
    return `${Math.floor(mins)}m`
  const hours = (seconds) / 3_600
  if(hours < 4)
    return `${Math.floor(hours * 10) / 10}h`
  if(hours < 24)
    return `${Math.floor(hours)}h`
  const days = (seconds) / 86_400
  if(days < 4)
    return `${Math.floor(days * 10) / 10}d`
  if(days < 365)
    return `${Math.floor(days)}d`
  const years = (seconds) / 31_536_000
  return `${Math.floor(years)}y`
}

export const timeSince = (timestamp: Date | string) => {
  const parsedTimestamp = new Date(timestamp)
  const now = new Date()
  const secs = (now.getTime() - parsedTimestamp.getTime()) / 1000
  if(secs < 60 )
    return `${Math.floor(secs)}s`
  const mins = (now.getTime() - parsedTimestamp.getTime()) / 60_000
  if(mins < 60)
    return `${Math.floor(mins)}m`
  const hours = (now.getTime() - parsedTimestamp.getTime()) / 3_600_000
  if(hours < 24)
    return `${Math.floor(hours)}h`
  const days = (now.getTime() - parsedTimestamp.getTime()) / 86_400_000
  if(days < 365)
    return `${Math.floor(days)}d`
  const years = (now.getTime() - parsedTimestamp.getTime()) / 31_536_000_000
  return `${Math.floor(years)}y`
}

export const formatMinutes = (minutes: number) => {
  let text = ""
  if(minutes > 60){
    text += `${Math.floor(minutes/60)} hours`
  }
  if(minutes % 60 !== 0){
    if(text.length > 0){
      text += ", "
    }
    text += `${minutes % 60} min`
  }

  return text;
}

export const formatDate = (timestamp: Date | string) => new Date(timestamp).toLocaleString()
