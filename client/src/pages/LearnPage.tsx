import { useParams } from "react-router";
import { userSpecificCollectionQuery } from "../utils/collectionQueries";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import CardsStack from "../components/CardsStack";
import { useEffect, useRef } from "react";

export const loader: Loader =
  (queryClient) =>
  async ({ params: { collectionId } }) => {
    const query = userSpecificCollectionQuery({ collectionId });
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

const LearnPage = () => {
  const { collectionId } = useParams<"collectionId">();
  const { data: collection } = useQuery(
    userSpecificCollectionQuery({ collectionId })
  );

  const wordList = JSON.parse(collection.words);
  const cardsRef = useRef<any[]>([]);

  useEffect(() => {
    return () => {
      console.log("LEAVING LEARN PAGE 🔥", cardsRef.current);
    };
  }, [cardsRef.current]);

  return (
    <div className=" flex  w-auto flex-col gap-4 ">
      <div className="aligns-center flex justify-between gap-4 space-y-4">
        <Link className="ml-auto" to={`/collections/${collection.authorId}`}>
          <div className="rounded-full bg-gradient-to-bl from-[#423ED8] to-[#9C37E6] p-[4px]">
            <button className=" text-md font-subtitle rounded-full bg-white px-8 py-2">
              Close X
            </button>
          </div>
        </Link>
      </div>
      <CardsStack
        onVote={(item, vote) => console.log(item, vote)}
        ref={cardsRef}
        asCards={wordList}
      />
    </div>
  );
};

export default LearnPage;
