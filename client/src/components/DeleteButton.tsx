import {
  useDisclosure,
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { Form } from "react-router-dom";
import { useSelector } from "react-redux";

export const DeleteButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
      <button
        onClick={onOpen}
        className=" text-md font-subtitle ml-auto rounded-full  bg-gradient-to-b from-[#6C63FF] to-[#9C37E6]  px-4 font-bold text-white"
      >
        <DeleteIcon />
      </button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <Form method="DELETE" id="collection-form">
          <input name="userId" readOnly={true} value={userInfo.id} />
          <ModalContent>
            <ModalHeader>Are you sure you want to delete it ?</ModalHeader>
            <ModalCloseButton />

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button colorScheme="red" type="submit">
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Form>
      </Modal>
    </>
  );
};
