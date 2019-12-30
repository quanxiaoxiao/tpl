import React, {
  useState,
} from 'react';
import ContentScroll, { ScrollBar } from 'components/ContentScroll';
import Content from './Content';

const Scrollable = React.memo((props) => {
  const [scrollHeight, setScrollHeight] = useState(0);

  return (
    <ContentScroll
      scrollHeight={scrollHeight}
    >
      <Content
        {...props}
        onChangeHeight={(v) => setScrollHeight(v)}
      />
      <ScrollBar />
    </ContentScroll>
  );
});

Scrollable.propTypes = {
};

export default Scrollable;
