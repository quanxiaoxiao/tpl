/** @jsx jsx */
import React, {
  useEffect,
  useState,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { jsx, css } from '@emotion/core';
import { IconBtn } from 'components/Display';

const colorMap = {
  info: 'rgba(51,51,51,1)',
  error: 'rgba(244,126,122,1)',
  warning: 'rgba(240,155,85,1)',
};

const Item = React.memo(({
  item,
  onRemove,
}) => {
  const [isActive, setActive] = useState(false);
  useEffect(() => {
    let timer;
    if (!isActive) {
      timer = setTimeout(() => {
        onRemove(item._id);
      }, item.duration || 2000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [item, isActive, onRemove]);

  const style = useMemo(() => {
    if (!item.position) {
      return {};
    }
    return {
      position: 'fixed',
      zIndex: 1000,
      ..._.pick(item.position, ['top', 'left', 'right', 'bottom', 'transform']),
    };
  }, [item]);

  const handleClickOnRemove = () => {
    onRemove(item._id);
  };

  return (
    <div
      css={css`
        height: 3.6rem;
        width: 14rem;
        padding: 0 0.8rem;
        display: flex;
        align-items: center;
        border-radius: 3px;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
        color: #fff;
        white-space: nowrap;
        overflow: hidden;
        background: ${colorMap[item.type]};
        justify-content: space-between;
      `}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      style={style}
    >
      <span>
        {item.message}
      </span>
      <IconBtn
        code="e689"
        onClick={handleClickOnRemove}
        color="#fff"
        css={css`
          width: 1.2rem;
          height: 1.2rem;
        `}
      />
    </div>
  );
});

Item.propTypes = {
  onRemove: PropTypes.func.isRequired,
  item: PropTypes.shape({
    type: PropTypes.oneOf([
      'info',
      'error',
      'warning',
    ]).isRequired,
    message: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    duration: PropTypes.number,
    position: PropTypes.shape({
      top: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number.isRequired,
      transform: PropTypes.string,
    }),
  }).isRequired,
};

export default Item;
