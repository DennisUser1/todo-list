export type User = {
  id: string;
  email: string;
};

export function fetchUsers() {
  return fetch("http://localhost:3001/users").then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch users: ${res.statusText}`);
    }
    return res.json() as Promise<User[]>;
  }).catch((error) => {
    throw new Error(`Failed to fetch users: ${error.message}`);
  });
}

export function createUser(user: User) {
//   throw new Error("Not implemented");
  return fetch("http://localhost:3001/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  }).then((res) => res.json());
}

export function deleteUser(id: string) {
  return fetch(`http://localhost:3001/users/${id}`, {
    method: "DELETE",
  }).then((res) => res.json());
}
