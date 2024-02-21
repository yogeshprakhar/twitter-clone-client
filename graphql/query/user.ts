import { graphql } from "../../gql";

export const verifyuserGoogleTokenQuery = graphql(`#graphql
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
    }
  }
`);