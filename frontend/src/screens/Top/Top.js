import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import  {
  logout
}  from '../../queries/accounts';
import { firebaseSignOut } from '../../utilities/firebase';

class TopScreen extends Component {
  constructor(props) {
    super(props);
  }

  logout = () => {
    firebaseSignOut().then(() => {
      this.props.logout()
      .then(() => console.log('logout succeeded'))
      .catch(error => console.log(error))
    })
  }

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.logout}>
          <Text> Top Screen</Text>
        </TouchableOpacity>
      </View>
    )
  }
};


export default compose(
  logout
)(TopScreen);