import { Suspense, use, useState, useTransition } from "react";
import { createUser, fetchUsers } from "../../shared/api";

type User = {
  id: string;
  email: string;
};

const defaultUsersPromise = fetchUsers();

export function UsersPage() {
  const [usersPromise, setUsersPromise] = useState(defaultUsersPromise);
  const refetchUsers = () => {
    setUsersPromise(fetchUsers());
  };

  //   const [users, setUsers] = useState<User[]>([]);
  //   const [email, setEmail] = useState("");

  //   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //     event.preventDefault();
  //     setUsers([...users, { id: crypto.randomUUID(), email }]); // Date.now().toString()
  //     setEmail("");
  //   };

  //   const handleDelete = (id: string) => {
  //     setUsers((lastUsers) => lastUsers.filter((user) => user.id !== id));
  //   };

  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Users</h1>
      <CreateUserForm refetchUsers={refetchUsers} />
      <Suspense fallback={<div>Loading...</div>}>
        <UsersList usersPromise={usersPromise} />
      </Suspense>
    </main>
  );
}

export function CreateUserForm({
  refetchUsers,
}: {
  readonly refetchUsers: () => void;
}) {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    startTransition( async () => {
      await createUser({
        email,
        id: crypto.randomUUID(),
      });
      startTransition(() => {
        refetchUsers();
        setEmail("");
      });
    });
  };

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        className="border p-2 rounded"
        onChange={(event) => setEmail(event.target.value)}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
        disabled={isPending}
        type="submit"
      >
        Add
      </button>
    </form>
  );
}

export function UsersList({
  usersPromise,
}: {
  readonly usersPromise: Promise<User[]>;
}) {
  const users = use(usersPromise);
  return (
    <div className="flex flex-col gap-2">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

export function UserCard({ user }: { readonly user: User }) {
  return (
    <div className="border p-2 rounded bg-gray-100 flex gap-2 items-center">
      {user.email}
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-auto"
        type="button"
        onClick={() => handleDelete(user.id)}
      >
        Delete
      </button>
    </div>
  );
}
