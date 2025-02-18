import {
  startTransition,
  Suspense,
  use,
  useActionState,
  useMemo,
  useState,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import { fetchTasks, Task } from "../../shared/api";
import { useParams } from "react-router-dom";
import { createTaskAction, deleteTaskAction } from "./action";

function ErrorFallback({ error }: { readonly error: unknown }) {
  const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred.";
  return (
    <div className="text-red-500">Something went wrong: {errorMessage}</div>
  );
}

export function TodoListPage() {
  const { userId = "" } = useParams();
  const [paginatedTasksPromise, setPaginatedTasksPromise] = useState(() =>
    fetchTasks({ filters: { userId } })
  );
  const refetchTasks = () =>
    startTransition(() =>
      setPaginatedTasksPromise(fetchTasks({ filters: { userId } }))
    );

  const tasksPromise = useMemo(
    () => paginatedTasksPromise.then((r) => r.data),
    [paginatedTasksPromise]
  );

  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Tasks: user {userId}</h1>
      <CreateTaskForm refetchTasks={refetchTasks} userId={userId} />
      <ErrorBoundary fallbackRender={ErrorFallback}>
        <Suspense fallback={<div>Loading...</div>}>
          <TasksList tasksPromise={tasksPromise} refetchTasks={refetchTasks}/>
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

export function CreateTaskForm({
  userId,
  refetchTasks,
}: {
  readonly userId: string;
  readonly refetchTasks: () => void;
}) {
  const [state, dispatch, isPending] = useActionState(
    createTaskAction({ refetchTasks, userId }),
    { title: "" }
  );

  return (
    <form className="flex gap-2 items-start" action={dispatch}>
      <div className="flex flex-col">
        <input name="title" type="text" className="border p-2 rounded" />
        {state.error && <div className="text-red-500 mt-1">{state.error}</div>}
      </div>
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
          type="submit"
          defaultValue={state.title}
          disabled={isPending}
        >
          Add
        </button>
      </div>
    </form>
  );
}

export function TasksList({
  tasksPromise,
  refetchTasks,
}: {
  readonly tasksPromise: Promise<Task[]>;
  readonly refetchTasks: () => void;
}) {
  const tasks = use(tasksPromise);
  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} refetchTasks={refetchTasks} />
      ))}
    </div>
  );
}

export function TaskCard({
  task,
  refetchTasks,
}: {
  readonly task: Task;
  readonly refetchTasks: () => void;
}) {
  const [deleteState, handleDelete, isPending] = useActionState(
    deleteTaskAction({ refetchTasks }),
    {}
  );
  return (
    <>
      <div className="border p-2 rounded bg-gray-100 flex gap-2 items-center">
        {task.title}
        <form className="ml-auto" action={handleDelete}>
          <input type="hidden" name="id" value={task.id} />
          <button
            disabled={isPending}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-auto disabled:bg-gray-400"
          >
            Delete{" "}
          </button>
        </form>
      </div>
      {deleteState.error && (
        <div className="text-red-500">{deleteState.error}</div>
      )}
    </>
  );
}
