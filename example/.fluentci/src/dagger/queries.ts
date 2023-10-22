import { gql } from "../../deps.ts";

export const preview = gql`
  query preview(
    $src: String!
    $stack: String!
    $token: String!
    $googleApplicationCredentials: String
  ) {
    preview(
      src: $src
      stack: $stack
      token: $token
      googleApplicationCredentials: $googleApplicationCredentials
    )
  }
`;

export const up = gql`
  query up(
    $src: String!
    $stack: String!
    $token: String!
    $googleApplicationCredentials: String
  ) {
    up(
      src: $src
      stack: $stack
      token: $token
      googleApplicationCredentials: $googleApplicationCredentials
    )
  }
`;
