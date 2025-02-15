import {
  Suspense,
  use,
  useActionState,
  //   useTransition,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import { createUserAction, deleteUserAction } from "./action";
import { useUsers } from "./use-users";

type User = {
  id: string;
  email: string;
};

function ErrorFallback({ error }: { readonly error: unknown }) {
  const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred.";
  return (
    <div className="text-red-500">Something went wrong: {errorMessage}</div>
  );
}

export function UsersPage() {
  const [usersPromise, refetchUsers] = useUsers();

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
      <ErrorBoundary fallbackRender={ErrorFallback}>
        <Suspense fallback={<div>Loading...</div>}>
          <UsersList usersPromise={usersPromise} refetchUsers={refetchUsers} />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

export function CreateUserForm({
  refetchUsers,
}: {
  readonly refetchUsers: () => void;
}) {
  //   const [email, setEmail] = useState(""); // Replaced by the uncontrolled form
  //   const [isPending, startTransition] = useTransition();
  const [state, dispatch, isPending] = useActionState(
    createUserAction({
      refetchUsers,
      // setEmail
    }),
    { email: "" }
  );

  //   const handleSubmit = async (event: React.FormEvent) => {
  //     event.preventDefault();
  //     startTransition(async () => {
  //       dispatch({ email });
  //     });
  //   };

  return (
    <form className="flex gap-2 items-start" action={dispatch}>
      {/* onSubmit={handleSubmit} */}
      <div className="flex flex-col">
        <input
          name="email"
          type="email"
          //   value={email}
          className="border p-2 rounded"
          disabled={isPending}
          defaultValue={state.email}
          //   onChange={(event) => setEmail(event.target.value)}
        />
        {state.error && <div className="text-red-500 mt-1">{state.error}</div>}
      </div>
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
          disabled={isPending}
          type="submit"
        >
          Add
        </button>
      </div>
    </form>
  );
}

export function UsersList({
  usersPromise,
  refetchUsers,
}: {
  readonly usersPromise: Promise<User[]>;
  readonly refetchUsers: () => void;
}) {
  //   throw new Error("Test Error Boundary in UsersList");
  const users = use(usersPromise);
  return (
    <div className="flex flex-col gap-2">
      {users.map((user) => (
        <UserCard key={user.id} user={user} refetchUsers={refetchUsers} />
      ))}
    </div>
  );
}

export function UserCard({
  user,
  refetchUsers,
}: {
  readonly user: User;
  readonly refetchUsers: () => void;
}) {
  //   const [isPending, startTransition] = useTransition();

  //   const handleDelete = async () => {
  //     startTransition(async () => {
  //       await deleteUser(user.id);
  //       refetchUsers();
  //     });
  //   };

  const [state, handleDelete, isPending] = useActionState(
    deleteUserAction({ id: user.id, refetchUsers }),
    {}
  );

  return (
    <>
      <div className="border p-2 rounded bg-gray-100 flex gap-2 items-center">
        {user.email}
        <form action={handleDelete} className="ml-auto">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-auto disabled:bg-gray-400"
            //   type="button"
            disabled={isPending}
            //   onClick={handleDelete}
            //   formAction={handleDelete}
          >
            Delete{" "}
          </button>
        </form>
      </div>
      {state.error && <div className="text-red-500">{state.error}</div>}
    </>
  );
}
