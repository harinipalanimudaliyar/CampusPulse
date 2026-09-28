const API_BASE = import.meta.env.VITE_API_URL || "";

function getToken() {
  return localStorage.getItem("campuspulse_token");
}

async function handleResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : {};

  if (!response.ok) {
    throw new Error(data.message || "Request failed. Please try again.");
  }

  return data;
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers
  });

  return handleResponse(response);
}

export const registerUser = (userData) =>
  request("/signup", { method: "POST", body: JSON.stringify(userData) });

export const loginUser = (credentials) =>
  request("/login", { method: "POST", body: JSON.stringify(credentials) });

export const fetchPosts = (params = {}) => {
  const query = new URLSearchParams();
  if (params.topic && params.topic !== "All") query.set("topic", params.topic);
  if (params.institution && params.institution !== "All institutions") {
    query.set("institution", params.institution);
  }
  const suffix = query.toString() ? `?${query}` : "";
  return request(`/posts${suffix}`);
};

export const createPost = (postData) =>
  request("/posts", { method: "POST", body: JSON.stringify(postData) });

export const deletePost = (postId) =>
  request(`/posts/${postId}`, { method: "DELETE" });

export const fetchMessages = () => request("/messages");

export const sendMessage = (msgData) =>
  request("/messages", { method: "POST", body: JSON.stringify(msgData) });

export { handleResponse };
