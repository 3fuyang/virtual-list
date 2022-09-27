import { type FC } from 'react';
import { useVirtualList } from '../hooks/useVirtualList';
import './virtual-list.css';

export interface ListItem {
  content: string;
  key: number;
}
interface ListProps {
  list: ListItem[];
  itemHeight: number
}

const VirtualList: FC<ListProps> = ({ list, itemHeight = 50 }) => {
  
  const {
    containerRef,
    visionRef,
    startIndex,
    endIndex,
    startOffset
  } = useVirtualList(itemHeight, list.length)
  
  return (
    <div className="list-container" ref={containerRef}>
      <div className="list-scroll-layer" style={{ height: list.length * itemHeight }}></div>
      <div className="list-vision" ref={visionRef} style={{ transform: `translate3d(0px, ${startOffset}px, 0px)` }}>
        {list.slice(startIndex, endIndex).map(({ content, key }) => (
          <div className="list-item" key={key}>
            {content} {key}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualList;
