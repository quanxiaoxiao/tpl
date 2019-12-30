/** @jsx jsx */
import React, {
  useState,
  Fragment,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { jsx, css } from '@emotion/core';
import useColor from 'hooks/useColor';
import Backdrop from 'components/Backdrop';
import Icon from 'components/Icon';

const Confirm = React.memo(({
  children,
  onConfirm,
  onCancel,
  className,
  title = '删除',
  name = '确认操作?',
}) => {
  const [modalShow, setModalShow] = useState(false);
  const getColor = useColor();

  const handleClickOnEnsure = useCallback(() => {
    setModalShow(false);
    onConfirm();
  }, [onConfirm]);

  const handleClickOnCancel = useCallback(() => {
    setModalShow(false);
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  if (!modalShow) {
    return React.cloneElement(children, {
      onClick: (ev) => {
        ev.stopPropagation();
        setModalShow(true);
      },
    });
  }

  return (
    <Fragment>
      <Backdrop
        onClick={() => setModalShow(false)}
      >
        <div
          css={css`
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 28rem;
            border-radius: 5px;
            background: ${getColor('fill.modal')};
            box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
          `}
          onClick={(ev) => ev.stopPropagation()}
          className={className}
        >
          <div
            css={css`
              height: 2.6rem;
              display: flex;
              background: ${getColor('fill.1')};
              padding: 0 0.6rem;
              border-bottom: 1px solid ${getColor('stroke')};
              justify-content: space-between;
              align-items: center;
              border-top-left-radius: 5px;
              border-top-right-radius: 5px;
              color: ${getColor('text.5')}
            `}
          >
            <span>{title}</span>
            <a
              onClick={handleClickOnCancel}
            >
              <Icon
                code="e600"
                css={css`
                  cursor: pointer;
                  width: 1rem;
                  height: 1rem;
                  display: block;
                `}
                color={getColor('fill.icon')}
              />
            </a>
          </div>
          <div
            css={css`
              padding: 1.6rem 1rem 1rem 1rem;
            `}
          >
            <div
              css={css`
                height: 2.4rem;
                font-size: 1.2rem;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              `}
              aria-label="name"
            >
              <span>
                {name}
              </span>
            </div>
            <div
              css={css`
                display: flex;
                justify-content: center;
                align-items: center;
                > button {
                  padding: 0.5rem 1rem;
                  border-width: 0;
                  transition: background 0.3s;
                  outline: 0;
                  color: ${getColor('fill.button.2.default')};
                  border-radius: 4px;
                }
              `}
              aria-label="confirm-btns"
            >
              <button
                type="button"
                css={css`
                  background: ${getColor('fill.button.1.default')};
                  &:hover {
                    background: ${getColor('fill.button.1.active')};
                  }
                `}
                onClick={handleClickOnEnsure}
                aria-label="confirm"
              >
                确定
              </button>
              <button
                type="button"
                css={css`
                  background: ${getColor('fill.button')};
                  margin-left: 1rem;
                  &:hover {
                    background: ${getColor('fill.button.hover')};
                  }
                `}
                onClick={handleClickOnCancel}
                aria-label="cancle"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </Backdrop>
      {children}
    </Fragment>
  );
});


Confirm.propTypes = {
  children: PropTypes.element.isRequired,
  name: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  title: PropTypes.string,
};

export default Confirm;
