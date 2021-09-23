import path from "path";
import { promises as fs } from "fs";
import React from "react";
import Link from "next/link";
import SC from "../../components/sc";
import Frame from "../../components/frame"

export default class ExampleSC extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedChanges: 0,
    }
    this.handleExampleSelect = this.handleExampleSelect.bind(this)
  }

  render() {
    const examples = this.props.examples
    const options = examples.map((option, index) => (
      <option
        key={index}
        value={index}
        selected={index === this.state.selectedChanges}
      >{option.name}</option>
    ))
    const selectedChangesId = examples[this.state.selectedChanges].changesId
    const selectedInputId = examples[this.state.selectedChanges].inputId
    return (
      <Frame>
        <label htmlFor="lscs">Sound Changes</label>
        <select id="lscs" size={3} onChange={this.handleExampleSelect}>
          {options}
        </select>
        <Link href={`/${this.props.exampleSet}/sc?changes=${selectedChangesId}&input=${selectedInputId}`}>
          <a className="button">Open</a>
        </Link>
        <SC
          input={this.props.input}
          changes={this.props.changes}
          key={[this.props.exampleSet, this.props.inputId, this.props.changesId]}
        />
      </Frame>
    )
  }

  handleExampleSelect(event) {
    this.setState({selectedChanges: event.target.value})
  }
}

const notFound = {
  notFound: true
}

export async function getServerSideProps(context) {
  // noinspection JSUnresolvedVariable
  const exampleSet = context.params.exampleSet
  const exampleDirectory = getExampleDirectory(exampleSet)

  // const exampleJson = await readExampleJson(exampleDirectory).catch(() => {})
  // if (!exampleJson) {
  //   return notFound
  // }
  //
  // const examples = exampleJsonToExamples(exampleJson)
  //
  // if (!context.query.changes && !context.query.input) {
  //   return {
  //     props: {
  //       exampleSet: exampleSet,
  //       examples: examples,
  //     }
  //   }
  // }
  //
  // const files = await getFiles(
  //   exampleJson,
  //   parseInt(context.query.changes),
  //   parseInt(context.query.input),
  // ).catch(() => {})
  // if (!files) {
  //   return notFound
  // }
  //
  // const changes = await readFromDirectory(exampleDirectory, files.changes)
  // const input = await readFromDirectory(exampleDirectory, files.input)

  return {
    props: {
      exampleSet: exampleSet,
      examples: [],
      changesId: context.query.changes,
      changes: exampleDirectory,
      inputId: context.query.input,
      input: exampleDirectory,
    }
  }
}

function getExampleDirectory(exampleSet) {
  return path.resolve(`./public/files/${exampleSet}`)
}

async function readExampleJson(exampleDirectory) {
  const exampleContents = await readFromDirectory(
    exampleDirectory,
    "sc.json"
  )
  return JSON.parse(exampleContents)
}

async function getFiles(exampleJson, changesId, inputId) {
  const changes = exampleJson.changes.find((x) => x.id === changesId)
  // noinspection JSUnresolvedVariable
  const input = exampleJson.wordlists.find((x) => x.id === inputId)
  return {
    changes: changes.file,
    input: input.file,
  }
}

async function readFromDirectory(directory, fname) {
  return await fs.readFile(path.join(directory, fname), "utf8")
}

function exampleJsonToExamples(exampleJson) {
  // noinspection JSUnresolvedVariable
  return exampleJson.changes.map((change) => ({
      name: change.name,
      changesId: change.id,
      inputId: change.inputs[0],
    })
  )
}
