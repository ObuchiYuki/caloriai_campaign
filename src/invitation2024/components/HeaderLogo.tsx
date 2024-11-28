import styled from "styled-components";

const _HeaderLogo = styled.img`
  width: 100%;
  object-fit: contain;
`

export const HeaderLogo = () => {
  return (
    <_HeaderLogo src="/invitation2024/campaign_title.png" alt="header logo" />
  )
}
