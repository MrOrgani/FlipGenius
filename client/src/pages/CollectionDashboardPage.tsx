import { useLocation, useParams } from "react-router";
import { Link } from "react-router-dom";
import { DeleteButton } from "../components/DeleteButton";
import { WordList } from "../components/WordList";
import { userSpecificCollectionQuery } from "../utils/collectionQueries";
import { useQuery } from "@tanstack/react-query";
import {
  deleteCollection,
  updateCollection,
} from "../store/actions/collections";
import { useSelector } from "react-redux";

let defaultDictionary = {
  acmé: { definition: "Apogée, point culminant.", successRate: 0 },
  viatique: {
    definition:
      "Vieux. Argent, provisions que l'on donne à quelqu'un pour un voyage",
    successRate: 0,
  },
  engoncer: {
    definition:
      "Habiller d'une façon disgracieuse, en faisant paraître le cou enfoncé dans les épaules.",
    successRate: 0,
  },
  bédière: {
    definition:
      "Cours d'eau formé par les eaux de fonte d'un glacier, et qui s'encaisse en gorges dans la glace.",
    successRate: 0,
  },
  longanime: {
    definition:
      "Qui se montre patient malgré la possibilité ou l'autorité qu'il aurait de faire cesser ce qui lui déplaît.",
    successRate: 0,
  },
  nixe: {
    definition: "Nymphe (ou génie) des eaux, dans les mythologies germaniques.",
    successRate: 0,
  },
  famulus: { definition: "Domestique, serviteur.", successRate: 0 },
  janotisme: {
    definition:
      "Esprit borné, simplicité excessive, bêtise\n    Défaut de style qui consiste à rompre la logique syntaxique en rapprochant abusivement certains membres de phrase et en provoquant des équivoques burlesques",
    successRate: 0,
  },
  psittacisme: {
    definition:
      "Répétition mécanique (comme par un perroquet) de phrases que la personne qui les dit ne comprend pas.",
    successRate: 0,
  },
  histrion: {
    definition:
      "Acteur antique qui jouait des farces grossières, avec accompagnement de flûte. / En France, jadis, jongleur, baladin. / Cabotin, charlatan ridicule",
    successRate: 0,
  },
  coquecigrue: {
    definition: "Oiseau imaginaire, fabuleux / Fantasme, illusion",
    successRate: 0,
  },
  fulgurer: { definition: "Briller soudainement", successRate: 0 },
  infrangible: {
    definition: "Qui ne peut être brisé, détruit.",
    successRate: 0,
  },
};

export const loader: Loader =
  ({ queryClient }) =>
  async ({ params: { collectionId } }) => {
    const query = userSpecificCollectionQuery({ collectionId });
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export const multipleAction: Action =
  ({ queryClient, globalState }) =>
  async ({ request, params }) => {
    switch (request.method) {
      case "PUT":
        return updateCollection({ queryClient, globalState })({
          params,
          request,
        });
      case "DELETE":
        return deleteCollection({ queryClient, globalState })({
          params,
          request,
        });
      default:
        return null;
    }
  };

export default function CollectionDashboard() {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  const { collectionId } = useParams<"collectionId">();
  const { data: collection } = useQuery(
    userSpecificCollectionQuery({ collectionId })
  );

  console.log(collection);

  if (!collection) return null;

  const example = collectionId === "example";

  const canModify = Boolean(userInfo && userInfo?.id === collection?.authorId);

  return (
    <div className="container flex  w-auto flex-col gap-4 ">
      <div className="aligns-center flex justify-between gap-4 space-y-4">
        <span className="  mt-auto bg-gradient-to-b from-[#423ED8] to-[#9C37E6] bg-clip-text text-4xl font-bold text-transparent">
          {collection.name}
        </span>
        {example ? null : (
          <>
            <DeleteButton />
            <Link to={`/collections/${userInfo.id ?? "example"}`}>
              <div className="rounded-full bg-gradient-to-bl from-[#423ED8] to-[#9C37E6] p-[4px]">
                <button className=" text-md font-subtitle rounded-full bg-white px-8 py-2">
                  Close X
                </button>
              </div>
            </Link>
          </>
        )}
      </div>
      <div
        className={
          "flex h-[calc(100vh*80/100)] flex-col justify-between space-y-4 rounded-3xl bg-[#E4E2FF] p-4"
        }
      >
        <div className="container grid grid-cols-4 gap-4 ">
          <div className={"flex   flex-col rounded-3xl bg-white p-2 shadow-sm"}>
            <span className="text-sm font-medium tracking-tight text-[#6C63FF]">
              Number of words
            </span>
            <span className="text-center text-2xl font-bold text-[#6C63FF]">
              {collection?.words ? JSON.parse(collection?.words)?.length : 0}
            </span>
          </div>
          <div className={"flex   flex-col rounded-3xl bg-white p-2 shadow-sm"}>
            <span className="text-sm font-medium tracking-tight text-[#6C63FF]">
              Success Rate
            </span>
            <span className="text-center text-2xl font-bold text-[#6C63FF]">
              {collection?.words ? JSON.parse(collection?.words)?.length : 0}
            </span>
          </div>
          <div className={"flex   flex-col rounded-3xl bg-white p-2 shadow-sm"}>
            <span className="text-sm font-medium tracking-tight text-[#6C63FF]">
              Last time opened
            </span>
            <span className="text-center text-2xl font-bold text-[#6C63FF]">
              {collection?.words ? JSON.parse(collection?.words)?.length : 0}
            </span>
          </div>

          <Link
            to={`/collection/${collectionId}/learn`}
            className={"flex h-24 flex-col items-center  gap-4 rounded-3xl"}
          >
            <button className=" text-md font-subtitle  rounded-full  bg-gradient-to-b from-[#6C63FF] to-[#9C37E6] px-8 py-2 font-bold text-white">
              Learn
            </button>
            <button className=" text-md font-subtitle  rounded-full  bg-gradient-to-b from-[#6C63FF] to-[#9C37E6] px-8 py-2 font-bold text-white">
              Quizz
            </button>
          </Link>
        </div>
        <WordList
          words={collection.words}
          // words={JSON.stringify(Object.entries(defaultDictionary))}
          editable={!location.pathname.includes("example") || canModify}
        />
      </div>
    </div>
  );
}
