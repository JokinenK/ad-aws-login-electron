import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import './App.css';
import { useConfig } from './effects/config';
import { AwsSettings } from './modules/AwsSettings';
import { ConfigKey } from '@common/types';

function App() {
  return (
    <div id="container">
      <AwsSettings />
    </div>
  );
}

function EnvironmentAware<Props>(
  Component: React.ComponentType<Props>
): React.ComponentType<Props> {
  return (props: Props) => {
    const [nodeEnv, getNodeEnv] = useConfig(ConfigKey.NODE_ENV);

    React.useEffect(() => {
      getNodeEnv();
    }, []);

    if (!nodeEnv) {
      return null;
    }
  
    const WrappedComponent = (nodeEnv !== 'production')
      ? hot(Component)
      : Component;
  
    return <WrappedComponent { ...props } />;
  }
}

export default EnvironmentAware(App);
