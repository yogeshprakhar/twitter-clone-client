import { graphql } from "../../gql";

export const verifyuserGoogleTokenQuery = graphql(`
  #graphql
  query VerifyUserGoogletoken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`);

export const getCurrentUserQuery = graphql(`
  query GetCurrentUser {
    getCurrentUser {
      id
      firstName
      email
      lastName
      profileImageURL
      recommendedUsers {
        id
        firstName
        lastName
        profileImageURL
      }
      followers {
        id
        firstName
        lastName
        profileImageURL
      }
      following {
        id
        firstName
        lastName
        profileImageURL
      }
      tweets {
        id
        content
        author {
          id
          firstName
          lastName
          profileImageURL
        }
      }
    }
  }
`);

export const getUserByIdQuery = graphql(`
#graphql
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      firstName
      lastName
      profileImageURL
      followers {
        id
        firstName
        lastName
        profileImageURL
      }
      following {
        id
        firstName
        lastName
        profileImageURL
      }
      tweets {
        content
        id
        author {
          id
          firstName
          lastName
          profileImageURL
        }
      }
    }
  }
`);
