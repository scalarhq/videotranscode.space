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
}) => `${hours}:${minutes}:${seconds}`

const getSecondsInTimeStamp = (secs: number) => {
  const hms = secondsToTime(secs)
  return hmsToTimeStamp(hms)
}

export default getSecondsInTimeStamp

export { secondsToTime, hmsToTimeStamp }
