import styled from "styled-components"
import { ConfettiCard } from "../components/ConfettiCard"
import { FixedFooter } from "../components/FixedFooter"
import { ProminentButton } from "../components/ProminentButton"
import { Paragraph } from "../components/Paragraph"
import { Spacer } from "../components/Spacer"
import { Link, useNavigate } from "react-router-dom"
import * as CaloriAI from "../caloriai_connector"
import { useState } from "react"
import { HeaderLogo } from "./components/HeaderLogo"

const _Page = styled.div`
  background: var(--accent);
  padding: 8px;
  position: relative;
  padding-bottom: calc(46px + 16px * 2 + 8px);
`
const _CampaignLogo = styled.div`
  background-image: url('/invitation2024/campaign_logo.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  height: 140px;
  width: 100%;
`

const _CampaignDuration = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: var(--accent);
  text-align: center;
  border-radius: 999px;
  background: white;
  padding: 4px 18px;
  border: 2px solid var(--accent);
`

const _CampaignNotation = styled.div`
  font-size: 16px;
  font-weight: bold;
  background: var(--accent);
  text-align: center;
  border-radius: 999px;
  padding: 4px 18px;
  color: white;
`

export const Home = () => {
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)

  const onClickRegister = async () => {
    setIsProcessing(true)
    try {
      await CaloriAI.callAPI({
        endpoint: "http://api.caloriai.com/campaign/invitation-2024",
        method: "POST",
      })
  
      CaloriAI.showToast({
        title: "キャンペーンコードを発行しました",
        preset: "done"
      })
  
      await navigate("/invitation2024/code")
    } catch {
      CaloriAI.showToast({
        title: "エラーが発生しました",
        preset: "error",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  
  return (
    <_Page>
      <ConfettiCard>
        <HeaderLogo/>
        <_CampaignLogo />
        
        <_CampaignDuration>開催期間：11/17 (日)〜12/17 (水)</_CampaignDuration>
        
        <Spacer />

        <h3>招待コードを配った人</h3>
        <Paragraph>最大6週間までの無料期間を獲得！</Paragraph>

        <img src="/invitation2024/info_1.png" alt="" />

        <h3>招待コードをもらった人</h3>
        <Paragraph>コードを入力すれば2週間の無料期間の追加！</Paragraph>
        <_CampaignNotation>コードの入力は12/12 23:59まで有効です</_CampaignNotation>

        <Spacer />

        <Paragraph>
        キャンペーンの詳細は<Link style={{ color: "var(--accent)" }} to="/invitation2024/termsofservice
">こちら</Link>のページから参照してください。キャンペーンに応募した場合この規約に同意したものとみなします。
        </Paragraph>        

      </ConfettiCard>
      
      <FixedFooter>
          <ProminentButton onClick={onClickRegister} disabled={isProcessing}>
            キャンペーンに登録
          </ProminentButton>
      </FixedFooter>
    </_Page>
  )
}
