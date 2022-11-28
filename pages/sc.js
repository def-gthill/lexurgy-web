import Frame from "../components/frame"
import SC from "../components/sc"
import {useRouter} from "next/router";
import {decode} from "js-base64";

export default function HomeSC() {
  const router = useRouter()
  if (router.isReady) {
    const changes = router.query.changes
    const input = router.query.input

    if (changes || input) {
      const decodedInput = input ? decode(input) : undefined
      const decodedChanges = changes ? decode(changes) : undefined

      return (
        <Frame key={input + changes}>
          <SC
            input={decodedInput}
            changes={decodedChanges}
          />
        </Frame>
      )
    } else {
      return (
        <Frame key="">
          <SC/>
        </Frame>
      )
    }
  } else {
    return (
      <Frame key="">
        <SC/>
      </Frame>
    )
  }
}
