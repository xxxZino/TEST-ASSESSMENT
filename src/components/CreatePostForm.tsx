import React, { useState } from "react";
import { useMutation } from "@apollo/client/react"; 
import { CREATE_POST } from "../graphql/mutations";

interface CreatePostFormProps {
  onCreated?: () => void;
}

interface CreatePostInput {
  title: string;
  body: string;
  userId?: number;
}

interface CreatePostResponse {
  createPost: {
    id: string;
    title: string;
    body: string;
  };
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onCreated }) => {
  const [form, setForm] = useState<CreatePostInput>({
    title: "",
    body: "",
    userId: 1,
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [createPost, { loading, error }] = useMutation<
    CreatePostResponse,
    { input: CreatePostInput }
  >(CREATE_POST);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "userId" ? Number(value) || undefined : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.body.trim()) {
      return;
    }

    try {
      await createPost({
        variables: {
          input: {
            title: form.title,
            body: form.body,
            userId: form.userId,
          },
        },
      });

      setSuccessMessage("Post created successfully (mock response).");
      setForm({
        title: "",
        body: "",
        userId: 1,
      });

      if (onCreated) {
        onCreated();
      }

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1.5rem",
      }}
    >
      <h2>Create New Post</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "0.8rem" }}>
          <label>
            Title
            <br />
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.5rem" }}
              required
            />
          </label>
        </div>

        <div style={{ marginBottom: "0.8rem" }}>
          <label>
            Body
            <br />
            <textarea
              name="body"
              value={form.body}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.5rem", minHeight: "80px" }}
              required
            />
          </label>
        </div>

        <div style={{ marginBottom: "0.8rem" }}>
          <label>
            User ID
            <br />
            <input
              type="number"
              name="userId"
              value={form.userId ?? ""}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.5rem" }}
              min={1}
            />
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Post"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>
            Error: {error.message}
          </p>
        )}
        {successMessage && (
          <p style={{ color: "green", marginTop: "0.5rem" }}>
            {successMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default CreatePostForm;
