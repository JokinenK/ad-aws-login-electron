import { useCountdown } from '@renderer/effects/countdown';
import * as React from 'react';
import * as moment from 'moment';
import { Navigate, useParams } from 'react-router-dom';

export interface FailurePageProps {
  showSeconds?: number;
};

export type FailurePageParams = 'errorMessage';

export const FailurePage = (props: FailurePageProps) => {
  const { showSeconds = 5 } = props;
  const [ redirectAfter ] = React.useState(moment().add(showSeconds, 'seconds'));
  const { errorMessage } = useParams<FailurePageParams>();

  const countdown = useCountdown(redirectAfter);
  const shouldRedirect = (countdown <= 0);
  const readableError = Buffer.from(errorMessage || '', 'base64').toString();
  
  return (
    <>
      <h1>Failure!</h1>
      <h2>{readableError || 'Unknown error'}</h2>
      <br />
      <h2>Redirecting back in {countdown} seconds.</h2>
      {shouldRedirect && <Navigate to="/home" />}
    </>
  );
}