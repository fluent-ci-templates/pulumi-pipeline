import { gql } from "../../deps.ts";

export const preview = gql`
  query preview($src: String!, $stack: String!, $token: String!) {
    preview(src: $src, stack: $stack, token: $token)
  }
`;

export const up = gql`
  query up($src: String!, $stack: String!, $token: String!) {
    up(src: $src, stack: $stack, token: $token)
  }
`;
