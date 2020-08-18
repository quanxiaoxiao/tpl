import React from 'react';
import Backdrop from 'components/Backdrop';
import Spinner from 'components/Spinner';
import useStore from '../useStore';

const Loading = React.memo(() => {
  const { state } = useStore();
  const { loadingShow } = state;

  if (!loadingShow) {
    return null;
  }

  return (
    <Backdrop>
      <Spinner />
    </Backdrop>
  );
});

export default Loading;
