import path from "path";
import { promises as fs } from "fs";
import React from "react";
import Link from "next/link";
import SC from "../../components/sc";
import Frame from "../../components/frame"
import styles from "../../styles/ExampleSC.module.css"
import {supabase} from "../../utils/supabaseClient";

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
      <option key={index} value={index}>{option.name}</option>
    ))
    const selectedChangesId = examples[this.state.selectedChanges].changesId
    const selectedInputId = examples[this.state.selectedChanges].inputId
    const exampleLink = `/${this.props.exampleSet}/sc?changes=${selectedChangesId}&input=${selectedInputId}`
    return (
      <Frame>
        <div className={styles.exampleNav}>
          <label htmlFor="lscs">Example Sound Changes</label>
          <div className={styles.exampleMenu}>
            <select
              id="lscs"
              size={3}
              value={this.state.selectedChanges}
              onChange={this.handleExampleSelect}
            >
              {options}
            </select>
            <Link href={exampleLink}>
              <a className="button">Open</a>
            </Link>
          </div>
        </div>
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
  const workspaceName = context.params.exampleSet
  const props = {
    exampleSet: workspaceName
  }

  const workspaceId = await getWorkspaceId(workspaceName)
  Object.assign(
    props,
    await propsFromWorkspaceId(workspaceId)
  )

  if (context.query.changes && context.query.input) {
    Object.assign(
      props,
      await propsFromChangesAndInput(
        workspaceId,
        context.query.changes,
        context.query.input,
      )
    )
  } else if (context.query.historyId) {
    Object.assign(
      props,
      await propsFromHistory(
        workspaceId,
        context.query.historyId,
      )
    )
  }

  return {
    props: props
  }
}

async function getWorkspaceId(workspaceName) {
  let { data, error, status } = await supabase
    .from("workspaces")
    .select("id")
    .eq("name", workspaceName)
    .single()

  return data.id
}

async function propsFromWorkspaceId(workspaceId) {
  let { data, error, status } = await supabase
    .from("histories")
    .select("*, changes (name)")
    .eq("workspace_id", workspaceId)

  return {
    examples: data.map(row => ({
        name: row.name || row.changes.name,
        changesId: row.changes_id,
        inputId: row.input_id,
      })
    )
  }
}

async function propsFromChangesAndInput(workspaceId, changesId, inputId) {
  return {
    changesId: changesId,
    changes: await getChanges(workspaceId, changesId),
    inputId: inputId,
    input: await getInput(workspaceId, inputId),
  }
}

async function getChanges(workspaceId, changesId) {
  let {data, error, status} = await supabase
    .from("changes")
    .select("rules")
    .eq("workspace_id", workspaceId)
    .eq("local_number", changesId)
    .single()

  return data.rules
}

async function getInput(workspaceId, inputId) {
  let {data, error, status} = await supabase
    .from("wordlists")
    .select("words")
    .eq("workspace_id", workspaceId)
    .eq("local_number", inputId)
    .single()

  return data.words
}

async function propsFromHistory(workspaceId, historyId) {
  return Object()
}
