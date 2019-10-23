import React, { PureComponent } from 'react';
import stylePropType from 'react-style-proptype';
import PropTypes from 'prop-types';

const wrapper = (WrapperComponent) => {
  class Wrapper extends PureComponent {
    container = React.createRef()

    constructor(props, context) {
      super(props, context);
      this.state = {
        width: 0,
        height: 0,
      };
    }

    componentDidMount() {
      window.addEventListener('resize', this.handleUpate);
      setTimeout(() => {
        this.handleUpate();
      }, 0);
    }

    componentDidUpdate(prevProps) {
      const { height } = this.props;
      if (prevProps.height !== height) {
        this.handleUpate();
      }
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleUpate);
    }

    get style() {
      const { height, style = {} } = this.props;
      if (height != null) {
        return {
          ...style,
          position: 'relative',
          padding: 'inherit',
          height: `${height}px`,
        };
      }
      return {
        ...style,
        position: 'absolute',
        padding: 'inherit',
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
      };
    }

    handleUpate = () => {
      if (!this.container.current) {
        return;
      }
      const { parentNode } = this.container.current;
      if (!this.#inited && getComputedStyle(parentNode).position === 'static') {
        parentNode.style.position = 'relative';
      }
      const { width: prevWidth, height: prevHeight } = this.state;
      const { width } = this.container.current.getBoundingClientRect();
      const { height = parentNode.clientHeight } = this.props;
      if (this.#inited && width === prevWidth && height === prevHeight) {
        return;
      }
      this.setState({
        width,
        height,
      }, () => {
        if (!this.#inited) {
          this.#inited = true;
          setTimeout(() => {
            this.handleUpate();
          }, 80);
        }
      });
    }

    #inited = false

    render() {
      const {
        className,
        height: _height,
        style,
        forwardedRef,
        ...reset
      } = this.props;
      const { width, height } = this.state;
      return (
        <div
          className={className}
          ref={this.container}
          style={this.style}
        >
          {(width === 0 || height === 0)
            ? null
            : (
              <WrapperComponent
                {...reset}
                width={width}
                height={height}
                ref={forwardedRef}
              />
            )}
        </div>
      );
    }
  }

  Wrapper.propTypes = {
    className: PropTypes.string,
    height: PropTypes.number,
    style: stylePropType,
    forwardedRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({
        current: PropTypes.instanceOf(Element),
      }),
    ]),
  };

  return React.forwardRef((props, ref) => ( // eslint-disable-line
    <Wrapper {...props} forwardedRef={ref} />
  ));
};

export default wrapper;
