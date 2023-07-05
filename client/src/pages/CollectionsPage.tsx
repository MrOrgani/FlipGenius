import { Navigate, useNavigate, useParams } from "react-router";
import { NewCollectionCardButton } from "../components/NewCollectionCardButton";
import { CollectionCard } from "../components/CollectionCard";

import { QueryClient, useQuery } from "@tanstack/react-query";
import { userCollectionsQuery } from "../utils/collectionQueries";

export const loader: Loader =
  ({ queryClient }) =>
  async ({ params: { userId } }) => {
    if (!userId) return [];
    const query = userCollectionsQuery({ userId });
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export default function Collections() {
  const { userId } = useParams<"userId">();
  const { data: user } = useQuery(userCollectionsQuery({ userId }));

  if (location.pathname === "/") return <Navigate replace to="/home" />;

  return (
    <div className="ml-8 flex h-full flex-col justify-center">
      <h1 className="mb-4 bg-gradient-to-b from-[#423ED8] to-[#9C37E6] bg-clip-text text-4xl font-bold text-transparent">
        Your collections
      </h1>
      <div className="flex gap-4 overflow-auto ">
        {user.collections
          ? user.collections.map((collection) => (
              <CollectionCard
                key={`collection-${collection.id}`}
                {...collection}
              ></CollectionCard>
            ))
          : null}
        <NewCollectionCardButton />
      </div>
    </div>
  );
}
