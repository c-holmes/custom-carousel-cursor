import React, {useState, useEffect, useRef} from 'react';

import {TweenMax} from 'gsap';
import styled from 'styled-components';
import {isMobile} from "react-device-detect";

const CursorRoot = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  @include z-index(cursor);
  pointer-events: none;
`;

const CursorPointer = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  opacity: 0;
  pointer-events: none;
  width: 20px;
  height: 20px;
`;

const CursorInner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 999;
  border: 1px solid #000;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(248, 161, 92, 1);
  width: 20px;
  height: 20px;
`;

function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const cursorPointerRef = useRef(null);

  const handleMouseMove = event => {
    if (event.target && event.target.localName === 'iframe') {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    TweenMax.killTweensOf(cursorPointerRef);
    TweenMax.set(cursorPointerRef.current, { force3D: true, x: event.clientX, y: event.clientY });
  };

  const handleMouseEnter = () => {
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  useEffect(() => {
    if (!isMobile) {
      document.addEventListener('mousemove', handleMouseMove, false);
      document.addEventListener('mouseenter', handleMouseEnter, false);
      document.addEventListener('mouseleave', handleMouseLeave, false);
    }
  }, []);
  
  if (cursorPointerRef.current !== null) {
    if (isVisible) {
      cursorPointerRef.current.style.opacity = 1;
      document.body.style.cursor = 'none';
    } else {
      cursorPointerRef.current.style.opacity = 0;
      document.body.style.cursor = 'default';
    }
  }

  return (
    <CursorRoot>
      <CursorPointer ref={cursorPointerRef}>
        <CursorInner />
      </CursorPointer>
    </CursorRoot>
  );
}

export default CustomCursor;
