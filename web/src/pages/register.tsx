import { Form, Formik } from "formik";
import React from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Container } from "../components/Container";
import { InputField } from "../components/InputField";

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
  return (
    <Container variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={console.log}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              label="Username"
              placeholder="Username"
            />
            <InputField
              name="password"
              label="Password"
              type="password"
              placeholder="******"
            />
            <Button type="submit" isLoading={isSubmitting} colorScheme="teal">
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default Register;
