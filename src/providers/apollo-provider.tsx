"use client";

import React, { useEffect, useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";

const createApolloClient = (token: string | null) => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: createHttpLink({
      uri: (o) => `/graphql?opName=${o.operationName}`,
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
        skipPollAttempt: () => document.hidden, // Don't poll when the tab is not active
      },
    },
  });
};

export const ApolloClientProvider = ({
  token,
  children,
}: {
  children: React.ReactNode;
  token: string;
}) => {
  const [client, setClient] = useState<ApolloClient<any> | null>(null);

  // refetch queries when the window is focused
  useEffect(() => {
    const apolloClient = createApolloClient(token);
    setClient(apolloClient);

    const refetchQueries = () => {
      if (document.visibilityState === "visible") {
        apolloClient.refetchQueries({ include: "active" });
      }
    };

    window.addEventListener("visibilitychange", refetchQueries);

    return () => {
      window.removeEventListener("visibilitychange", refetchQueries);
    };
  }, [token]);

  if (!client) {
    return null; // or a loading spinner
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
