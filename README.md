# Virtual List Demo

> Deploying demos on StackBlitz is much more reassuring than getting ~~F-word~~ed up by my own cheap server.
>
> Acknowledgement:
>
> + ~~Best Forum~~ - [「前端进阶」高性能渲染十万条数据(虚拟列表) - 掘金 (juejin.cn)](https://juejin.cn/post/6844903982742110216)

A really rough demo of virtual list, aka virtual scroller.

Demo: [StackBlitz](https://stackblitz.com/edit/vitejs-vite-afjm4m?file=package.json)

## Screenshot

<img src="README.assets/image-20220925165657223.png" alt="image-20220925165657223" style="zoom:50%;" />

## useVirtualList hook

### with Intersection Observer

```tsx
// useVirtualList.tsx
/**
* itemHeight: the fixed height of every rendered list-item
* totalNum: the length of the long long list
*/
export function useVirtualList(itemHeight: number, totalNum: number) {
  // container Ref for capturing its clientHeight
  const containerRef = useRef<HTMLDivElement>(null)
  // visible list Ref to be observed by Intersection Observer
  const visionRef = useRef<HTMLDivElement>(null)
  // the start index of the visible list
  const [startIndex, setStart] = useState(0),
  // the volume of the container (how many items it can display)
  [volume, setVolume] = useState(0),
  // the ending index of the visible list
  [endIndex, setEnd] = useState(0),
  // the offset which the visible list is away from the scrollable container
  [startOffset, setOffset] = useState(0)

  useEffect(() => {
    if (containerRef.current && visionRef.current) {
      setVolume(Math.ceil(containerRef.current.clientHeight / itemHeight) + 1)

      // instantiate and apply the Observer
      const intersectionObserver = new IntersectionObserver(() => {
        if (containerRef.current) {
          const scrollTop = containerRef.current.scrollTop
          setStart(Math.floor(scrollTop / itemHeight))
          setOffset(scrollTop - scrollTop % itemHeight)
        }
      }, {
        root: containerRef.current,
	// thresholds according to your requirements
	// triggers callback when the vision-list accounts 30%, 50%, 70%, 90% of the viewport of the container
	// to handle different velocity of user scrolling
        threshold: [0.3, 0.5, 0.7, 0.9]
      })

      intersectionObserver.observe(visionRef.current)
  
      return () => {
        visionRef.current && intersectionObserver.unobserve(visionRef.current)
      }
    }
  }, [containerRef, visionRef])

  useEffect(() => {
    setEnd(Math.min(totalNum, startIndex + volume))
  }, [startIndex, volume])

  return {
    containerRef,
    // export the visionRef 
    visionRef,
    startIndex,
    endIndex,
    startOffset
  }
}
```

### with Scroll Event Handler (onscroll)

```tsx
// useVirtualList.tsx
/**
* itemHeight: the fixed height of every rendered list-item
* totalNum: the length of the long long list
*/
export function useVirtualList(itemHeight: number, totalNum: number) {
  // container Ref for capturing its clientHeight
  const containerRef = useRef<HTMLDivElement>(null)

  // the start index of the visible list
  const [startIndex, setStart] = useState(0),
  // the volume of the container (how many items it can display)
  [volume, setVolume] = useState(0),
  // the ending index of the visible list
  [endIndex, setEnd] = useState(0),
  // the offset which the visible list is away from the scrollable container
  [startOffset, setOffset] = useState(0)

  // get basic info via the containerRef
  useEffect(() => {
    if (containerRef.current) {
      setVolume(Math.ceil(containerRef.current.clientHeight / itemHeight) + 1)

      containerRef.current.onscroll = (e: Event) => {
        if (containerRef.current) {
          const scrollTop = containerRef.current.scrollTop
          setStart(Math.floor(scrollTop / itemHeight))
          setOffset(scrollTop - scrollTop % itemHeight)
        }
      }
    }

    return () => {
      containerRef.current && (containerRef.current.onscroll = null)
    }
  }, [containerRef])

  // watch the startIndex and volume states to compute the endIndex
  useEffect(() => {
    setEnd(Math.min(totalNum, startIndex + volume))
  }, [startIndex, volume])

  // now component use these to compute the visible items, and translate the visible list
  return {
    containerRef,
    startIndex,
    endIndex,
    startOffset
  }
}

// VirtualList.tsx
const VirtualList: FC<ListProps> = ({ list, itemHeight = 50 }) => {
  
  const {
    containerRef,
    startIndex,
    endIndex,
    startOffset
  } = useVirtualList(itemHeight, list.length)
  
  return (
    <div className="list-container" ref={containerRef}>
      <div className="list-scroll-layer" style={{ height: list.length * itemHeight }}></div>
      <div className="list-vision" style={{ transform: `translate3d(0px, ${startOffset}px, 0px)` }}>
        {list.slice(startIndex, endIndex).map(({ content, key }) => (
          <div className="list-item" key={key}>
            {content} {key}
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Notes

### When React runs Effects

>  Reference:
>
> + [Hooks API Reference – React (reactjs.org)](https://reactjs.org/docs/hooks-reference.html#useeffect)

The function passed to `useEffect` will run after the render is **committed to the screen**.

It is quite confusing that the beta React Docs keeps mentioning Effects are executed **after rendering**, since they [split](https://beta.reactjs.org/learn/render-and-commit) an update(or mount) to "render" and "commit".

### When React attaches the refs to DOM

>  Reference:
>
> + [Manipulating the DOM with Refs (reactjs.org)](https://beta.reactjs.org/learn/manipulating-the-dom-with-refs#when-react-attaches-the-refs)

In React, every update is split in [two phases](https://beta.reactjs.org/learn/render-and-commit#step-3-react-commits-changes-to-the-dom):

* During **render,** React calls your components to figure out what should be on the screen.
* During **commit,** React applies changes to the DOM.

React sets `ref.current` during the **commit**. 

+ Before updating the DOM, React sets the affected `ref.current` values to `null`.

+ After updating the DOM, React immediately sets them to the corresponding DOM nodes.
