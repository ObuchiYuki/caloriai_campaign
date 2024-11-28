import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import * as CaloriAI from "../caloriai_connector"

export const Check = () => {
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      const res = await CaloriAI.callAPI({
        endpoint: "http://api.caloriai.com/campaign/invitation-2024/has-code",
      })
      if (res.type !== "succeeded") {
        navigate("/invitation2024/home")
        return;
      }

      if (res.body === "true") {
        navigate("/invitation2024/code")
      } else {
        navigate("/invitation2024/home")
      }
    })();
  }, [navigate])

  return (
    <div>
    </div>
  )
}