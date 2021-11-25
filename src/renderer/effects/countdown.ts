import { useEffect, useState } from "react"
import * as moment from "moment"

export const useCountdown = (
  toDate: moment.MomentInput
): number => {
  const target = moment(toDate);
  const calcDiff = () => target.diff(moment());
  const calcDelta = () => moment.duration(calcDiff()).asSeconds();
  const [delta, setDelta] = useState(calcDelta());

  useEffect(() => {
    const interval = setInterval(() => {
      const delta = calcDelta();
      const seconds = Math.round(delta);

      setDelta(seconds > 0 ? seconds : 0);
    }, 1000);

    return () => clearInterval(interval);
  });

  return delta;
}