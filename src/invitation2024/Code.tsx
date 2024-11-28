import styled from "styled-components"
import { ConfettiCard } from "../components/ConfettiCard"
import { HeaderLogo } from "./components/HeaderLogo"
import { ProminentButton } from "../components/ProminentButton"
import { Spacer } from "../components/Spacer"
import { useEffect, useRef, useState } from "react"
import * as CaloriAI from "../caloriai_connector"

const _Page = styled.div`
  background: var(--accent);
  padding: 8px;
  position: relative;
`

const _CodeContainer = styled.div`
  border-radius: 8px;
  background: white;
  padding: 12px 24px;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 8px;
  border: 1px solid #ddd;
  text-align: center;
  width: 70%;
  height: 64px;

  &:active {
    background: #f0f0f0;
  }
`

const _ContainerForCapture = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
`

const _ContainerImageForCapture = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`

const _CodeContainerForImage = styled.div`
  position: absolute;
  height: 48px;
  text-align: center;
  top: 210px;
  left: 60px;
  width: 283px;
  height: 60px;
  font-size: 32px;
  letter-spacing: 8px;
  font-weight: bold;
`

const _Info = styled.p`
  color: var(--secondary);
  font-size: 14px;
  font-weight: 600;
`;

const _ShareCard = styled.div`
  background: var(--secondary-background);
  border-radius: 8px;
  padding: 12px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const _ShareContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: space-between;
  width: 100%;
`

const _ShareLINEButton = styled.button`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  background-color: #02C402;
  padding: 8px;
  border-radius: 999px;
  width: 100%;
`

const _ShareInstagramButton = styled.button`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1.5px solid #D300C5;
  background: linear-gradient(90deg, #FFD600 0%, #FF7A00 25%, #FF0069 50%, #D300C5 75%, #7638FA 100%);
  background-clip: text;
  color: transparent;
  font-weight: bold;
  padding: 8px;
  border-radius: 999px;
  width: 100%;
`

const _ShareBlueSkyButton = styled.button`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid #1185FE;
  padding: 8px;
  border-radius: 999px;
  width: 100%;
`

const _ShareImageButton = styled.button`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  background-color: #40CBE0;
  padding: 8px;
  border-radius: 999px;
  width: 100%;
  color: white;
  font-weight: bold;
`

const _ShareTwitterButton = styled.button`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  background-color: #000000;
  padding: 8px;
  border-radius: 999px;
  width: 100%;
  color: white;
  font-weight: bold;
`

const _ShareShareButton = styled.button`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 1px solid #000000;
  padding: 8px;
  border-radius: 999px;
  width: 100%;
  color: black;
  font-weight: bold;
`

export const Code = () => {
  const [code, setCode] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState<number | null>(null)
  const [consumedCount, setConsumedCount] = useState<number | null>(null)

  // scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    (async () => {
      const res = await CaloriAI.callAPI({
        endpoint: "http://api.caloriai.com/campaign/invitation-2024",
      })
      if (res.type !== "succeeded") {
        return
      }
      const bodyJSON = JSON.parse(res.body)
      const { code, totalCount, consumedCount } = bodyJSON;
      setCode(code)
      setTotalCount(totalCount)
      setConsumedCount(consumedCount)
    })()
  }, [])

  const createText = (code: string) => {
    return `AIが高精度にカロリー管理をしてくれるアプリ、カロリAIを使ってみて！\n\n「${code}」のコードで2週間無料！`
  }


  const copyCode = () => {
    if (code == null) {
      CaloriAI.showToast({ title: "コードを取得中です...", preset: "error" })
      return;
    }
    const text = code
    const el = document.createElement("textarea")
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand("copy")
    document.body.removeChild(el)
    CaloriAI.showToast({
      title: "招待をコピーしました",
      preset: "done"
    })
  }

  const shareOnTwitter = async () => {
    if (code == null) {
      CaloriAI.showToast({ title: "コードを取得中です...", preset: "error" })
      return;
    }
    
    const text = createText(code)
    const urlEncodedText = encodeURIComponent(text)
    CaloriAI.openOSBrowser(`https://twitter.com/intent/tweet?text=HAUGE&url=${urlEncodedText}`)
  }

  const shareOnInstagram = async () => {
    if (code == null) {
      CaloriAI.showToast({ title: "コードを取得中です...", preset: "error" })
      return;
    }
    
    const base64 = await CaloriAI.elementToImageBase64(captureRef.current!)
    CaloriAI.shareOnInstagramStory({ 
      background: {
        type: "image",
        content: base64,
      }
    })
  }

  const shareOnLine = async () => {
    if (code == null) {
      CaloriAI.showToast({ title: "コードを取得中です...", preset: "error" })
      return;
    }
    
    const text = createText(code)
    const urlEncodedText = encodeURIComponent(text)
    CaloriAI.openOSBrowser(`https://line.me/R/msg/text/?${urlEncodedText}`)
  }
  
  const shareOnBlueSky = async () => {
    if (code == null) {
      CaloriAI.showToast({ title: "コードを取得中です...", preset: "error" })
      return;
    }
    
    const text = createText(code)
    const urlEncodedText = encodeURIComponent(text)
    CaloriAI.openOSBrowser(`https://bsky.app/intent/compose?text=${urlEncodedText}`)
  }

  const share = async () => {
    if (code == null) {
      CaloriAI.showToast({ title: "コードを取得中です...", preset: "error" })
      return;
    }
    
    const base64 = await CaloriAI.elementToImageBase64(captureRef.current!)
    const text = createText(code)
    const rectOfButton = shareButtonRef.current!.getBoundingClientRect()
    CaloriAI.share({ rect: rectOfButton, text: text, image: base64 })
  }

  const saveImage = async () => {
    const base64 = await CaloriAI.elementToImageBase64(captureRef.current!)
    CaloriAI.saveImage({ image: base64 })
  }

  const captureRef = useRef<HTMLDivElement>(null)
  const shareButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <_Page>
      {/* 撮影用のコード（非表示） */}
      <_ContainerForCapture ref={captureRef} style={{ position: "absolute", top: "-9999px", left: "-9999px", width: "390px", height: "352px", }} >
        <_ContainerImageForCapture
          src="/invitation2024/share_background.png"
        />
        <_CodeContainerForImage>
        {code}
        </_CodeContainerForImage>
      </_ContainerForCapture>

      <ConfettiCard>
        <HeaderLogo/>
        <_CodeContainer onClick={copyCode}>{code ?? "コードを取得中です..."}</_CodeContainer>
        <_Info>
          {
            (totalCount != null && consumedCount != null) && (
              `あと${totalCount - consumedCount}回の招待が可能です`
            ) || "コードを取得中です..."
          }
        </_Info>
        <ProminentButton onClick={copyCode}>
        招待をコピー
        </ProminentButton>

        <Spacer/>

        <_ShareCard>
          <h4>コードを共有</h4>
          
          <_ShareTwitterButton onClick={shareOnTwitter}>
            <img src="/twitter.png" height={24}/>ポストする
          </_ShareTwitterButton>

          {
            CaloriAI.canUseShareOnInstagramStory() && (
              <_ShareInstagramButton onClick={shareOnInstagram}>
                <img src="/instagram.png" height={24}/>ストーリーにシェア
              </_ShareInstagramButton>
            )
          }

          <_ShareContainer>
            <_ShareLINEButton onClick={shareOnLine}>
              <img src="/line.png" height={24}/>
            </_ShareLINEButton>

            <_ShareBlueSkyButton onClick={shareOnBlueSky}>
              <img src="/bluesky.png" height={24}/>
            </_ShareBlueSkyButton>
          </_ShareContainer>

          <_ShareContainer>
            <_ShareImageButton onClick={saveImage}>
              <img src="/image.png" height={24}/> 画像を保存
            </_ShareImageButton>

            <_ShareShareButton onClick={share} ref={shareButtonRef}>
                <img src="/share.png" height={24}/>画像ごと共有
            </_ShareShareButton>
          </_ShareContainer>
        </_ShareCard>
      </ConfettiCard>
    </_Page>
  ) 
}