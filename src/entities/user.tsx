import React, { createContext, startTransition, use, useState } from "react";
import { fetchUsers, User } from "../shared/api";
// import { create } from "zustand";

type UserContextType = {
  usersPromise: Promise<User[]>;
  refetchUsers: () => void;
};

const UsersContext = createContext<UserContextType | null>(null);

const defaultUsersPromise = fetchUsers();
export function UsersProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [usersPromise, setUsersPromise] = useState(defaultUsersPromise);

  const refetchUsers = () =>
    startTransition(() => setUsersPromise(fetchUsers()));

  return (
    <UsersContext value={{ usersPromise: usersPromise, refetchUsers }}>
      {children}
    </UsersContext>
  );
}

export function useUsersGlobal() {
    const context = use(UsersContext);

    if (!context) {
      throw new Error("useUsers must be used within a UserProvider")
    }
    return context; 
}

// type UserState = {
//   usersPromise: Promise<User[]>;
//   refetchUsers: () => void;
// };

// export const useUsersGlobal = create<UserState>((set) => ({
//   usersPromise: fetchUsers(),
//   refetchUsers: () => startTransition(() => set({ usersPromise: fetchUsers()}))
// }))