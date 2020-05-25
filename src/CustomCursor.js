import React, {useState, useEffect, useRef} from 'react';

import {TweenMax} from 'gsap';
import styled from 'styled-components';
import {isMobile} from 'react-device-detect';

const CursorRoot = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
`;

const CursorPointer = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  opacity: 0;
  pointer-events: none;
  width: 50px;
  height: 50px;
  top: -25px;
  left: -25px;
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

const SCREEN_SECTIONS = {
  CENTER: 'center',
  LEFT: 'left',
  RIGHT: 'right',
}
const SCREEN_SECTIONS_START_VALUE = 0.25;
const ARROW_TRANSFORM_DURATION = 0.5;
const ARROW_OPACITY_DURATION = 0.166;

function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorScreenLocation, setCursorScreenLocation] = useState(SCREEN_SECTIONS.CENTER);
  const prevCursorScreenLocationRef = useRef();
  const cursorPointerRef = useRef(null);
  const cursorPointerInnerRef = useRef(null);
  const cursorArrowLeftRef = useRef(null);
  const cursorArrowRightRef = useRef(null);

  const animateArrow = (cursorArrowRef, fromX, toX, toOpacity) => {
    TweenMax.fromTo(cursorArrowRef.current, ARROW_TRANSFORM_DURATION, {x:fromX}, {x:toX});
    TweenMax.to(cursorArrowRef.current, ARROW_OPACITY_DURATION, {opacity:toOpacity});
  };

  const determineCursorScreenLocation = (clientX) => {
    const width = window.innerWidth;
    const isLeftSide = clientX < (width * SCREEN_SECTIONS_START_VALUE);
    const isRightSide = clientX > (width - (width * SCREEN_SECTIONS_START_VALUE));
    if(isLeftSide && cursorScreenLocation !== SCREEN_SECTIONS.LEFT) {
      setCursorScreenLocation(SCREEN_SECTIONS.LEFT);
      animateArrow(cursorArrowLeftRef, 20, 0, 1);
    } else if (isRightSide && cursorScreenLocation !== SCREEN_SECTIONS.RIGHT) {
      setCursorScreenLocation(SCREEN_SECTIONS.RIGHT);
      animateArrow(cursorArrowRightRef, -20, 0, 1);
    } else if (!isLeftSide && !isRightSide && cursorScreenLocation !== SCREEN_SECTIONS.CENTER) {
      if (prevCursorScreenLocationRef.current === SCREEN_SECTIONS.LEFT) {
        animateArrow(cursorArrowLeftRef, 0, 20, 0);
      } else {
        animateArrow(cursorArrowRightRef, 0, -20, 0);
      }
      setCursorScreenLocation(SCREEN_SECTIONS.CENTER);
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
  };

  const handleMouseDown = () => {
    TweenMax.to(cursorPointerInnerRef.current, 0.166, {scale:0.75});
  };

  const handleMouseUp = () => {
    TweenMax.to(cursorPointerInnerRef.current, 0.166, {scale:1});
  };

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (!isMobile) {
      prevCursorScreenLocationRef.current = cursorScreenLocation;
      document.addEventListener('mousemove', handleMouseMove, false);
      document.addEventListener('mouseenter', handleMouseEnter, false);
      document.addEventListener('mouseleave', handleMouseLeave, false);
      document.addEventListener('mousedown', handleMouseDown, false);
      document.addEventListener('mouseup', handleMouseUp, false);

      if (isVisible) {
        cursorPointerRef.current.style.opacity = 1;
        document.body.style.cursor = 'none';
      } else {
        cursorPointerRef.current.style.opacity = 0;
        document.body.style.cursor = 'default';
      }
    }

    return function cleanup() {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseDown);
    };
  });
  
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
