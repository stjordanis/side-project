import * as React from 'react';
import { Query } from 'react-apollo';
import { CHAT_QUERY, NEW_MESSAGE_SUBSCRIPTION } from '../../graphql/chats';

type Props = {
  children: any;
  variables: { chatId: string };
};

const ChatDetailsQuery = ({ children, variables }: Props) => {
  const { chatId } = variables;
  return (
    <Query query={CHAT_QUERY} variables={variables} context={{ needAuth: true }} notifyOnNetworkStatusChange>
      {({ subscribeToMore, error, data, loading }) => {
        const subscribeMessages = () => {
          return subscribeToMore({
            document: NEW_MESSAGE_SUBSCRIPTION,
            variables: { chatId },
            updateQuery: (prev: any, { subscriptionData }) => {
              if (!subscriptionData.data) return prev;
              const newMessage = subscriptionData.data.newMessage;
              const chat = {
                ...prev.chat,
                messages: [...prev.chat.messages, newMessage]
              };

              return { ...prev, chat };
            },
            onError: (err) => console.info(err, data, loading)
          });
        };

        return children({
          error,
          data,
          loading,
          subscribeMessages
        });
      }}
    </Query>
  );
};

export default ChatDetailsQuery;
