import React from "react";
import { useQuery } from "@apollo/client/react";
import { GET_POST } from "../graphql/queries";
import { Comment, Post } from "../types";

interface PostDetailData {
  post: Post & {
    comments: {
      data: Comment[];
    };
  };
}

interface PostDetailProps {
  postId: string;
  onBack: () => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ postId, onBack }) => {
  const { data, loading, error } = useQuery<PostDetailData>(GET_POST, {
    variables: { id: postId },
  });

  const post = data?.post;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1.5rem" }}>
      <button onClick={onBack} style={{ marginBottom: "1rem" }}>
        ← Back to list
      </button>

      {loading && <p>Loading post...</p>}
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
      {!loading && !post && <p>Post not found.</p>}

      {post && (
        <>
          <h1>{post.title}</h1>
          <p style={{ marginTop: "1rem" }}>{post.body}</p>

          <section style={{ marginTop: "2rem" }}>
            <h2>Author</h2>
            <p>
              <strong>{post.user.name}</strong>
              <br />
              <span>{post.user.email}</span>
            </p>
          </section>

          <section style={{ marginTop: "2rem" }}>
            <h2>Comments</h2>
            {post.comments.data.length === 0 && <p>No comments.</p>}
            <ul style={{ listStyle: "none", padding: 0 }}>
              {post.comments.data.map((comment: Comment) => ( 
                <li
                  key={comment.id}
                  style={{
                    border: "1px solid #eee",
                    borderRadius: "8px",
                    padding: "0.8rem",
                    marginBottom: "0.8rem",
                  }}
                >
                  <p style={{ marginBottom: "0.3rem" }}>
                    <strong>{comment.name}</strong>
                  </p>
                  <p
                    style={{
                      marginBottom: "0.3rem",
                      fontSize: "0.85rem",
                      color: "#777",
                    }}
                  >
                    {comment.email}
                  </p>
                  <p style={{ fontSize: "0.9rem" }}>{comment.body}</p>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
};

export default PostDetail;
