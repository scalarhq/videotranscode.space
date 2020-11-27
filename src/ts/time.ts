const secondsToTime = (secs: number) => {
  const hours = Math.floor(secs / (60 * 60))

  const divisorForMinutes = secs % (60 * 60)
  const minutes = Math.floor(divisorForMinutes / 60)

  const divisorForSeconds = divisorForMinutes % 60
  const seconds = Math.ceil(divisorForSeconds)

  const obj = {
    hours,
    minutes,
    seconds
  }
  return obj
}

const hmsToTimeStamp = ({
  hours,
  minutes,
  seconds
}: {
  hours: number
  minutes: number
  seconds: number
}) => {
  const finalHour = hours > 9 ? `${hours}` : `0${hours}`

  const finalMins = minutes > 9 ? `${minutes}` : `0${minutes}`

  const finalSeconds = seconds > 9 ? `${seconds}` : `0${seconds}`

  return `${finalHour}:${finalMins}:${finalSeconds}`
}

const getSecondsInTimeStamp = (secs: number) => {
  const hms = secondsToTime(secs)
  return hmsToTimeStamp(hms)
}

export default getSecondsInTimeStamp

export { secondsToTime, hmsToTimeStamp }
