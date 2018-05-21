import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  AsyncStorage,
  ScrollView
} from "react-native";
import { ChatDetailsQuery } from "../../../queries/chats";
import { CreateMessageMutation } from "../../../mutations/chats";
import { CHAT_SCREEN } from "../../../constants/screens";
import { MessageList, MessageForm } from "../../../components/Match/ChatScreen";
import styles from "./styles";

type Props = {
  id: string;
  navigator: any;
};

type State = {};
class ChatScreen extends React.Component<Props, State> {
  constructor(props) {
    super(props);
  }

  render() {
    const id = this.props.id;
    return (
      <ChatDetailsQuery variables={{ id }}>
        {({ subscribeMessages, error, data, loading }) => {
          if (loading) return <View>Loading</View>;
          if (error) {
            console.log("ChatDetailsQuery", error);
            return <View>Error</View>;
          }
          const { chat, messages } = data;

          return (
            <View>
              <Text>{chat.name}</Text>
              <MessageList
                subscribeMessages={subscribeMessages}
                messages={messages}
              />
              <CreateMessageMutation>
              </CreateMessageMutation> 
            </View>
          );
        }}
      </ChatDetailsQuery>
    );
  }
}

export default ChatScreen;
