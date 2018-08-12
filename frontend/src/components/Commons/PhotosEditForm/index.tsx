import * as React from "react";
import { View } from "react-native";
import { Button } from "react-native-elements";
import { Photo } from "../";
import { ProjectPhoto, UserPhoto } from "../../../interfaces";
import styles from "./styles";

type Props = {
  photos: ProjectPhoto[];
  onPressPhoto: (string) => void;
  onPressNewPhoto: (rank: number) => void;
};

const photoList = (photos: ProjectPhoto[], fnc) => {
  return photos.map((photo) => {
    return <Photo key={photo.id} photo={photo} onPress={fnc} />;
  });
};
const CHUNK_SIZE = 3;

const renderItems = (items: any[]) => {
  const maxChunkIndex = Math.ceil(items.length / CHUNK_SIZE);

  let itemList: any[] = [];
  for (let i = 1; i <= maxChunkIndex; i++) {
    itemList = [
      ...itemList,
      <View style={styles.itemContainer}>
        {items.slice((i - 1) * CHUNK_SIZE, i * CHUNK_SIZE).map((item) => item)}
      </View>
    ];
  }
  return itemList;
};

const PhotosEditForm: React.SFC<Props> = (props) => {
  const { photos, onPressPhoto, onPressNewPhoto } = props;
  const availableRank = photos.length;
  const items = [
    ...photoList(photos, onPressPhoto),
    <Button
      style={styles.button}
      title="Add New Photo"
      onPress={() => onPressNewPhoto(availableRank)}
    />
  ];
  return <View style={styles.container}>{renderItems(items)}</View>;
};

export default PhotosEditForm;