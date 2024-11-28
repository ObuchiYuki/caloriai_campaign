import styled from "styled-components";

export const Spacer = styled.div<{ $height?: number }>`
  height: ${props => props.$height ?? 8}px;
`