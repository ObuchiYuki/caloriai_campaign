import styled, { keyframes } from 'styled-components';

type SpokeProps = {
  size: number,
  width: number,
  height: number,
  color: string,
  index: number,
  count: number
}

const fade = keyframes`
  0%, 39%, 100% { opacity: 0.25; }
  40% { opacity: 1; }
`;

const Container = styled.div<{ size: number }>`
  position: relative;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  opacity: 0.5;
`;

const Spoke = styled.div<SpokeProps>`
  position: absolute;
  top: ${(props) => props.size/2 + props.size / 40 * 6}px;
  left: ${(props) => props.size/2 - props.width / 2}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  background-color: ${(props) => props.color};
  border-radius: ${(props) => props.width / 2}px;
  transform-origin: center ${(props) => props.size / 40 * -6}px;
  transform: rotate(${(props) => (360 / props.count) * props.index}deg);
  animation: ${fade} 1.2s infinite ease-in-out both;
  animation-delay: ${(props) => (-1.2 + (props.index * 1.2) / props.count)}s;
`;

export const UIActivityIndicator = ({ size = 40, count = 8, color = "rgb(0, 0, 0)" }: { size?: number, count?: number, color?: string }) => {
  const spokeWidth = size / 40 * 5;
  const spokeHeight = size / 40 * 12;

  const spokes = Array.from({ length: count }, (_, index) => (
    <Spoke
      key={index}
      index={index}
      count={count}
      size={size}
      width={spokeWidth}
      height={spokeHeight}
      color={color}
    />
  ));

  return <Container size={size}>{spokes}</Container>;
};
