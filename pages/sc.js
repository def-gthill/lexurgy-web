import Frame from "../components/frame"
import SC from "../components/sc"
import {useRouter} from "next/router";
import {decode} from "js-base64";
import axios from "axios";

export default function HomeSC({ version }) {
  const router = useRouter()
  if (router.isReady) {
    const changes = router.query.changes
    const input = router.query.input

    if (changes || input) {
      const decodedInput = input ? decode(input) : undefined
      const decodedChanges = changes ? decode(changes) : undefined

      return (
        <Frame key={input + changes} version={version}>
          <SC
            input={decodedInput}
            changes={decodedChanges}
          />
        </Frame>
      )
    } else {
      return (
        <Frame key="" version={version}>
          <SC/>
        </Frame>
      )
    }
  } else {
    return (
      <Frame key="" version={version}>
        <SC/>
      </Frame>
    )
  }
}

export async function getServerSideProps() {
  const response = await axios.get(
    `${process.env.LEXURGY_SERVICES_URL}/version`
  )
  return { props: { version: response.data } }
}
