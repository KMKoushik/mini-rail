import { ApolloClient, gql, HttpLink, InMemoryCache } from "@apollo/client";
import { RAILWAY_GRAPHQL_URL } from "~/lib/constants";

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: RAILWAY_GRAPHQL_URL, fetch }),
  cache: new InMemoryCache(),
});
