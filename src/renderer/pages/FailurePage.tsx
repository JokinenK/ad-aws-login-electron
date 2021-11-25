import { useCountdown } from '@renderer/effects/countdown';
import * as React from 'react';
import * as moment from 'moment';
import { Navigate } from 'react-router-dom';

export interface FailurePageProps {
  showSeconds?: number;
  errorMessage: string;
};

export const FailurePage = (props: FailurePageProps) => {
  const { showSeconds = 5, errorMessage } = props;
  const [ redirectAfter ] = React.useState(moment().add(showSeconds, 'seconds'));

  const countdown = useCountdown(redirectAfter);
  const shouldRedirect = (countdown <= 0);
  
  return (
    <>
      <h1>Failure!</h1>
      <h2>{errorMessage}</h2>
      <br />
      <h2>Redirecting back in {countdown} seconds.</h2>
      {shouldRedirect && <Navigate to="/home" />}
    </>
  );
}