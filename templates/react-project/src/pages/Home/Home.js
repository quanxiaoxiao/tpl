import React from 'react';
import useToastr from 'hooks/useToastr';

const Home = React.memo(() => {
  const toastr = useToastr();

  return (
    <div>
      <div>
        <span>Home page</span>
      </div>
      <button
        type="button"
        onClick={() => {
          toastr.info('xxxx');
        }}
      >
        toastr
      </button>
    </div>
  );
});

export default Home;
