import * as React from 'react';
import { View, Text } from 'react-native';

import { LoginStatusQuery } from '../../queries/accounts';
import { goToMainTabs, goToAuthScreen } from '../../utilities/NavigationManager';

type Props = {};

type LoginStatusOutput = {
  data: { logined: boolean };
};

class InitializeScreen extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    return (
      <LoginStatusQuery>
        {({ data }: LoginStatusOutput) => {
          if (data && data.logined) {
            goToMainTabs();
          } else {
            goToAuthScreen();
          }
          return <View />;
        }}
      </LoginStatusQuery>
    );
  }
}

export default InitializeScreen;
