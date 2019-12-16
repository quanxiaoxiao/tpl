import React, { useContext } from 'react';
import Backdrop from 'components/Backdrop';
import Spinner from 'components/Spinner';
import Context from 'View/Context';

const Loading = React.memo(() => {
  const { state } = useContext(Context);

  if (!state.loadingShow) {
    return null;
  }

  return (
    <Backdrop>
      <Spinner />
    </Backdrop>
  );
});

export default Loading;
