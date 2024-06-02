import React from 'react';
import PropTypes from 'prop-types';
import { xor } from 'lodash';

import { createQueryParamModalHelpers } from 'shared/utils/queryParamModal';
import { Modal, Form } from 'shared/components';
import toast from 'shared/utils/toast';
import useApi from 'shared/hooks/api';
import { ActionButton, Actions, Divider, FormElement } from 'Project/IssueCreate/Styles';
import {
  Filters,
  SearchInput,
  Avatars,
  AvatarIsActiveBorder,
  StyledAvatar,
  StyledButton,
  ClearAll,
  FormHeading,
  Name,
} from './Styles';

const propTypes = {
  projectUsers: PropTypes.array.isRequired,
  project: PropTypes.object.isRequired,
  defaultFilters: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  mergeFilters: PropTypes.func.isRequired,
};
const Roles = {
  ADMIN: 'admin',
  USER: 'user',
};
const ProjectBoardFilters = ({ projectUsers, defaultFilters, filters, mergeFilters, project }) => {
  const { searchTerm, userIds, myOnly, recent } = filters;
  const addUserModalHelpers = createQueryParamModalHelpers('add-user');

  const areFiltersCleared = !searchTerm && userIds.length === 0 && !myOnly && !recent;

  return (
    <Filters data-testid="board-filters">
      <SearchInput
        icon="search"
        value={searchTerm}
        onChange={value => mergeFilters({ searchTerm: value })}
      />
      <Avatars>
        {projectUsers.map(user => (
          <AvatarIsActiveBorder key={user.id} isActive={userIds.includes(user.id)}>
            <StyledAvatar
              avatarUrl={user.avatarUrl}
              name={user.name}
              onClick={() => mergeFilters({ userIds: xor(userIds, [user.id]) })}
            >
              <Name>{user.name}</Name>
            </StyledAvatar>
          </AvatarIsActiveBorder>
        ))}
      </Avatars>
      <StyledButton variant="empty" onClick={() => addUserModalHelpers.open()}>
        Add User
      </StyledButton>
      <StyledButton
        variant="empty"
        isActive={myOnly}
        onClick={() => mergeFilters({ myOnly: !myOnly })}
      >
        Only My Issues
      </StyledButton>
      <StyledButton
        variant="empty"
        isActive={recent}
        onClick={() => mergeFilters({ recent: !recent })}
      >
        Recently Updated
      </StyledButton>
      {!areFiltersCleared && (
        <ClearAll onClick={() => mergeFilters(defaultFilters)}>Clear all</ClearAll>
      )}
      {addUserModalHelpers.isOpen() && (
        <Modal
          isOpen
          testid="modal:add-user"
          variant="center"
          width={600}
          onClose={addUserModalHelpers.close}
          renderContent={() => <AddUser project={project} modalClose={addUserModalHelpers.close} />}
        />
      )}
    </Filters>
  );
};

ProjectBoardFilters.propTypes = propTypes;

export default ProjectBoardFilters;
const roleOptions = Object.keys(Roles).map(role => {
  return {
    label: role,
    value: role,
  };
});
const AddUser = ({ modalClose, project }) => {
  const [{ isCreating }, createUser] = useApi.post('/addUser');
  const submit = async (values, form) => {
    try {
      await createUser({
        ...values,
        project: project.id,
      });
      toast.success('User has been successfully added.');
      modalClose();
    } catch (error) {
      Form.handleAPIError(error, form);
    }
  };
  return (
    <Form
      enableReinitialize
      initialValues={{
        name: '',
        email: '',
        role: Roles.USER,
        password: '',
      }}
      validations={{
        name: Form.is.required(),
        email: [Form.is.required(), Form.is.email()],
        role: Form.is.required(),
        password: Form.is.required(),
      }}
      onSubmit={submit}
    >
      <FormElement>
        <FormHeading>Add User</FormHeading>
        <Form.Field.Input name="name" label="Name" />
        <Divider />
        <Form.Field.Input name="email" type="email" label="Email" />
        <Form.Field.Input name="password" type="password" label="Password" />
        <Form.Field.Select
          name="role"
          label="Select Role"
          options={roleOptions}
          //   renderOption={renderType}
          //   renderValue={renderType}
        />
        <Actions>
          <ActionButton type="submit" variant="primary" isWorking={isCreating}>
            Add User
          </ActionButton>
          <ActionButton type="button" variant="empty" onClick={modalClose}>
            Cancel
          </ActionButton>
        </Actions>
      </FormElement>
    </Form>
  );
};
