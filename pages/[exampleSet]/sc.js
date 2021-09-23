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
    const examples = [
      {
        name: "Basican",
        changesId: 1,
        inputId: 1,
      },
      {
        name: "Intermediatese",
        changesId: 2,
        inputId: 1,
      },
      {
        name: "Advancedish",
        changesId: 3,
        inputId: 1,
      },
      {
        name: "Syllabian",
        changesId: 4,
        inputId: 2,
      },
      {
        name: "Adding Machine",
        changesId: 5,
        inputId: 3,
      },
    ]
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
        <Link href={`/examples/sc?changes=${selectedChangesId}&input=${selectedInputId}`}>
          <a className="button">Open</a>
        </Link>
        <SC
          input={this.props.input}
          changes={this.props.changes}
          key={["examples", this.props.inputId, this.props.changesId]}
        />
      </Frame>
    )
  }

  handleExampleSelect(event) {
    this.setState({selectedChanges: event.target.value})
  }
}

export async function getServerSideProps(context) {
  // noinspection JSUnresolvedVariable
  const exampleSet = context.params.exampleSet
  const exampleDirectory = path.join(
    process.cwd(),
    "files",
    exampleSet,
  )

  if (!context.query.changes && !context.query.input) {
    return { props: {} }
  }

  const files = await getFiles(
    exampleDirectory,
    parseInt(context.query.changes),
    parseInt(context.query.input),
  ).catch(() => {})
  if (!files) {
    return {
      notFound: true
    }
  }

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
      changesId: context.query.changes,
      changes: changes,
      inputId: context.query.input,
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
  // noinspection JSUnresolvedVariable
  const input = exampleJson.wordlists.find((x) => x.id === inputId)
  return {
    changes: changes.file,
    input: input.file,
  }
}
