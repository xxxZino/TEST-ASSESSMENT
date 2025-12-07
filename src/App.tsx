import React, { useState } from "react";
import { ApolloProvider } from "@apollo/client/react"; 
import { client } from "./apollo/client";
import PostList from "./components/PostList";
import PostDetail from "./components/PostDetail";

const App: React.FC = () => {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  return (
    <ApolloProvider client={client}>
      {selectedPostId ? (
        <PostDetail
          postId={selectedPostId}
          onBack={() => setSelectedPostId(null)}
        />
      ) : (
        <PostList onSelectPost={(id) => setSelectedPostId(id)} />
      )}
    </ApolloProvider>
  );
};

export default App;
