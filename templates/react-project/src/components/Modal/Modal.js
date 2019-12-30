/** @jsx jsx */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { jsx, css } from '@emotion/core';
import useColor from 'hooks/useColor';
import Backdrop from 'components/Backdrop';
import Icon from 'components/Icon';

const Modal = React.memo(({
  onClose,
  title,
  children,
  className,
}) => {
  const getColor = useColor();

  useEffect(() => {
    const handleKeyDownOnWindow = (ev) => {
      if (ev.keyCode === 27 && ev.target.tagName !== 'INPUT') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDownOnWindow);
    return () => {
      window.removeEventListener('keydown', handleKeyDownOnWindow);
    };
  }, []);

  return (
    <Backdrop
      onClick={onClose}
    >
      <div
        className={className}
        css={css`
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 38vw;
          background: ${getColor('fill.modal')};
          border-radius: 0.3rem;
        `}
        onClick={(ev) => ev.stopPropagation()}
      >
        {
          title
            && (
            <div
              css={css`
                font-size: 1.2rem;
                text-align: center;
                height: 3.6rem;
                line-height: 3.6rem;
                font-weight: bold;
              `}
              aria-label="title"
            >
              <span>{title}</span>
            </div>
            )
        }
        <div aria-label="content">
          {children}
        </div>
        <a
          css={css`
            position: absolute;
            top: 1.8rem;
            right: 1rem;
            transform: translateY(-50%);
          `}
          onClick={onClose}
        >
          <Icon
            css={css`
              width: 1.1rem;
              height: 1.1rem;
              display: block;
            `}
            color={getColor('fill.icon.4')}
            code="e600"
          />
        </a>
      </div>
    </Backdrop>
  );
});

Modal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
    PropTypes.string,
  ]),
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Modal;
