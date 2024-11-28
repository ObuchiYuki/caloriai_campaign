import styled from "styled-components";

const _Container = styled.main`
  background: white;
  border-radius: 4px;
  position: relative;
  z-index: 1;
`;

const _Confetti = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  object-fit: contain;
  object-position: top;
`

const _ChildrenContainer = styled.div`
  padding: 8px;
  display: flex;
  gap: 12px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;
  width: 100%;
`

export const ConfettiCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <_Container>
      <_Confetti src="/confetti_background.png" alt="紙吹雪" />
      <_ChildrenContainer>
        {children}
      </_ChildrenContainer>
    </_Container>
  )
}