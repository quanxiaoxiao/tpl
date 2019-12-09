import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import UpdateModal from './UpdateModal';

const Update = React.memo(({ item, onUpdate }) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <Fragment>
      <button
        type="button"
        onClick={() => setModalShow(true)}
      >
        update
      </button>
      {
        modalShow && (
          <UpdateModal
            name={item.name}
            id={item.id}
            onClose={() => setModalShow(false)}
            onUpdate={onUpdate}
          />
        )
      }
    </Fragment>
  );
});

Update.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default Update;
