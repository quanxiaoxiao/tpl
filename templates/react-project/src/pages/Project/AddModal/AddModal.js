/** @jsx jsx */
import React from 'react';
import PropTypes from 'prop-types';
import { jsx, css } from '@emotion/core';
import request from 'api/request';
import useData from 'hooks/useData';
import useColor from 'hooks/useColor';
import useAction from 'hooks/useAction';
import Modal from 'components/Modal';
import Input from 'components/Input';

const AddModal = React.memo(({ onClose, onAdd }) => {
  const getColor = useColor();

  const {
    getValue,
    setValue,
    validation,
    output,
  } = useData({
    name: {
      value: '',
      output: (v) => v.trim(),
      match: (v) => v.trim().length > 0,
    },
  });

  const { action } = useAction({
    match: () => validation(),
    fn: () => request.post('/api/project', output()),
    resolve: (ret) => {
      onAdd(ret);
      onClose();
    },
  });

  return (
    <Modal
      onClose={onClose}
    >
      <div>
        <div>
          <span>name</span>
        </div>
        <Input
          css={css`
            border: 1px solid ${getColor('stroke')};
            padding: 0 0.6rem;
            border-radius: 3px;
          `}
          value={getValue('name')}
          onChange={(ev) => setValue('name', ev.target.value)}
        />
      </div>
      <div>
        <button
          type="button"
          onClick={action}
        >
          add
        </button>
      </div>
    </Modal>
  );
});

AddModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default AddModal;
