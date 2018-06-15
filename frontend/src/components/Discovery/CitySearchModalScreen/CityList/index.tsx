import * as React from "react";
import { View, Text } from "react-native";
import { ListItem } from "react-native-elements";
import styles from "./styles";

import { City } from "../../../../interfaces";

type Props = {
  cities: City[];
  onPress: (cityId: string) => void;
};

const CityList = (props: Props) => {
  return (
    <View style={styles.listContainer}>
      {props.cities.map((city: City) => {
        return (
          <ListItem
            key={city.id}
            containerStyle={styles.listItemContainer}
            title={city.fullName}
            onPress={() => props.onPress(city.id)}
          />
        );
      })}
    </View>
  );
};

export default CityList;