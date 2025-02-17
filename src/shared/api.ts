export type User = {
  id: string;
  email: string;
};

export function fetchUsers() {
  return fetch("http://localhost:3001/users")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch users: ${res.statusText}`);
      }
      return res.json() as Promise<User[]>;
    })
    .catch((error) => {
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

export type Task = {
  id: string;
  userId: string;
  title: string;
  done: string;
  createdAt: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  first: number;
  items: number;
  last: number;
  next: number | null;
  page: number;
  pages: number;
  prev: number | null;
};

export function fetchTasks({
  page = 1,
  per_page = 10,
  sort = { createdAt: "asc" },
  filters,
}: {
  page?: number;
  per_page?: number;
  filters?: {
    userId?: string;
    title?: string;
  };
  sort?: {
    createdAt: "asc" | "desc";
  };
}) {
  return fetch(
    `http://localhost:3001/tasks?_page=${page}&_per_page=${per_page}&_sort=${
      sort.createdAt === "asc" ? "createdAt" : "-createdAt"
    }&userId=${filters?.userId}&title=${filters?.title}`
  )
  .then((res) => res.json() as Promise<PaginatedResponse<Task>>)
  .then((r) => ({ ...r, page }));
}

export function createTask(task: Omit<Task, "id" | "createdAt">) {
  return fetch("http://localhost:3001/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  }).then((res) => res.json());
}

export function updateTask(id: string, task: Partial<Task>) {
  return fetch(`http://localhost:3001/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  }).then((res) => res.json());
}

export function deleteTask(id: string) {
  return fetch(`http://localhost:3001/tasks/${id}`, {
    method: "DELETE",
  }).then((res) => res.json());
}