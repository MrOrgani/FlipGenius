import axios from "axios";
import { redirect } from "react-router-dom";
import * as yup from "yup";

let collectionSchema = yup.object({
  collectionName: yup.string().required("Collection name is required"),
});

const createCollection: Action =
  (queryClient) =>
  async ({ params, request }) => {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);

    try {
      await collectionSchema.validate(updates, { abortEarly: false });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors = Object.fromEntries(
          err.inner.map((e) => [e.path, e.message])
        );
        return errors;
      }
    }

    try {
      const newCollection = await axios.post(
        "http://localhost:8800/api/collections",
        JSON.stringify({
          name: updates.collectionName,
          authorId: params.userId,
        }),
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const {
        data: { id: collectionId, authorId },
      } = newCollection;
      await queryClient.invalidateQueries({
        queryKey: ["collections", authorId],
      });
      return redirect(`/collection/${collectionId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { collectionName: error.response?.data.message };
      } else {
        console.error(error);
      }
    }
  };

const updateCollection: Action =
  ({ queryClient, globalState }) =>
  async ({ params: { collectionId }, request }) => {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);

    const wordList = JSON.parse(updates.wordList as string);
    if (!wordList.length) return null;
    await axios.put(
      `http://localhost:8800/api/collections/${collectionId}`,
      JSON.stringify({
        authorId: globalState.auth.userInfo.id,
        wordList: JSON.stringify(wordList),
      }),
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    await queryClient.invalidateQueries({
      queryKey: ["collection", collectionId],
    });
    return null;
  };

const deleteCollection: Action =
  ({ globalState, queryClient }) =>
  async ({ params: { collectionId }, request }) => {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    const userId = updates.userId;

    console.log("globalState.auth.userInfo", globalState.auth.userInfo);
    await axios.delete(
      `http://localhost:8800/api/collections/${collectionId}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        withCredentials: true,
        data: { authorId: globalState.auth.userInfo.id },
      }
    );
    await queryClient.invalidateQueries({
      queryKey: ["collections", userId],
    });
    return redirect(`/collections/${userId}`);
  };

export { createCollection, updateCollection, deleteCollection };
