import React from "react";
import Link from "next/link";
import SC from "../../components/sc";
import Frame from "../../components/frame"
import styles from "../../styles/ExampleSC.module.css"
import axios from "axios";
import neo4j from "neo4j-driver";

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
      <Frame version={this.props.version}>
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

function getDriver() {
  return neo4j.driver(
    process.env.NEO4J_URL || "",
    neo4j.auth.basic(
      process.env.NEO4J_USERNAME || "",
      process.env.NEO4J_PASSWORD || ""
    ),
    { disableLosslessIntegers: true }
  );
}

const workspaces = {
  examples: [
    {
      name: "Basican",
      languageId: "b364843c-7436-471e-98d1-69f58f87253c",
      inputId: 1,
      changesId: 1,
    },
    {
      name: "Intermediatese",
      languageId: "3603f34a-3d31-43cf-927e-b2242a5ff940",
      inputId: 1,
      changesId: 2,
    },
    {
      name: "Advancedish",
      languageId: "f7833c73-dbca-4bb0-816a-2fa177ee1a14",
      inputId: 1,
      changesId: 3,
    },
    {
      name: "Syllabian",
      languageId: "d21af848-1327-4a64-8e97-888b82c871e0",
      inputId: 2,
      changesId: 4,
    },
    {
      name: "Adding Machine",
      languageId: "9583f437-aa8b-480d-8c53-85798944f4d2",
      inputId: 3,
      changesId: 5,
    }
  ],
  langtime: [
    {
      name: "Engála (Rabbits)",
      languageId: "6c9cd3d5-43c6-4edf-b802-4a7d3f2ce95d",
      inputId: 1,
      changesId: 1,
    },
    {
      name: "Tpaalha (Opposums)",
      languageId: "711bc727-69da-41dc-9aa4-dcb0d02f91f7",
      inputId: 2,
      changesId: 2,
    },
    {
      name: "Wokuthízhű (Mice)",
      languageId: "dbf60de9-2980-47ad-a1c7-6bfc057be7cd",
      inputId: 3,
      changesId: 3,
    },
    {
      name: "Sarkezhe (Cats)",
      languageId: "25beb458-5745-43f0-9f40-1f2bb9d47b3f",
      inputId: 4,
      changesId: 4,
    },
    {
      name: "Haughòf (Dogs)",
      languageId: "c399f32a-f3df-449d-8a98-7baf8ea8016b",
      inputId: 5,
      changesId: 5,
    }
  ],
}

export async function getServerSideProps(context) {
  // noinspection JSUnresolvedVariable
  const workspaceName = context.params.exampleSet

  const response = await axios.get(
    `${process.env.LEXURGY_SERVICES_URL}/version`
  )
  const version = response.data;

  const workspace = workspaces[workspaceName];

  const initialProps = {
    exampleSet: workspaceName,
    examples: workspace,
    version,
  }

  if (!context.query.changes) {
    return {props: initialProps};
  }

  const language = workspace.find(
    (lang) => (
      lang.inputId == context.query.input &&
      lang.changesId == context.query.changes
    )
  );

  const driver = getDriver();
  const session = driver.session();
  const query = "MATCH (ev:Evolution) -[:IS_IN]-> (lang:Language {id: $id}) RETURN ev;";
  const result = await session.run(query, {id: language.languageId});
  const record = result.records[0].get("ev").properties;
  const testWords = record["testWords"];
  const soundChanges = record["soundChanges"];

  return {props: {
    ...initialProps,
    input: testWords.join("\n"),
    changes: soundChanges,
    inputId: context.query.input,
    changesId: context.query.changes,
  }};
}
