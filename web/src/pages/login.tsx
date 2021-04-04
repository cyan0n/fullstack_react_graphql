import { Form, Formik } from "formik";
import React from "react";
import { Button } from "@chakra-ui/react";
import { Container } from "../components/Container";
import { InputField } from "../components/InputField";
import { useMutation } from "urql";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Container variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ options: values });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            router.push("/");
          }
        }}
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
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default Login;
