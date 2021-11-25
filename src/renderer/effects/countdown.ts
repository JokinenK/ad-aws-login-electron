import { useEffect, useState } from "react"
import * as moment from "moment"

export const useCountdown = (
  toDate: moment.MomentInput
): number => {
  const [delta, setDelta] = useState(0);
  const target = moment(toDate);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment()
      const delta = moment.duration(target.diff(now));
      const seconds = Math.round(delta.asSeconds());

      setDelta(seconds > 0 ? seconds : 0);
    }, 1000);

    return () => clearInterval(interval);
  });

  return delta;
}