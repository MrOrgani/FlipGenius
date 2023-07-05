import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  useLoginMutation,
  useRegisterMutation,
} from "../store/slices/usersApiSlice";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  Flex,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { setCredentials } from "../store/slices/authSlice";

const schema = (connectionType: "signup" | "login") =>
  yup
    .object({
      email: yup.string().required(),
      ...(connectionType === "login" && {
        password: yup.string().required("Please Enter your password"),
      }),
      ...(connectionType === "signup" && {
        password: yup
          .string()
          .required("Please Enter your password")
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
          ),
      }),
      ...(connectionType === "signup" && {
        passwordConfirmation: yup
          .string()
          .oneOf([yup.ref("password"), ""], "Passwords must match"),
      }),
      ...(connectionType === "signup" && { name: yup.string().required() }),
    })
    .required();

export const ConnectionModalForm = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const navigate = useNavigate();

  const [connectionType, setConnectionType] = useState<"login" | "signup">(
    "login"
  );

  const [login] = useLoginMutation();
  const [registerUser] = useRegisterMutation();

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema(connectionType)),
  });

  const onSubmit = async (data: any) => {
    try {
      const res =
        connectionType === "login"
          ? await login(data).unwrap()
          : await registerUser(data).unwrap();
      dispatch(setCredentials({ ...res }));
      onClose();
      navigate(`/collections/${res.id}`);
    } catch (err) {
      console.log(err?.data?.message || err.error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {connectionType === "login" ? "Log in" : "Register"}
        </ModalHeader>
        <ModalCloseButton />
        <Flex minWidth="max-content" justifyContent="center" gap="2">
          <Button
            colorScheme="blue"
            name={"login"}
            variant={connectionType === "signup" ? "outline" : "solid"}
            onClick={() => setConnectionType("login")}
          >
            Log in
          </Button>
          <Button
            colorScheme="blue"
            name={"signup"}
            variant={connectionType === "login" ? "outline" : "solid"}
            onClick={() => setConnectionType("signup")}
          >
            Sign Up
          </Button>
        </Flex>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="Email"
              {...register("email")}
              defaultValue={"ma@gmail.com"}
            />
            {errors.email && (
              <span role="alert" className="text-red-500">
                {errors.email.message?.toString()}
              </span>
            )}

            {connectionType === "signup" ? (
              <>
                <FormLabel>Name</FormLabel>
                <Input placeholder="Name" {...register("name")} />
                {errors.name && (
                  <span role="alert" className="text-red-500">
                    {errors.name.message?.toString()}
                  </span>
                )}
              </>
            ) : null}

            <FormLabel>Password</FormLabel>
            <Input
              placeholder="Password"
              type="password"
              {...register("password")}
              defaultValue={"Maxmax44!"}
            />
            {errors.password && (
              <span role="alert" className="text-red-500">
                {errors.password.message?.toString()}
              </span>
            )}

            {connectionType === "signup" ? (
              <>
                <FormLabel>Password comfirmation</FormLabel>
                <Input
                  placeholder="Password comfirmation"
                  type="password"
                  {...register("passwordConfirmation")}
                />
                {errors.passwordConfirmation && (
                  <span role="alert" className="text-red-500">
                    {errors.passwordConfirmation.message?.toString()}
                  </span>
                )}
              </>
            ) : null}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              variant="outline"
              mr={3}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button colorScheme="blue" type="submit">
              Submit
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
