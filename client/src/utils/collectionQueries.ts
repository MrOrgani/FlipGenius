import axios from "axios";

let defaultDictionary = {
  acmé: "Apogée, point culminant.",
  viatique:
    "Vieux. Argent, provisions que l'on donne à quelqu'un pour un voyage",
  engoncer: `Habiller d'une façon disgracieuse, en faisant paraître le cou enfoncé dans les épaules.`,
  bédière: `Cours d'eau formé par les eaux de fonte d'un glacier, et qui s'encaisse en gorges dans la glace.`,
  longanime: `Qui se montre patient malgré la possibilité ou l'autorité qu'il aurait de faire cesser ce qui lui déplaît.`,
  nixe: `Nymphe (ou génie) des eaux, dans les mythologies germaniques.`,
  famulus: `Domestique, serviteur.`,
  janotisme: `Esprit borné, simplicité excessive, bêtise
  Défaut de style qui consiste à rompre la logique syntaxique en rapprochant abusivement certains membres de phrase et en provoquant des équivoques burlesques`,
  psittacisme: `Répétition mécanique (comme par un perroquet) de phrases que la personne qui les dit ne comprend pas.`,
  histrion: `Acteur antique qui jouait des farces grossières, avec accompagnement de flûte. / En France, jadis, jongleur, baladin. / Cabotin, charlatan ridicule`,
  coquecigrue: `Oiseau imaginaire, fabuleux / Fantasme, illusion`,
  fulgurer: `Briller soudainement`,
  infrangible: `Qui ne peut être brisé, détruit.`,
};

export const userSpecificCollectionQuery = ({
  collectionId,
}: Pick<QueryProps, "collectionId">) => ({
  queryKey: ["collection", collectionId],
  queryFn: async ({}) => {
    if (collectionId === "example")
      return {
        authorId: null,
        words: JSON.stringify(Object.entries(defaultDictionary)),
      };
    if (!collectionId || collectionId === "undefined") return [];
    const specificCollection = await axios.get(
      `http://localhost:8800/api/collections/${collectionId}`,
      { withCredentials: true }
    );
    if (!specificCollection) {
      throw new Response("", {
        status: 404,
        statusText: "Not Found",
      });
    }
    return specificCollection.data;
  },
});

export const userCollectionsQuery = ({
  userId,
}: Pick<QueryProps, "userId">) => ({
  queryKey: ["collections", userId],
  queryFn: async ({}) => {
    if (!userId || userId === "undefined") return null;
    const collections = await axios.get(
      `http://localhost:8800/api/users/profile`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:5173",
        },
        withCredentials: true,
      }
    );
    if (!collections) {
      throw new Response("", {
        status: 404,
        statusText: "Not Found",
      });
    }
    return collections.data;
  },
});
