import {
  Suspense,
  useActionState,
  useOptimistic,
  useRef,
  //   useTransition,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CreateUserAction, DeleteUserAction } from "./action";
import { useUsers } from "./use-users";
import { Link } from "react-router-dom";

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
  const { useUsersList, createUserAction, deleteUserAction } = useUsers();

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
      <CreateUserForm createUserAction={createUserAction} />
      <ErrorBoundary fallbackRender={ErrorFallback}>
        <Suspense fallback={<div>Loading...</div>}>
          <UsersList
            useUsersList={useUsersList}
            deleteUserAction={deleteUserAction}
          />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

export function CreateUserForm({
  //   refetchUsers,
  createUserAction,
}: {
  //   readonly refetchUsers: () => void;
  readonly createUserAction: CreateUserAction;
}) {
  //   const [email, setEmail] = useState(""); // Replaced by the uncontrolled form
  //   const [isPending, startTransition] = useTransition();
  const [state, dispatch] = useActionState(
    createUserAction,
    { email: "" }
    // createUserAction({
    //   refetchUsers,
    //   // setEmail
    // }),
  );
  const [optimisticState, setOptimisticState] = useOptimistic(state);

  //   const handleSubmit = async (event: React.FormEvent) => {
  //     event.preventDefault();
  //     startTransition(async () => {
  //       dispatch({ email });
  //     });
  //   };
  const form = useRef<HTMLFormElement>(null);

  return (
    <form
      className="flex gap-2 items-start"
      ref={form}
      action={(formData: FormData) => {
        setOptimisticState({ email: "" });
        dispatch(formData);
        form.current?.reset();
      }}
    >
      {/* onSubmit={handleSubmit} */}
      <div className="flex flex-col">
        <input
          name="email"
          type="email"
          //   value={email}
          className="border p-2 rounded"
          // disabled={isPending}
          defaultValue={optimisticState.email}
          //   onChange={(event) => setEmail(event.target.value)}
        />
        {optimisticState.error && (
          <div className="text-red-500 mt-1">{optimisticState.error}</div>
        )}
      </div>
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          // disabled={isPending}
          type="submit"
        >
          Add
        </button>
      </div>
    </form>
  );
}

export function UsersList({
  deleteUserAction,
  useUsersList,
}: //   usersPromise,
//   refetchUsers,
{
  readonly deleteUserAction: DeleteUserAction;
  readonly useUsersList: () => User[];
  //   readonly usersPromise: Promise<User[]>;
  //   readonly refetchUsers: () => void;
}) {
  //   throw new Error("Test Error Boundary in UsersList");
  const users = useUsersList();
  return (
    <div className="flex flex-col gap-2">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          deleteUserAction={deleteUserAction}
        />
      ))}
    </div>
  );
}

export function UserCard({
  user,
  deleteUserAction,
}: {
  readonly user: User;
  readonly deleteUserAction: DeleteUserAction;
}) {
  //   const [isPending, startTransition] = useTransition();

  //   const handleDelete = async () => {
  //     startTransition(async () => {
  //       await deleteUser(user.id);
  //       refetchUsers();
  //     });
  //   };

  const [state, handleDelete] = useActionState(deleteUserAction, {});

  return (
    <>
      <div className="border p-2 rounded bg-gray-100 flex gap-2 items-center">
        <div className="max-w-[140px] break-words sm:max-w-none">{user.email}</div>
        <form action={handleDelete} className="ml-auto flex items-center">
          <input type="hidden" name="id" value={user.id} />
          <Link
            to={`/${user.id}/tasks`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto mr-1"
          >
            Tasks
          </Link>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-auto"
            //   disabled={isPending}
            //   type="button"
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
