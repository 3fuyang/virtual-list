import { useEffect, useRef, useState } from "react";

/* const debounce = (callback: (...args: any[]) => any, delay: number = 500) => {
  let timer: number
  return (...args: any[]) => {
    clearTimeout(timer)
    setTimeout(() => {
      callback(...args)
    }, delay)
  }
} */

export function useVirtualList(itemHeight: number, totalNum: number) {
  // 容器元素Ref，用以获取其clientHeight
  const containerRef = useRef<HTMLDivElement>(null)

  // 可视区域起始元素索引
  const [startIndex, setStart] = useState(0),
  // 容器所能容纳item条数
  [volume, setVolume] = useState(0),
  // 可视区域结束元素索引
  [endIndex, setEnd] = useState(0),
  // 可视区域相对顶部滑动距离
  [startOffset, setOffset] = useState(0)

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

  useEffect(() => {
    setEnd(Math.min(totalNum, startIndex + volume))
  }, [startIndex, volume])

  return {
    containerRef,
    startIndex,
    endIndex,
    startOffset
  }
}