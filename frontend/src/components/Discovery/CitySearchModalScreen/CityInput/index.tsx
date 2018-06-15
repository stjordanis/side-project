import * as React from "react";
import { Input } from "react-native-elements";
import styles from "./styles";

type Props = {
  name: string;
  onChangeText: (string) => void;
};

type State = {
  name: string;
};

class CityInput extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      name: props.name
    };
  }

  render() {
    const { name } = this.state;
    return (
      <Input
        placeholder="City(ex: San Francisco)"
        containerStyle={styles.inputContainer}
        value={name}
        onChangeText={() => this.props.onChangeText}
      />
    );
  }
}

export default CityInput;