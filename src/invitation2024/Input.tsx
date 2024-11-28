import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { Spacer } from "../components/Spacer"
import { ProminentButton } from "../components/ProminentButton"
import * as CaloriAI from "../caloriai_connector"
import { ActivityToast } from "../components/ActivityToast"

const _Page = styled.div`
  padding: 16px;
  position: relative;
  padding-top: 32px;
  height: calc(var(--real-vh, 1vh) * 100);
  position: relative; 
`

const _OnboardHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`

const _OnboardTitle = styled.h1`
  font-size: 34px;
  font-weight: bold;
  text-align: center;
`

const _OnboardSubTitle = styled.h3`
  font-size: 17px;
  text-align: center;
  font-weight: 500;
  width: 360px;
`

const _OnboardInput = styled.input`
  background-color: var(--secondary-background);
  border-radius: 8px;
  border: none;
  padding: 16px;
  width: 100%;
  font-size: 20px;
  font-weight: bold;
  pointer-events: auto;
  user-select: text;

  &:focus {
    outline: none;
  }
`

const _OnboardInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  width: 100%;
`

const _OnboardPasteButton = styled.button`
  background-color: var(--secondary-background);
  color: white;
  border-radius: 8px;
  padding: 16px;
  font-size: 20px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:active {
    background-color: #c2c2c8;
  }
`;

const _OnboardPasteButtonImage = styled.img`
  -webkit-touch-callout: none;
`

const _OnboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
`

const _OnboardNotation = styled.p`
  color: var(--secondary);
  font-size: 14px;
  font-weight: 600;
`

const _OnboardButtonContainer = styled.div<{ $keyboardHeight: number }>`
  position: absolute;
  bottom: ${props => props.$keyboardHeight == 0 ? "64px" : `${16 + props.$keyboardHeight}px`};
  left: 16px;
  right: 16px;
  transition: bottom 0.3s;
`

export const Input = () => {
  useEffect(() => {
    document.title = ""
  }, [])

  const initialVisualViewportHeight = useRef(window.visualViewport!.height)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    if (window.visualViewport == null) return;
    window.visualViewport?.addEventListener('resize', () => {
      const keyboardHeight = initialVisualViewportHeight.current - window.visualViewport!.height
      if (keyboardHeight < 0) return;
      setKeyboardHeight(keyboardHeight)
    })
  }, [])

  const inputElementRef = useRef<HTMLInputElement>(null)
  
  const [isLoading, setIsLoading] = useState(false)
  
  const handleInput = async () => {
    if (inputElementRef.current == null) return
    const code = inputElementRef.current.value
    if (code == "") {
      CaloriAI.showToast({
        title: "コードを入力してください",
        preset: "error"
      })
      return
    }

    setIsLoading(true)

    try {
      await CaloriAI.callAPI({
        endpoint: "http://api.caloriai.com/campaign/invitation-2024/receive",
        method: "POST",
        body: JSON.stringify({ code: code }),
        headers: {
          "Content-Type": "application/json"
        }
      })

      CaloriAI.showToast({
        title: "コードを登録しました",
        preset: "done"
      })

      await new Promise(resolve => setTimeout(resolve, 1000))

      CaloriAI.relogin()
    } catch (e) {
      if (typeof (e as any).status === "number") {
        const status: number = (e as any).status
        if (status == 403) {
          CaloriAI.showToast({ title: "アカウント作成から2週間以上経過しています", preset: "error" })
        } else if (status == 406) {
          CaloriAI.showToast({ title: "自身で発行したコードは使用できません", preset: "error" })
        } else if (status == 407) {
          CaloriAI.showToast({ title: "コードは上限まで使用されています", preset: "error" })
        } else if (status == 401) {
          CaloriAI.showToast({ title: "既にプレミアム会員です", preset: "error" })
        } else if (status == 418) {
          CaloriAI.showToast({ title: "招待コードは一度しか入力できません", preset: "error" })
        } else if (status == 404) {
          CaloriAI.showToast({ title: "コードが正しくありません", preset: "error" })
        }
      } else {
        CaloriAI.showToast({ title: "エラーが発生しました", preset: "error" })
      }
    }
    finally {
      setIsLoading(false)
    }
  }

  const onPaste = async () => {
    if (inputElementRef.current == null) return
    const { text } = await CaloriAI.getClipboardText()
    if (text != null && text != "") inputElementRef.current!.value = text
  }

  return (
    <_Page>
      <_OnboardHeaderContainer>
        <_OnboardTitle>招待コードを入力</_OnboardTitle>
        <_OnboardSubTitle>招待コードをお持ちの場合は入力してください</_OnboardSubTitle>
      </_OnboardHeaderContainer>

      <Spacer $height={52} />

      <_OnboardContainer>
        <_OnboardInputContainer>
          <_OnboardInput type="text" placeholder="コード" ref={inputElementRef} onFocus={() => {
            setTimeout(() => {
              window.scrollTo(0, -1)
            }, 1)
          }} />
          <_OnboardPasteButton onClick={onPaste}>
          <_OnboardPasteButtonImage src="/paste.png" width={30} onTouchStart={(e) => e.preventDefault()} />
          </_OnboardPasteButton>
        </_OnboardInputContainer>
        <_OnboardNotation>
          大文字と小文字を区別しません
        </_OnboardNotation>
      </_OnboardContainer>

      <Spacer $height={32} />

      <_OnboardButtonContainer $keyboardHeight={keyboardHeight}>
        <ProminentButton onClick={handleInput}>
          コードを登録
        </ProminentButton>      
      </_OnboardButtonContainer>

      {
        isLoading && <ActivityToast />
      }
    </_Page>
  )
}