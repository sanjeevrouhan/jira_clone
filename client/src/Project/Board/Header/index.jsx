import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'shared/components';

import { AppContext } from 'App/Routes';
import { removeStoredAuthToken } from 'shared/utils/authToken';
import { Header, BoardName } from './Styles';

const ProjectBoardHeader = () => {
  const { app, setApp } = useContext(AppContext);
  const history = useHistory();
  console.log('app ', app);
  return (
    <Header>
      <BoardName>Kanban board - {app.user.name}</BoardName>
      <Button
        type="button"
        onClick={() => {
          setApp(null);
          removeStoredAuthToken();
        }}
      >
        Logout - {app.user.name}
      </Button>
    </Header>
  );
};

export default ProjectBoardHeader;
