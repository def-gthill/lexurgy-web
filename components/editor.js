import React from "react";
import styles from '../styles/Editor.module.css'

export default class Editor extends React.Component {
  static defaultProps = {
    editable: true,
    wrap: false,
  };

  constructor(props) {
    super(props);
    this.promptForFile = this.promptForFile.bind(this)
    this.load = this.load.bind(this)
  }

  render() {
    return (
      <div className={`${styles.editor} ${this.props.styles}`}>
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <textarea
          id={this.props.id}
          value={this.props.value}
          onChange={this.props.handleChange}
          readOnly={!this.props.editable}
          cols={1}
          style={this.props.wrap ? {whiteSpace: "normal"} : {}}
        />
        <div className={styles.buttonContainer}>
          <input type="file" accept="text/*,.txt,.wli" onInput={this.load} style={{display: "none"}}/>
          <button className="button" onClick={this.promptForFile}>Load</button>
          <button className="button">Save</button>
        </div>
      </div>
    )
  }

  promptForFile(event) {
    // noinspection JSUnresolvedFunction
    event.target.parentNode.firstChild.click()
  }

  async load(event) {
    this.props.updateValue(event, await event.target.files[0].text())
  }
}
