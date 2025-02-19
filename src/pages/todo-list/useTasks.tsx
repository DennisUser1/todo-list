import { useState, startTransition } from "react";
import { fetchTasks } from "../../shared/api";


export function useTasks({
    userId,
}: {
    userId: string;
}) {
    const defaultSearch = "";
    const defaultCreatedAtSort = "asc";
    const [paginatedTasksPromise, setPaginatedTasksPromise] = useState(() => 
        fetchTasks({
            page: 1,
            filters: { userId, title: defaultSearch },
            sort: { createdAt: defaultCreatedAtSort },
    })
    );

    const refetchTasks =
        async ({
            page, title, createdAtSortNew,
        }: {
            page?: number;
            title?: string;
            createdAtSortNew?: "asc" | "desc";
        }) =>
            async () => {
                page = page ?? (await paginatedTasksPromise).page;
                startTransition(() => setPaginatedTasksPromise(
                    fetchTasks({
                        filters: { userId, title: title ?? defaultSearch },
                        page,
                        sort: { createdAt: createdAtSortNew ?? defaultCreatedAtSort },
                    })
                )
                );
            };

    return {
        paginatedTasksPromise,
        refetchTasks,
        defaultCreatedAtSort,
        defaultSearch
    };
}
