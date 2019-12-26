/** @jsx jsx */
import React, {
  useEffect,
  useCallback,
  useContext,
  useState,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { jsx, css } from '@emotion/core';
import useColor from 'hooks/useColor';
import Icon from 'components/Icon';
import Context from 'View/Context';
import { actions } from 'View/reducer';

const Item = React.memo(({
  type,
  message,
  id,
  position,
  duration = 3000,
}) => {
  const getColor = useColor();
  const [isActive, setActive] = useState(false);
  const { dispatch } = useContext(Context);

  useEffect(() => {
    let timer;
    if (!isActive) {
      timer = setTimeout(() => {
        dispatch(actions.removeToastr(id));
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
    dispatch(actions.removeToastr(id));
  }, [id]);

  return (
    <div
      css={css`
        height: 3.6rem;
        width: 14rem;
        background: #ccc;
        padding: 0 0.8rem;
        display: flex;
        align-items: center;
        border-radius: 3px;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
        color: ${getColor('fill')};
        white-space: nowrap;
        overflow: hidden;
        background: ${getColor(type)};
        justify-content: space-between;
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
    >
      <span>
        {message}
      </span>

      <a
        onClick={handleClickOnRemove}
      >
        <Icon
          css={css`
            display: block;
            width: 0.8rem;
            height: 0.8rem;
          `}
          color={getColor('fill')}
          code="e63a"
        />
      </a>
    </div>
  );
});

Item.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  duration: PropTypes.number,
  position: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
  }),
};

export default Item;
