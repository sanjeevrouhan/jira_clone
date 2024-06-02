import {
  ActionButton,
  Actions,
  Divider,
  FormElement,
  FormHeading,
} from 'Project/IssueCreate/Styles';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { Form } from 'shared/components';
import toast from 'shared/utils/toast';
import useApi from 'shared/hooks/api';
import styled from 'styled-components';
import { AppContext } from 'App/Routes';
import { storeAuthToken } from 'shared/utils/authToken';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* or any specific height you need */
  width: 100%; /* or any specific width you need */
`;

export default function Login() {
  const history = useHistory();
  const { setApp } = useContext(AppContext);
  const [{ isCreating }, createUser] = useApi.post('/login');
  const submit = async values => {
    try {
      const res = await createUser({
        ...values,
      });
      storeAuthToken(res.data.authToken);
      setApp({ user: res.data.user });
      toast.success(res.data.message);
      history.push('/project/board');
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <Container>
      <Form
        enableReinitialize
        initialValues={{
          email: '',
          password: '',
        }}
        validations={{
          email: [Form.is.required(), Form.is.email()],
          password: Form.is.required(),
        }}
        style={{
          width: '300px',
        }}
        onSubmit={submit}
      >
        <FormElement width="400px">
          <FormHeading>Login</FormHeading>
          <Form.Field.Input name="email" type="email" label="Email" />
          <Form.Field.Input name="password" type="password" label="Password" />
          <Divider />
          <Actions>
            <ActionButton type="submit" variant="primary" isWorking={isCreating}>
              Login
            </ActionButton>
          </Actions>
        </FormElement>
      </Form>
    </Container>
  );
}
