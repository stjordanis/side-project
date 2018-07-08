import * as React from "react";
import { Button } from "react-native";

type Props = {
  onPress: () => void;
  name: string;
};
const LikeButton: React.SFC<Props> = props => {
  const { onPress, name } = props;
  return <Button title={name} onPress={onPress} />;
};

export default LikeButton;
