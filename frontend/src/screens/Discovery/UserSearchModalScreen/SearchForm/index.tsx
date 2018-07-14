import * as React from "react";
import {
  SKILL_SEARCH_MODAL_SCREEN,
  PICKER_SCREEN
} from "../../../../constants/screens";

import { View, FlatList, Alert } from "react-native";
import { ListItem } from "react-native-elements";
import { SelectBox } from "../../../../components/Commons";
import { APPLY_BUTTON, CLOSE_BUTTON } from "../../../../constants/buttons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  Skill,
  Genre,
  Location,
  OccupationType,
  UserSearchParams
} from "../../../../interfaces";
import { getIcon } from "../../../../utilities/iconLoader";
import { CLOSE_ICON } from "../../../../constants/icons";
import styles from "./styles";

type Props = {
  navigator: any;
  genres: Genre[];
  occupationTypes: OccupationType[];
  occupationTypeId: string | undefined;
  genreId: string | undefined;
  location: Location | undefined;
  isActive: boolean;
  skills: Skill[];
  onSubmit: (searchParams: UserSearchParams) => void;
};

type State = {
  genreId: string | undefined;
  occupationTypeId: string | undefined;
  location: Location | undefined;
  isActive: boolean;
  skills: Skill[];
};

const DISTANCES = [
  {
    name: "5 miles",
    value: 5
  },
  {
    name: "10 miles",
    value: 10
  },
  {
    name: "20 miles",
    value: 20
  },
  {
    name: "doesn't care",
    value: undefined
  }
];

class SearchForm extends React.Component<Props, State> {
  static defaultProps = {

  }
  constructor(props) {
    super(props);
    this.state = {
      genreId: props.genreId,
      location: props.location,
      occupationTypeId: props.occupationTypeId,
      isActive: props.isActive,
      skills: props.skills
    };

    this.props.navigator.setOnNavigatorEvent(this.handleNavigationEvent);
  }
  private handleNavigationEvent = (e) => {
    const {
      genreId,
      occupationTypeId,
      location,
      isActive,
      skills
    } = this.state;
    if (e.type !== "NavBarButtonPress") {
      return;
    }
    switch (e.id) {
      case APPLY_BUTTON:
      
        this.props.onSubmit({
          genreId: genreId,
          occupationTypeId: occupationTypeId,
          location: location,
          isActive: isActive,
          skills: skills
        });
        this.props.navigator.dismissModal();
        break;
      case CLOSE_BUTTON:
        this.props.navigator.dismissModal();
        break;
    }
  };

  private handleSkillSearchShowModal = () => {
    this.props.navigator.showModal({
      screen: SKILL_SEARCH_MODAL_SCREEN,
      title: "Skill Search",
      animationType: "slide-up",
      passProps: { onPress: this.handleAddSkill },
      navigatorButtons: {
        leftButtons: [
          {
            icon: getIcon(CLOSE_ICON),
            title: "CLOSE",
            id: CLOSE_BUTTON
          }
        ]
      }
    });
  };

  private handleChangeValue = (
    key: string,
    value: string | number | boolean
  ) => {
    if (key === "distance") {
      this.handleChangeLocationValue(value as number);
    } else {
      let changeAttr = {};
      changeAttr[key] = value;

      this.setState(changeAttr);
    }
  };

  private handleChangeLocationValue = (distance: number) => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        const location: Location = {
          latitude,
          longitude,
          distance
        };
        this.setState({ location });
      },
      async (error) => {
        console.log(error);
        Alert.alert("Needs to turn location on");
      }
    );
  };

  private handleAddSkill = (skill: Skill) => {
    const skills = Array.from(new Set(this.state.skills.concat(skill)));
    this.setState({ skills });
  };

  private handleDeleteSkill = (id: string) => {
    const skills = this.state.skills.filter((skill) => skill.id !== id);
    this.setState({ skills });
  };

  private handlePressShowModal = (
    items: any[],
    keyName: string,
    selectedValue: string | number | undefined
  ) => {
    this.props.navigator.showModal({
      screen: PICKER_SCREEN,
      passProps: {
        items,
        keyName,
        selectedValue,
        onPress: this.handleChangeValue
      },
      navigatorButtons: {
        leftButtons: [
          {
            icon: getIcon(CLOSE_ICON),
            title: "CLOSE",
            id: CLOSE_BUTTON
          }
        ]
      }
    });
  };

  private renderSkillList = () => {
    return <FlatList data={this.state.skills} renderItem={this.renderSkill} />;
  };

  private renderSkill = (data) => {
    const skill: Skill = data.item;
    return (
      <ListItem
        key={skill.id}
        title={skill.name}
        bottomDivider
        rightIcon={this.renderSkillRemoveIcon(skill.id)}
      />
    );
  };

  private renderSkillAddIcon = () => {
    return (
      <MaterialCommunityIcons
        name="plus"
        onPress={() => this.handleSkillSearchShowModal()}
      />
    );
  };

  private renderSkillRemoveIcon = (skillId: string) => {
    return (
      <MaterialCommunityIcons
        name="minus-circle"
        onPress={() => this.handleDeleteSkill(skillId)}
      />
    );
  };

  render() {
    const { genreId, occupationTypeId, location, isActive } = this.state;

    const { genres, occupationTypes } = this.props;

    return (
      <View>
        <SelectBox
          keyName="occupationTypeId"
          placeholder="OccupationType"
          value={occupationTypeId}
          items={occupationTypes}
          onPress={this.handlePressShowModal}
        />
        <SelectBox
          keyName="distance"
          placeholder="Distance"
          value={location ? location.distance : undefined}
          items={DISTANCES}
          onPress={this.handlePressShowModal}
        />
        <SelectBox
          keyName="genreId"
          placeholder="Genre"
          value={genreId}
          items={genres}
          onPress={this.handlePressShowModal}
        />
        <ListItem
          key="active"
          title="Active within 72 hours"
          chevron={false}
          bottomDivider
          switch={{
            value: isActive,
            onValueChange: (value: boolean) =>
              this.handleChangeValue("isActive", value)
          }}
        />
        <ListItem
          key="skills"
          title="Skills"
          chevron={false}
          bottomDivider
          rightIcon={this.renderSkillAddIcon()}
        />
        {this.renderSkillList()}
      </View>
    );
  }
}

export default SearchForm;