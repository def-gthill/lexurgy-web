import path from "path";
import { promises as fs } from "fs";
import React from "react";
import SC from "../sc.js";

export default function ExampleSC(props) {
  return <SC input={props.input} changes={props.changes}/>
}

export async function getServerSideProps(context) {
  const exampleSet = context.params.exampleSet
  const exampleDirectory = path.join(
    process.cwd(),
    "files",
    exampleSet,
  )
  const files = await getFiles(
    exampleDirectory,
    parseInt(context.query.changes),
    parseInt(context.query.input),
  )

  const changes = await fs.readFile(
    path.join(exampleDirectory, files.changes),
    "utf8",
  )
  const input = await fs.readFile(
    path.join(exampleDirectory, files.input),
    "utf8",
  )

  return {
    props: {
      changes: changes,
      input: input,
    }
  }
}

async function getFiles(exampleDirectory, changesId, inputId) {
  const exampleContents = await fs.readFile(
    path.join(exampleDirectory, "sc.json"),
    "utf8",
  )
  const exampleJson = JSON.parse(exampleContents)
  const changes = exampleJson.changes.find((x) => x.id === changesId)
  const input = exampleJson.wordlists.find((x) => x.id === inputId)
  return {
    changes: changes.file,
    input: input.file,
  }
}
