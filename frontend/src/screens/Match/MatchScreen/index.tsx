import * as React from 'react';
import { View } from 'react-native';
import { MatchListQuery } from '../../../queries/matches';
import { CHAT_SCREEN, USER_DETAILS_SCREEN } from '../../../constants/screens';
import { MatchQueueList, ChatList } from '../../../components/Match/MatchScreen';
import { Chat, UserCore, MatchList, MinimumOutput } from '../../../interfaces';
import { BACK_BUTTON } from '../../../constants/buttons';
import { BACK_ICON } from '../../../constants/icons';
import IconLoader from '../../../utilities/IconLoader';
import styles from './styles';
import { LoadingIndicator, ErrorMessage } from '../../../components/Common';

type Props = {
  navigator: any;
};

type MatchListOutput = {
  data: { matchList: MatchList };
} & MinimumOutput;

class MatchScreen extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  protected handleChatPress = (id: string, name: string): void => {
    this.props.navigator.push({
      screen: CHAT_SCREEN,
      title: name,
      passProps: { id },
      navigatorButtons: {
        leftButtons: [
          {
            icon: IconLoader.getIcon(BACK_ICON),
            id: BACK_BUTTON
          }
        ]
      }
    });
  };

  protected handleUserPress = (userId: number, userDisplayName: string): void => {
    this.props.navigator.push({
      screen: USER_DETAILS_SCREEN,
      title: userDisplayName,
      passProps: { id: userId, liked: true },
      navigatorButtons: {
        leftButtons: [
          {
            icon: IconLoader.getIcon(BACK_ICON),
            id: BACK_BUTTON
          }
        ]
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <MatchListQuery>
          {({ data, error, loading }: MatchListOutput) => {
            if (loading) {
              return <LoadingIndicator />;
            }
            if (error) {
              return <ErrorMessage {...error} />;
            }

            const likedUserList: UserCore[] = data.matchList.likedUserList;
            const chatList: Chat[] = data.matchList.chatList;

            return (
              <View>
                <MatchQueueList likedUserList={likedUserList} onPress={this.handleUserPress} />
                <ChatList chats={chatList} onPress={this.handleChatPress} />
              </View>
            );
          }}
        </MatchListQuery>
      </View>
    );
  }
}

export default MatchScreen;
