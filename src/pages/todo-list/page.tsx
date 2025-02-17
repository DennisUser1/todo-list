import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { fetchTasks, Task } from "../../shared/api";
import { useParams } from "react-router-dom";

function ErrorFallback({ error }: { readonly error: unknown }) {
  const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred.";
  return (
    <div className="text-red-500">Something went wrong: {errorMessage}</div>
  );
}

export function TodoListPage() {
  const { userId }= useParams();
  const [tasksPromise, setTasksPromise] = useState(() => fetchTasks({ filters: {userId} }));

  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Tasks: user {userId}</h1>
      <CreateTaskForm />
      <ErrorBoundary fallbackRender={ErrorFallback}>
        <Suspense fallback={<div>Loading...</div>}>
          <TasksList />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

export function CreateTaskForm() {
  return (
    <form className="flex gap-2 items-start">
      <div className="flex flex-col">
        <input name="email" type="email" className="border p-2 rounded" />

        <div className="text-red-500 mt-1">error</div>
      </div>
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Add
        </button>
      </div>
    </form>
  );
}

export function TasksList() {
  const tasks = [] as Task[];
  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export function TaskCard({ task }: { readonly task: Task }) {
  return (
    <div className="border p-2 rounded bg-gray-100 flex gap-2 items-center">
      {task.title}
      <form className="ml-auto">
        <input type="hidden" name="id" value={task.id} />
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-auto">
          Delete{" "}
        </button>
      </form>
    </div>
  );
}
