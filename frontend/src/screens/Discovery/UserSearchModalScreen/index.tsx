import * as React from 'react';
import { Alert } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { OccupationType, Genre, Skill, Location, MinimumOutput } from '../../../interfaces';
import { UserSearchFormQuery } from '../../../queries/users';
import { UpdateUserSearchParamsMutation } from '../../../mutations/users';
import SearchForm from './SearchForm';
import { LoadingIndicator } from '../../../components/Common';
import { APPLY_BUTTON, CLOSE_BUTTON } from '../../../constants/buttons';

type UserSearchParams = {
  occupationTypeId: string | undefined;
  genreId: string | undefined;
  location: Location | undefined;
  isActive: boolean | undefined;
  skills: Skill[];
};

type Props = {
  navigator: any;
  componentId: string;
  onSubmit: (searchParams: UserSearchParams) => void;
};

type UserSearchFormOutput = {
  data: {
    userSearchForm: {
      genres: Genre[];
      occupationTypes: OccupationType[];
    };
    userSearchParams: UserSearchParams;
  };
} & MinimumOutput;

type UpdateUserSearchOutput = {
  updateUserSearchParamsMutation: (input: { variables: UserSearchParams }) => void;
} & MinimumOutput;

class UserSearchFormScreen extends React.Component<Props> {
  private form: any;

  constructor(props: Props) {
    super(props);

    Navigation.events().bindComponent(this);
  }

  private navigationButtonPressed = ({ buttonId }: { buttonId: string }) => {
    switch (buttonId) {
      case APPLY_BUTTON:
        this.form.handleSubmit();
        Navigation.dismissModal(this.props.componentId);
        break;

      case CLOSE_BUTTON:
        Navigation.dismissModal(this.props.componentId);
        break;
    }
  };

  private onSubmit = (searchParams: UserSearchParams, mutation: (input: { variables: UserSearchParams }) => void) => {
    mutation({ variables: searchParams });
    this.props.onSubmit(searchParams);
  };

  render() {
    return (
      <UserSearchFormQuery>
        {({ data, loading, error }: UserSearchFormOutput) => {
          if (loading) return <LoadingIndicator />;

          if (error) {
            Alert.alert(error.message);
            return <View />;
          }
          const {
            userSearchForm: { genres, occupationTypes },
            userSearchParams
          } = data;

          return (
            <UpdateUserSearchParamsMutation>
              {({ updateUserSearchParamsMutation, error }: UpdateUserSearchOutput) => {
                if (error) {
                  Alert.alert(error.message);
                  return <View />;
                }

                return (
                  <SearchForm
                    {...userSearchParams}
                    genres={genres}
                    occupationTypes={occupationTypes}
                    navigator={this.props.navigator}
                    onSubmit={(searchParams: UserSearchParams) =>
                      this.onSubmit(searchParams, updateUserSearchParamsMutation)
                    }
                    ref={(instance) => {
                      this.form = instance;
                    }}
                  />
                );
              }}
            </UpdateUserSearchParamsMutation>
          );
        }}
      </UserSearchFormQuery>
    );
  }
}

export default UserSearchFormScreen;
