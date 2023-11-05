import React from "react";
import styles from "../styles/SC.module.css"
import Editor from "../components/editor"
import Arrow from "../components/arrow"
import Checkdrop from "./checkdrop";
import copy from "copy-to-clipboard";
import {encode} from "js-base64";
import axios, {HttpStatusCode, isAxiosError} from "axios";

export default class SC extends React.Component {
  static defaultProps = {
    input: "",
    changes: "",
  }

  constructor(props) {
    super(props);
    this.gridRef = React.createRef()
    this.controlsRef = React.createRef()
    this.state = {
      input: props.input,
      changes: props.changes,
      changesCollapsed: false,
      running: false,
      runStatus: "Running...",
      runResult: {
        input: null,
        stages: null,
        error: null,
        traceOutput: null,
      },
      cachedResult: {},
      outputInputs: true,
      outputArrows: true,
      startAt: new CheckdropState(),
      stopBefore: new CheckdropState(),
      trace: new CheckdropState(),
    }
    this.avoidControlOverlap = this.avoidControlOverlap.bind(this)
    this.updateEditorWith = this.updateEditorWith.bind(this)
    this.collapseChanges = this.collapseChanges.bind(this)
    this.expandChanges = this.expandChanges.bind(this)
    this.share = this.share.bind(this)
    this.setOutputInputs = this.setOutputInputs.bind(this)
    this.setOutputArrows = this.setOutputArrows.bind(this)
    this.runLexurgy = this.runLexurgy.bind(this)
    this.updateCheckdrop = this.updateCheckdrop.bind(this)
  }

  componentDidMount() {
    this.avoidControlOverlap()
    window.addEventListener("resize", this.avoidControlOverlap)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.avoidControlOverlap)
  }

  avoidControlOverlap() {
    const controls = this.controlsRef.current
    const height = controls.offsetHeight
    const grid = this.gridRef.current
    grid.style.marginBottom = `${height + 50}px`
  }

  render() {
    const changesContainerStyle =
      this.state.changesCollapsed ? styles.changesContainerCollapsed :
        styles.changesContainer

    const collapseChangesText =
      this.state.changesCollapsed ? "Expand >>" : "<< Collapse"

    const collapseChangesCallback =
      this.state.changesCollapsed ? this.expandChanges : this.collapseChanges

    return (
      <div className={styles.main}>
        <div className={styles.grid} ref={this.gridRef}>
          <Editor
            id="input"
            label="Input Words"
            value={this.state.input}
            updateValue={this.updateEditorWith}
            expectedFileType=".wli"
            styles={`${styles.stackedEditor} ${styles.inputContainer}`}
          />
          <Arrow/>
          <Editor
            id="changes"
            label="Sound Changes"
            value={this.state.changes}
            updateValue={this.updateEditorWith}
            expectedFileType=".lsc"
            styles={`${styles.stackedEditor} ${changesContainerStyle}`}
            showLineNumbers
          >
            <button
              className={`button ${styles.collapseButton}`}
              onClick={collapseChangesCallback}
            >
              {collapseChangesText}
            </button>
            <button className="button" onClick={this.share}>Share</button>
          </Editor>
          <Arrow/>
          <Editor
            id="output"
            label="Output"
            value={this.output(this.state)}
            updateValue={this.updateEditorWith}
            expectedFileType={this.state.outputArrows ? ".wlm" : ".wli"}
            editable={false}
            wrap={this.state.runResult.error}
            styles={`${styles.stackedEditor} ${styles.outputContainer}`}
          >
            <div className={styles.showStages}>
              <span className={styles.showStagesLabel}>Show:</span>
              <input
                id="showInputs"
                type="checkbox"
                checked={this.state.outputInputs}
                onChange={this.setOutputInputs}
              />
              <label htmlFor="showInputs">Inputs</label>
              <input
                id="showStages"
                type="checkbox"
                checked={this.state.outputArrows}
                onChange={this.setOutputArrows}
              />
              <label htmlFor="showStages">Stages</label>
            </div>
          </Editor>
        </div>
        <div className={styles.controls} ref={this.controlsRef}>
          <div>
            <Checkdrop
              id="startAt"
              label="Start At Rule"
              options={this.ruleNames(this.state)}
              enabled={this.state.startAt.enabled}
              chosen={this.state.startAt.chosen}
              onChange={this.updateCheckdrop}
            />
            <Checkdrop
              id="stopBefore"
              label="Stop Before Rule"
              options={this.ruleNames(this.state)}
              enabled={this.state.stopBefore.enabled}
              chosen={this.state.stopBefore.chosen}
              onChange={this.updateCheckdrop}
            />
            <Checkdrop
              id="trace"
              label="Trace Evolution"
              options={this.inputWords(this.state)}
              enabled={this.state.trace.enabled}
              chosen={this.state.trace.chosen}
              onChange={this.updateCheckdrop}
            />
          </div>
          <button
            className="button big-button"
            onClick={this.runLexurgy}
            disabled={this.state.running}
          >Apply</button>
        </div>
      </div>
    )
  }

  updateEditorWith(id, newValue) {
    this.setState({[id]: newValue})
    this.setState((state) => this.updateAllCheckdrops(state))
    if (id === "changes") {
      this.setState({cachedResult: {}})
    }
  }

  collapseChanges() {
    this.setState({changesCollapsed: true})
  }

  expandChanges() {
    this.setState({changesCollapsed: false})
  }

  share() {
    const inputEncoded = encode(this.state.input, true)
    const changesEncoded = encode(this.state.changes, true)
    const url = `www.lexurgy.com/sc?changes=${changesEncoded}&input=${inputEncoded}`
    copy(url)
    alert("Link copied to clipboard!")
  }

  setOutputInputs(event) {
    this.setState({outputInputs: event.target.checked})
  }

  setOutputArrows(event) {
    this.setState({outputArrows: event.target.checked})
  }

  async runLexurgy() {
    const inputWords = this.activeInputWords(this.state)
    try {
      this.setState({
        running: true,
        runStatus: "Running...", 
        runResult: {
          input: null,
          stages: null,
          error: null,
          traceOutput: null,
        },
      });
      const { result, traceOutput, ruleFailures } = await this.runSoundChanger(this.state);
      if (ruleFailures) {
        const firstFailure = ruleFailures[0];
        this.setState(
          {
            runResult: {
              input: inputWords,
              stages: null,
              error: this.makeErrorMessageForRuleFailure(firstFailure),
              traceOutput: null,
            }
          }
        )
        return;
      }
      const stages = result.map((stage) => stage.words)
      const newState = {
        runResult: {
          input: inputWords,
          stages: stages,
          error: null,
          traceOutput: traceOutput,
        }
      }
      if (this.isNormalRun(this.state)) {
        const resultsToCache = Object.fromEntries(
          inputWords.map(
            (word, i) => [
              word,
              stages.map(stage => stage[i])
            ]
          )
        )
        newState.cachedResult = {
          ...this.state.cachedResult,
          ...resultsToCache,
        }
      }
      this.setState(newState)
    } catch (e) {
      if (isAxiosError(e)) {
        this.setState(
          {
            runResult: {
              input: inputWords,
              stages: null,
              error: this.makeErrorMessage(e.response.data),
              traceOutput: null,
            }
          }
        )
      } else {
        throw e;
      }
    } finally {
      this.setState({ running: false })
    }
  }

  isNormalRun(state) {
    return !(
      state.startAt.enabledAndChosen ||
      state.stopBefore.enabledAndChosen ||
      state.trace.enabledAndChosen
    )
  }

  makeErrorMessage(err) {
    if (err.result) {
      return this.makeErrorMessage(err.result);
    }
    switch (err.type) {
      case "parseError":
        return `${err.message} (line ${err.lineNumber})`
      case "invalidExpression":
        return `Error in expression ${err.expressionNumber} ("${err.expression}") `
          + `of rule "${err.rule}"\n\n${err.message}`
      default:
        return err.message
    }
  }

  makeErrorMessageForRuleFailure(failure) {
    if (failure.rule) {
      return `Rule "${failure.rule}" could not be applied to word `
        + `"${failure.currentWord}" (originally "${failure.originalWord}")\n\n${failure.message}`
    } else {
      return failure.message;
    }
  }

  updateCheckdrop(id, enabled, chosen) {
    this.setState({[id]: new CheckdropState(enabled, chosen)})
  }

  updateAllCheckdrops(state) {
    return {
      startAt: state.startAt.check(this.ruleNames(state)),
      stopBefore: state.stopBefore.check(this.ruleNames(state)),
      trace: state.trace.check(this.inputWords(state)),
    }
  }

  inputWords(state) {
    return state.input.split(/\r?\n/)
  }

  activeInputWords(state) {
    return state.trace.enabledAndChosen ?
      [state.trace.chosen] : this.inputWords(state)
  }

  ruleNames(state) {
    const lines = state.changes.split(/\r?\n/).map(
      (line) => line.trim()
    )
    const ruleNameLines = lines.filter((line) =>
      line.endsWith(":") &&
      !(startsWithAnyOf(
        line.toLowerCase(),
        ["syllables", "deromanizer", "romanizer", "then", "else"]
      ))
    )
    return ruleNameLines.map((line) => line.slice(0, -1).split(/\s+/)[0])
  }

  output(state) {
    const runResult = state.runResult
    if (state.running) {
      return state.runStatus;
    }
    if (runResult.error) {
      return runResult.error
    }
    if (!runResult.stages) {
      return ""
    }

    let inputWords = runResult.input
    let allStages = runResult.stages
    if (!state.outputArrows) {
      allStages = this.removeIntermediates(allStages)
    }
    if (state.outputInputs) {
      allStages = this.addInputs(allStages, inputWords)
    }
    if (state.outputArrows && !state.outputInputs && allStages.length > 1) {
      allStages = this.addLeadingArrows(allStages)
    }
    let output = this.stagesToString(allStages);
    if (runResult.traceOutput) {
      output += "\n" + runResult.traceOutput;
    }
    return output;
  }

  removeIntermediates(stages) {
    return [stages.at(-1)]
  }

  addInputs(stages, inputWords) {
    return [inputWords].concat(stages)
  }

  addLeadingArrows(stages) {
    return [Array(stages[0].length).fill("")].concat(stages)
  }

  stagesToString(stages) {
    const rows = this.stagesToRows(stages);
    const lines = this.joinAllRowsWithArrows(rows);
    return lines.join("\n") + "\n";
  }

  stagesToRows(stages) {
    return stages[0].map((_, i) => stages.map((stage) => stage[i]))
  }

  joinAllRowsWithArrows(rows) {
    if (rows.length === 0) {
      return [];
    }
    const padLengths = [];
    for (let i = 0; i < rows[0].length - 1; i++) {
      padLengths.push(Math.max(...rows.map((row) => row[i].length)));
    }
    return rows.map((row) => this.joinRowWithArrows(row, padLengths));
  }

  joinRowWithArrows(row, padLengths) {
    if (!row.at(-1)) {
      return ""
    }
    const arrow = " => ";
    const stringsToJoin = [];
    row.forEach((word, i) => {
      if (padLengths[i]) {
        stringsToJoin.push(
          this.padEndCompensatingForDiacritics(word, padLengths[i])
        );
      } else {
        stringsToJoin.push(word ?? "");
      }
    });
    return stringsToJoin.join(arrow);
  }

  padEndCompensatingForDiacritics(s, padLength) {
    const numberOfDiacritics = (s.match(/\p{Mn}/gu) ?? []).length;
    const padLengthCompensatingForDiacritics = padLength + numberOfDiacritics;
    return s.padEnd(padLengthCompensatingForDiacritics);
  }

  async runSoundChanger(state) {
    const allInputWords = this.activeInputWords(state)
    let inputWords = allInputWords
    if (this.isNormalRun(state)) {
      inputWords = inputWords.filter(word => !(word in state.cachedResult))
    }
    const request = {
      changes: state.changes,
      inputWords,
      traceWords: state.trace.enabledAndChosen ? [state.trace.chosen] : [],
      startAt: state.startAt.enabledAndChosen ? state.startAt.chosen : null,
      stopBefore: state.stopBefore.enabledAndChosen ? state.stopBefore.chosen : null,
      allowPolling: true,
    }
    const startTime = new Date();
    let response = await axios.post(
      "/api/services",
      request,
      {
        params: { endpoint: "scv1" }
      }
    )
    if (response.status === HttpStatusCode.Accepted) {
      response = await this.pollSoundChanger(response.data.url, startTime);
    }
    let result = [
      ...Object.entries(response.data.intermediateWords || {}).map(([name, words]) => ({ name, words })),
      { name: null, words: response.data.outputWords }
    ]
    if (this.isNormalRun(state)) {
      const allResults = result.map(stage => ({
        name: stage.name,
        words: [],
      }))
      let i = 0
      for (const word of allInputWords) {
        if (word in state.cachedResult) {
          allResults.forEach(
            (stage, j) => stage.words.push(state.cachedResult[word][j])
          )
        } else {
          allResults.forEach(
            (stage, j) => stage.words.push(result[j].words[i])
          )
          i++
        }
      }
      result = allResults
    }
    return {
      result: result,
      traceOutput: state.trace.enabledAndChosen ? (
        this.traceOutputAsString(response.data.traces) || "Word didn't change"
      ) : null,
      ruleFailures: response.data.errors
    }
  }

  pollSoundChanger(url, startTime) {
    return new Promise((resolve, reject) => {
      let status = "Running..."
      const timer = setInterval(
        async () => {
          try {
            const response = await axios.get("/api/services", {params: {endpoint: url}});
            const elapsedSeconds = Math.round((new Date().getTime() - startTime.getTime()) / 1000);
            status += `\nStill running... (${elapsedSeconds} seconds passed)`
            this.setState({runStatus: status})
            if (response.data.status === "done") {
              clearInterval(timer);
              resolve({data: response.data.result});
            }
          } catch (e) {
            clearInterval(timer);
            reject(e);
          }
        },
        2500,
      )
    })
  }

  traceOutputAsString(traces) {
    const [word, steps] = [...Object.entries(traces)][0]
    let previousWord = word;
    const lines = []
    for (const step of steps) {
      lines.push(`Applied ${step.rule}: ${previousWord} -> ${step.output}`)
      previousWord = step.output;
    }
    return lines.join("\n")
  }
}

class CheckdropState {
  constructor(enabled = false, chosen = null) {
    this.enabled = enabled
    this.chosen = chosen
    this.enabledAndChosen = enabled && chosen
  }

  check(options) {
    return new CheckdropState(
      this.enabled,
      options.includes(this.chosen) ? this.chosen : null
    )
  }
}

function startsWithAnyOf(string, possibleStarts) {
  return possibleStarts.some((start) => string.startsWith(start))
}
