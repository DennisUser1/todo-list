import { Route, Routes } from "react-router-dom";
import { UsersPage } from "../pages/users";
import { TodoListPage } from "../pages/todo-list";
import { UsersProvider } from "../entities/user";

// fetch("http://localhost:3001/users").then((res) => {
//   console.log(res);
// });

export default function App() {
  return (
    <UsersProvider>
      <Routes>
        <Route path="/" element={<UsersPage />}></Route>
        <Route path="/:userId/tasks" element={<TodoListPage />}></Route>
      </Routes>
    </UsersProvider>
  );
}
