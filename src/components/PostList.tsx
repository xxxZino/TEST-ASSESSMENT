import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_POSTS } from "../graphql/queries";
import { PaginatedPosts, Post } from "../types";
import CreatePostForm from "./CreatePostForm";

interface PostListProps {
  onSelectPost: (id: string) => void;
}

const PAGE_SIZE = 10;

const PostList: React.FC<PostListProps> = ({ onSelectPost }) => {
  const [page, setPage] = useState<number>(1);

  const { data, loading, error, refetch } = useQuery<{
    posts: PaginatedPosts;
  }>(GET_POSTS, {
    variables: { page, limit: PAGE_SIZE },
    notifyOnNetworkStatusChange: true,
  });

  const handleNext = () => {
    if (!data) return;
    const totalCount = data.posts.meta.totalCount;
    const maxPage = Math.ceil(totalCount / PAGE_SIZE);
    if (page < maxPage) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const posts: Post[] = (data?.posts.data as Post[]) ?? [];
  const totalCount = data?.posts.meta.totalCount ?? 0;
  const maxPage = totalCount ? Math.ceil(totalCount / PAGE_SIZE) : 1;

  return (
    <div
      style={{
        maxWidth: "1120px",
        margin: "0 auto",
        padding: "2rem 1.5rem 3rem",
      }}
    >
      <header style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: 700,
            marginBottom: "0.25rem",
          }}
        >
          Test  Assessment Kumparan
        </h1>
        <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>
          
        </p>
      </header>

      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: "0 0 320px",
            maxWidth: "360px",
            width: "100%",
            position: "sticky",
            top: "1rem",
            alignSelf: "flex-start",
          }}
        >
          <CreatePostForm
            onCreated={() => {
              refetch();
            }}
          />
        </div>

        <div
          style={{
            flex: "1 1 0",
            minWidth: "0",
          }}
        >
          <section
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
              padding: "1.25rem 1.25rem 1rem",
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                }}
              >
                Posts
              </h2>
              <span
                style={{
                  fontSize: "0.8rem",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "999px",
                  backgroundColor: "#f3f4f6",
                  color: "#6b7280",
                }}
              >
                Total: {totalCount || "---"}
              </span>
            </div>

            {loading && <p>Loading posts...</p>}
            {error && (
              <p style={{ color: "red" }}>Error loading posts: {error.message}</p>
            )}
            {!loading && posts.length === 0 && <p>No posts found.</p>}

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {posts.map((post: Post) => (
                <li
                  key={post.id}
                  style={{
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    padding: "0.9rem 1rem",
                    marginBottom: "0.75rem",
                    backgroundColor: "#f9fafb",
                    cursor: "pointer",
                    transition: "transform 0.08s ease, box-shadow 0.08s ease",
                  }}
                  onClick={() => onSelectPost(post.id)}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLLIElement).style.transform =
                      "translateY(-1px)";
                    (e.currentTarget as HTMLLIElement).style.boxShadow =
                      "0 6px 14px rgba(15, 23, 42, 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLLIElement).style.transform =
                      "translateY(0)";
                    (e.currentTarget as HTMLLIElement).style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "0.6rem",
                      marginBottom: "0.35rem",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        margin: 0,
                        flex: 1,
                      }}
                    >
                      {post.title}
                    </h3>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#6b7280",
                        whiteSpace: "nowrap",
                      }}
                    >
                      #{post.id}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: "0.88rem",
                      color: "#4b5563",
                      margin: "0.1rem 0 0.4rem",
                    }}
                  >
                    {post.body.length > 100
                      ? post.body.slice(0, 100) + "..."
                      : post.body}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "0.3rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#6b7280",
                      }}
                    >
                      Author:{" "}
                      <strong>{post.user?.name ?? "Unknown author"}</strong>
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#3b82f6",
                        fontWeight: 500,
                      }}
                    >
                      View details
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "1rem",
                paddingTop: "0.75rem",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <button
                onClick={handlePrev}
                disabled={page === 1}
                style={{
                  padding: "0.35rem 0.8rem",
                  borderRadius: "999px",
                  border: "1px solid #d1d5db",
                  backgroundColor: page === 1 ? "#f3f4f6" : "#ffffff",
                  fontSize: "0.85rem",
                }}
              >
                Previous
              </button>

              <span
                style={{
                  fontSize: "0.82rem",
                  color: "#6b7280",
                }}
              >
                Page <strong>{page}</strong> / {maxPage || 1}
              </span>

              <button
                onClick={handleNext}
                disabled={page >= maxPage}
                style={{
                  padding: "0.35rem 0.8rem",
                  borderRadius: "999px",
                  border: "1px solid #d1d5db",
                  backgroundColor:
                    page >= maxPage ? "#f3f4f6" : "#111827",
                  color: page >= maxPage ? "#9ca3af" : "#f9fafb",
                  fontSize: "0.85rem",
                }}
              >
                Next 
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PostList;
