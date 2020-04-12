/** @jsx jsx */
import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { jsx, css } from '@emotion/core';
import useColor from 'hooks/useColor';
import useStore from 'View/useStore';
import { IconBtn } from 'components/Display';

const Item = React.memo(({
  type,
  message,
  id,
  position,
  duration = 3000,
}) => {
  const getColor = useColor();
  const [isActive, setActive] = useState(false);
  const { dispatch } = useStore();
  const map = {
    info: getColor('a01'),
    error: getColor('a0e'),
    warning: getColor('a12'),
  };

  useEffect(() => {
    let timer;
    if (!isActive) {
      timer = setTimeout(() => {
        dispatch.removeToastr(id);
      }, duration);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [id, isActive, duration]);

  const style = useMemo(() => {
    if (!position) {
      return {};
    }
    return {
      position: 'fixed',
      zIndex: 1000,
      ..._.pick(position, ['top', 'left', 'right', 'bottom', 'transform']),
    };
  }, [position]);

  const handleMouseEnter = useCallback(() => {
    setActive(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActive(false);
  }, []);

  const handleClickOnRemove = useCallback(() => {
    dispatch.removeToastr(id);
  }, [id]);

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
        color: ${getColor('a04')};
        white-space: nowrap;
        overflow: hidden;
        background: ${map[type]};
        justify-content: space-between;
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
    >
      <span>
        {message}
      </span>
      <IconBtn
        code="e72d"
        onClick={handleClickOnRemove}
        color={getColor('a04')}
        css={css`
          width: 1.2rem;
          height: 1.2rem;
        `}
      />
    </div>
  );
});

Item.propTypes = {
  type: PropTypes.oneOf([
    'info',
    'error',
    'warning',
  ]).isRequired,
  message: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  duration: PropTypes.number,
  position: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
  }),
};

export default Item;
