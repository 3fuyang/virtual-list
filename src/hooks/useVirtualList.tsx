import { useEffect, useRef, useState } from 'react'

/* const debounce = (callback: (...args: any[]) => any, delay: number = 500) => {
  let timer: number
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}

const throttle = <T extends any[]>(cb: (...args: T) => void, interval: number = 200) => {
  let timer: number | null
  return (...args: T) => {
    if (timer) {
      return
    }
    timer = setTimeout(() => {
      cb(...args)
      timer = null
    }, interval)
  }
} */

export function useVirtualList<C extends HTMLElement, V extends HTMLElement>(itemHeight: number) {
  // 容器元素Ref，用以获取其clientHeight
  const containerRef = useRef<C>(null),
    // 可视区域Ref
    visionRef = useRef<V>(null),
    // 容器所能容纳item条数
    volume = useRef(0)

  // 可视区域起始元素索引
  const [startIndex, setStart] = useState(+0),
    // 可视区域相对顶部滑动距离
    [startOffset, setOffset] = useState(0)
  
  useEffect(() => {
    volume.current = Math.ceil(containerRef.current!.clientHeight / itemHeight) + 1

    const intersectionObserver = new IntersectionObserver(() => {
      // access scrollTop triggers reflow
      const scrollTop = containerRef.current!.scrollTop

      // it seems that these two update are not batched by React?
      setStart(Math.floor(scrollTop / itemHeight))
      setOffset(scrollTop - scrollTop % itemHeight)
    }, {
      root: containerRef.current,
      threshold: [0, 0.1, 0.3, 0.5, 0.7, 0.8, 0.9, 1]
    })

    intersectionObserver.observe(visionRef.current!)

    import.meta.env.DEV && console.log('IntersectionObserver observed.')

    // before the intersection observer triggers, re-render and set the endIndex
    setStart(-0)

    return () => {
      visionRef.current && intersectionObserver.unobserve(visionRef.current)
      import.meta.env.DEV && console.log('IntersectionObserver unobserved')
    }
  }, [])

  return {
    containerRef,
    visionRef,
    startIndex,
    startOffset,
    volume
  }
}