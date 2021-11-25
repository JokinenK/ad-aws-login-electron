import { useCountdown } from '@renderer/effects/countdown';
import * as React from 'react';
import * as moment from 'moment';
import { Navigate } from 'react-router-dom';

export interface SuccessPageProps {
  showSeconds?: number;
};

export const SuccessPage = (props: SuccessPageProps) => {
  const { showSeconds = 5 } = props;
  const [ redirectAfter ] = React.useState(moment().add(showSeconds, 'seconds'));

  const countdown = useCountdown(redirectAfter);
  const shouldRedirect = (countdown <= 0);
  
  return (
    <>
      <h1>Success!</h1>
      <h2>Redirecting back in {countdown} seconds.</h2>
      {shouldRedirect && <Navigate to="/home" />}
    </>
  );
}