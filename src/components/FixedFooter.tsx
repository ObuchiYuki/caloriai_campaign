import styled from "styled-components"

const _FixedFooterContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  height: -webkit-fill-available;
  z-index: 1000;
`

const _FixedFooter = styled.div`
  width: 100%;
  padding: 16px;
  display: flex;
  justify-content: center;
  background: white;
  position: absolute;
  bottom: 0;
  gap: 16px;

`

export const FixedFooter = ({ children }: { children: React.ReactNode }) => {
  return (
    <_FixedFooterContainer>
      <_FixedFooter>
        {children}
      </_FixedFooter>
    </_FixedFooterContainer>
  )
}