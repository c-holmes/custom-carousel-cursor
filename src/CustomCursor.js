import React, {useState, useEffect, useRef, useCallback} from 'react';

import {TweenMax} from 'gsap';
import styled from 'styled-components';
import {isMobile} from 'react-device-detect';
import {useMousePosition} from './useMousePosition';

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
  width: 50px;
  height: 50px;
`;

const CursorInner = styled.div`
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 999;
  border: 1px solid #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  width: 49px;
  height: 49px;
`;

const CursorArrowContainer = styled.div`
  position: absolute;
  height: 20px;
  width: 54px;
  transform: translateY(-50%);
  top: 50%;
`;

const CursorArrow = styled.img`
  opacity: 0;
  position: absolute;
  width:100%;
  z-index: 999;
`;

const CursorArrowLeft = styled(CursorArrow)`
  left: 20px;
`;

const CursorArrowRight = styled(CursorArrow)`
  right: 20px;
`;

const SCREEN_LOCATION = {
  CENTER: 'center',
  LEFT: 'left',
  RIGHT: 'right',
}
const SCREEN_LOCATION_VALUE = 0.25;

function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorScreenLocation, setCursorScreenLocation] = useState(SCREEN_LOCATION.CENTER);
  const prevCursorScreenLocationRef = useRef();
  const cursorPointerRef = useRef(null);
  const cursorPointerInnerRef = useRef(null);
  const cursorArrowLeftRef = useRef(null);
  const cursorArrowRightRef = useRef(null);

  const determineCursorScreenLocation = (clientX) => {
    const width = window.innerWidth;
    const isLeftSide = clientX < (width * SCREEN_LOCATION_VALUE);
    const isRightSide = clientX > (width - (width * SCREEN_LOCATION_VALUE));
    const prevCursorScreenLocation = prevCursorScreenLocationRef.current;
    if(isLeftSide && cursorScreenLocation !== SCREEN_LOCATION.LEFT) {
      setCursorScreenLocation(SCREEN_LOCATION.LEFT);
      cursorArrowRightRef.current.style.opacity = 0;
      TweenMax.fromTo(cursorArrowLeftRef.current, 0.5, {x:20}, {x:0})
      TweenMax.to(cursorArrowLeftRef.current, 0.166, {opacity:1})
    } else if (isRightSide && cursorScreenLocation !== SCREEN_LOCATION.RIGHT) {
      setCursorScreenLocation(SCREEN_LOCATION.RIGHT);
      cursorArrowLeftRef.current.style.opacity = 0;
      TweenMax.fromTo(cursorArrowRightRef.current, 0.5, {x:-20}, {x:0})
      TweenMax.to(cursorArrowRightRef.current, 0.166, {opacity:1})
    } else if (!isLeftSide && !isRightSide && cursorScreenLocation !== SCREEN_LOCATION.CENTER) {
      if (prevCursorScreenLocation === SCREEN_LOCATION.LEFT) {
        TweenMax.fromTo(cursorArrowLeftRef.current, 0.5, {x:0}, {x:20})
        TweenMax.to(cursorArrowLeftRef.current, 0.166, {opacity:0})
      } else {
        TweenMax.fromTo(cursorArrowRightRef.current, 0.5, {x:0}, {x:-20})
        TweenMax.to(cursorArrowRightRef.current, 0.166, {opacity:0})
      }
      setCursorScreenLocation(SCREEN_LOCATION.CENTER);
    }
  };

  const handleMouseMove = (event) => {
    if (event.target && event.target.localName === 'iframe') {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    TweenMax.killTweensOf(cursorPointerRef);
    TweenMax.set(cursorPointerRef.current, { force3D: true, x: event.clientX, y: event.clientY });
    determineCursorScreenLocation(event.clientX);
  }

  const handleMouseDown = () => {
    TweenMax.to(cursorPointerInnerRef.current, 0.166, {scale:0.75})
  }

  const handleMouseUp = () => {
    TweenMax.to(cursorPointerInnerRef.current, 0.166, {scale:1})
  }

  const handleMouseEnter = () => {
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  useEffect(() => {
    if (!isMobile) {
      prevCursorScreenLocationRef.current = cursorScreenLocation;
      window.addEventListener('mousemove', handleMouseMove, false);
      window.addEventListener('mouseenter', handleMouseEnter, false);
      window.addEventListener('mouseleave', handleMouseLeave, false);
      window.addEventListener('mousedown', handleMouseDown, false);
      window.addEventListener('mouseup', handleMouseUp, false);
    }
    return function cleanup() {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseDown);
    };
  });
  
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
        <CursorInner ref={cursorPointerInnerRef} />
        <CursorArrowContainer>
          <CursorArrowLeft ref={cursorArrowLeftRef} src={'../arrow-left.png'} alt="left arrow" />
          <CursorArrowRight ref={cursorArrowRightRef} src={'../arrow-right.png'} alt="right arrow" />
        </CursorArrowContainer>
      </CursorPointer>
    </CursorRoot>
  );
}

export default CustomCursor;
