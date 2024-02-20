import { graphql } from "../../gql";

export const verifyuserGoogleTokenQuery = graphql(`
  #graphql
  query VerifyUserGoogletoken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`);