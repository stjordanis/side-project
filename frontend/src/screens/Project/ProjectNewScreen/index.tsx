import * as React from 'react';
import { Navigation } from 'react-native-navigation';
import { View, ScrollView } from 'react-native';
import { ErrorMessage, LoadingIndicator } from '../../../components/Common';
import { EditForm } from '../../../components/Project/Common';
import { ProjectCreateParams, Genre, MinimumOutput } from '../../../interfaces';
import { ProjectFormQuery } from '../../../queries/projects';
import { CreateProjectMutation } from '../../../mutations/projects';
import { PROJECT_DETAILS_SCREEN } from '../../../constants/screens';
import { BACK_BUTTON } from '../../../constants/buttons';

import IconLoader from '../../../utilities/IconLoader';
import { buildDefaultNavigationComponent } from '../../../utilities/navigationStackBuilder';
import { BACK_ICON } from '../../../constants/icons';
import styles from './styles';

type Props = {
  navigator: any;
};

type DefaultProps = {
  genres: Genre[];
};

type ProjectFormOutput = {
  data: { projectForm: DefaultProps };
} & MinimumOutput;

type CreateProjectOutput = {
  createProjectMutation: (input: { variables: ProjectCreateParams }) => void;
  data: { createProject: { id: string } };
} & MinimumOutput;

class ProjectNewScreen extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  private handleSubmit = (
    variables: ProjectCreateParams,
    createProjectMutation: (input: { variables: ProjectCreateParams }) => void
  ) => {
    createProjectMutation({ variables });
  };

  render() {
    return (
      <ProjectFormQuery>
        {({ data, loading, error }: ProjectFormOutput) => {
          if (loading) return <LoadingIndicator />;
          if (error) return <ErrorMessage {...error} />;

          const projectFormData = data.projectForm;
          return (
            <View style={styles.container}>
              <ScrollView
                alwaysBounceVertical={true}
                showsVerticalScrollIndicator={false}
                style={styles.innerContainer}
              >
                <CreateProjectMutation>
                  {({ createProjectMutation, data, loading, error }: CreateProjectOutput) => {
                    if (loading) return <LoadingIndicator />;
                    if (error) return <ErrorMessage {...error} />;
                    if (data) {
                      Navigation.dismissAllModals();
                      Navigation.push(
                        PROJECT_DETAILS_SCREEN,
                        buildDefaultNavigationComponent({
                          screenName: PROJECT_DETAILS_SCREEN,
                          props: {
                            id: data.createProject.id
                          },
                          leftButton: {
                            icon: IconLoader.getIcon(BACK_ICON),
                            id: BACK_BUTTON
                          }
                        })
                      );
                    }

                    return (
                      <EditForm
                        onSubmit={(projectCreateParams: ProjectCreateParams) =>
                          this.handleSubmit(projectCreateParams, createProjectMutation)
                        }
                        genres={projectFormData.genres}
                        loading={loading}
                        error={error}
                        navigator={this.props.navigator}
                      />
                    );
                  }}
                </CreateProjectMutation>
              </ScrollView>
            </View>
          );
        }}
      </ProjectFormQuery>
    );
  }
}

export default ProjectNewScreen;
