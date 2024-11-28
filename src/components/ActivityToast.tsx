import { useEffect, useState } from "react";
import styled from "styled-components";
import { UIActivityIndicator } from "./UIActivityIndicator";

const _Overlay = styled.div<{ $opacity: number }>`
  position: fixed; /* ビューポート全体を覆う */
  top: 0;
  left: 0;
  width: 100vw;
  height: calc(var(--real-vh, 1vh) * 100);
  background-color: rgba(0, 0, 0, 0.001);
  display: flex;
  justify-content: center;
  align-items: center; 
  z-index: 1000;
  pointer-events: auto; 
  opacity: ${props => props.$opacity};
  transition: opacity 0.3s;
`;

const _Toast = styled.div`
  background: rgba(0, 0, 0, 0.7);
  border-radius: 18px;
  padding: 16px;
  width: 100px;
  height: 100px;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

export const ActivityToast = () => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(1);
  }, []);

  useEffect(() => {
    const preventScroll = (e: any) => {
      e.preventDefault();
    };

    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('wheel', preventScroll, { passive: false });

    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    return () => {
      document.removeEventListener('touchmove', preventScroll, { passive: false } as any);
      document.removeEventListener('wheel', preventScroll, { passive: false } as any);

      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, []);

  return (
    <_Overlay $opacity={opacity}>
      <_Toast>
        <UIActivityIndicator color="white"/>
      </_Toast>
    </_Overlay>
  );
}