import gql from 'graphql-tag';

export const USER_FRAGMENTS = {
  userDetails: gql`
    fragment UserDetail on User {
      id
      displayName
      schoolName
      companyName
      occupation
      introduction
      status
      hasLiked
      city {
        id
        fullName
      }
      genre {
        id
        name
      }
      occupationType {
        id
        name
      }
      skills {
        id
        name
      }
      photos {
        id
        imageUrl
        rank
      }
    }
  `,
  userOnList: gql`
    fragment UserOnList on User {
      id
      displayName
      schoolName
      companyName
      occupation
      introduction
      city {
        id
        fullName
      }
      genre {
        id
        name
      }
      occupationType {
        id
        name
      }
      mainPhotoUrl
    }
  `
};
