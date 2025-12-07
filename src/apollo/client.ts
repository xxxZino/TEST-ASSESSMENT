import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLink = new HttpLink({
  uri: "https://graphqlzero.almansi.me/api",
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
