import * as React from 'react';
import { View } from 'react-native';
import { ListItem } from 'react-native-elements';
import styles from './styles';

import { Skill } from '../../../../interfaces';

type Props = {
  skills: Skill[];
  onPressSkill: (skill: Skill) => void;
};

const renderSkill = (skill: Skill, fnc: (skill: Skill) => void) => {
  return (
    <ListItem
      key={skill.id}
      bottomDivider
      containerStyle={styles.listItemContainer}
      title={skill.name}
      onPress={() => fnc(skill)}
    />
  );
};

const SkillList: React.SFC<Props> = ({ skills, onPressSkill }) => {
  return (
    <View style={styles.listContainer}>
      {skills.map((skill: Skill) => {
        return renderSkill(skill, onPressSkill);
      })}
    </View>
  );
};

export default SkillList;
