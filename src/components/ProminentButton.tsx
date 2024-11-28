import styled from "styled-components";

const _ProminentButton = styled.button<{ disabled?: boolean }>`
   width: 100%;
   height: 46px;
   padding: 8px 16px;
   border-radius: var(--button-border);
   background: transparent;
   font-size: 17px;
   font-weight: 600;
   opacity: ${({ disabled }) => disabled ? 0.5 : 1};
`

const _ProminentButtonPrimary = styled(_ProminentButton)`
  background-color: var(--accent);
  color: white;
  transition: background-color 0.25s;
  &:active {
    background-color: #c5222d;
  }
`

const _ProminentButtonSecondary = styled(_ProminentButton)`
  border: 2px solid var(--accent);
  color: var(--accent);
  transition: opacity 0.25s;

  &:active {
    opacity: 0.5;
  }
`

export const ProminentButtonStyle = ["primary", "secondary"] as const;
export type ProminentButtonStyle = typeof ProminentButtonStyle[number];

export const ProminentButton = ({ 
  style = "primary", 
  onClick, 
  children,
  disabled = false
}: { 
  style?: ProminentButtonStyle,
  disabled?: boolean,
  onClick: () => void, 
  children: React.ReactNode
 }) => {
  switch (style) {
    case "primary":
      return (
        <_ProminentButtonPrimary onClick={onClick} disabled={disabled}>
          {children}
        </_ProminentButtonPrimary>
      )
    case "secondary":
      return (
        <_ProminentButtonSecondary onClick={onClick} disabled={disabled}>
          {children}
        </_ProminentButtonSecondary>
      )
  }
}

