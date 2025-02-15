import { createUser, deleteUser } from "../../shared/api";

type CreateActionState = {
  email: string;
  error?: string;
};

export function createUserAction({
  refetchUsers,
}: {
  refetchUsers: () => void;
}) {
  return async (
    _: CreateActionState,
    // formData: { email: string }
    formData: FormData
  ): Promise<CreateActionState> => {
    const email = formData.get("email") as string;

    if (email === "admin@gmail.com") {
      return {
        error: "Admin account is not allowed",
        email,
      };
    }

    try {
      await createUser({
        // email: formData.email,
        email,
        id: crypto.randomUUID(),
      });
      refetchUsers();
      //   setEmail("");
      return {
        email: "",
      };
    } catch {
      return {
        email: email,
        error: "Error while creating user",
      };
    }
  };
}

type DeleteUserActionState = {
  error?: string;
};

export function deleteUserAction({
  id,
  refetchUsers,
}: {
  refetchUsers: () => void;
  id: string;
}) {
  return async (): Promise<DeleteUserActionState> => {
    // await deleteUser(id); // for test error
    try {
      await deleteUser(id);
      refetchUsers();
      return {};
    } catch {
      return {
        error: "Error while deleting user",
      };
    }
  };
}
