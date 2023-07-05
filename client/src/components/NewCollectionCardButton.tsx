import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { Form, useActionData } from "react-router-dom";
import { createCollection } from "../store/actions/collections";

export const action: Action =
  ({ queryClient }) =>
  async ({ request, params }) => {
    return createCollection(queryClient)({ request, params });
  };

export const NewCollectionCardButton = ({ name = "No name" }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const actionData = useActionData() as Record<string, string>;
  return (
    <a>
      <div
        className={
          "flex h-52 w-80 flex-col items-center justify-around rounded-3xl border-8 border-violet-200  "
        }
        onClick={onOpen}
      >
        <span className="text-2xl text-indigo-600">Add a new collection</span>
        <div className=" rounded-full bg-violet-200 p-1">
          <AddIcon boxSize={6} color={"white"} />
        </div>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <Form method="post" id="collection-form">
            <ModalContent>
              <ModalHeader>Create a new collection</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    placeholder="Collection name"
                    name="collectionName"
                    type="text"
                  />
                  {actionData?.collectionName && (
                    <span role="alert" className="text-red-500">
                      {actionData.collectionName}
                    </span>
                  )}
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="blue" type="submit">
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          </Form>
        </Modal>
      </div>
    </a>
  );
};
