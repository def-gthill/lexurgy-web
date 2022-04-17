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

class QueryResult {
  constructor(query) {
    this.query = query
  }

  map(f) {
    return new QueryResult(async () => {
      const result = await this.query()
      if (result.error) {
        return result
      } else {
        return {
          data: f(result.data),
          error: result.error
        }
      }
    })
  }

  flatMap(f) {
    return new QueryResult(async () => {
      const result = await this.query()
      if (result.error) {
        return result
      } else {
        return await f(result.data).query()
      }
    })
  }

  static always(data) {
    return new QueryResult(() =>
      ({data: data, error: null})
    )
  }

  async unpack() {
    const result = await this.query()
    if (result.error) {
      return notFound
    } else {
      return result.data
    }
  }
}

export async function getServerSideProps(context) {
  // noinspection JSUnresolvedVariable
  const workspaceName = context.params.exampleSet
  const initialProps = {
    exampleSet: workspaceName
  }

  const props = getWorkspaceId(workspaceName).flatMap(workspaceId =>
    propsFromWorkspaceId(workspaceId).map(workspaceProps =>
      ({...initialProps, ...workspaceProps})
    ).flatMap(props => {
      if (context.query.changes && context.query.input) {
        return propsFromChangesAndInput(
          workspaceId,
          context.query.changes,
          context.query.input,
        ).map(historyProps =>
          ({...props, ...historyProps})
        )
      } else if (context.query.historyId) {
        return propsFromHistory(
          workspaceId,
          context.query.historyId,
        ).map(historyProps =>
          ({...props, ...historyProps})
        )
      } else {
        return QueryResult.always(props)
      }
    })
  )

  return props.map(props =>
    ({props: props})
  ).unpack()
}

function getWorkspaceId(workspaceName) {
  return new QueryResult(async () =>
    await supabase
      .from("workspaces")
      .select("id")
      .eq("name", workspaceName)
      .single()
  ).map(data => data.id)
}

function propsFromWorkspaceId(workspaceId) {
  return new QueryResult(async () =>
    await supabase
      .from("histories")
      .select("*, changes (local_number, name), input_id (local_number)")
      .eq("workspace_id", workspaceId)
  ).map(data => ({
      examples: data.map(row => ({
          name: row.name || row.changes.name,
          changesId: row.changes.local_number,
          inputId: row.input_id.local_number,
        })
      )
    })
  )
}

function propsFromChangesAndInput(workspaceId, changesId, inputId) {
  return getChanges(workspaceId, changesId).flatMap(changes =>
    getInput(workspaceId, inputId).map(input => ({
        changesId: changesId,
        changes: changes,
        inputId: inputId,
        input: input,
      })
    )
  )
}

function getChanges(workspaceId, changesId) {
  return new QueryResult(async () =>
    await supabase
      .from("changes")
      .select("rules")
      .eq("workspace_id", workspaceId)
      .eq("local_number", changesId)
      .single()
  ).map(data => data.rules)
}

function getInput(workspaceId, inputId) {
  return new QueryResult(async () =>
    await supabase
      .from("wordlists")
      .select("words")
      .eq("workspace_id", workspaceId)
      .eq("local_number", inputId)
      .single()
  ).map(data => data.words)
}

async function propsFromHistory(workspaceId, historyId) {
  return Object()
}
