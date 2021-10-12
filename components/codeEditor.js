import React from "react";
import styles from '../styles/Editor.module.css'

export default class Editor extends React.Component {
  static defaultProps = {
    editable: true,
    wrap: false,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.promptForFile = this.promptForFile.bind(this)
    this.loadRef = React.createRef();
    this.save = this.save.bind(this)

    this.lineNumber = null;
  }

  render() {
    return (
      <div className={`${styles.editor} ${this.props.styles}`}>
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <span
            className={styles.lineNumber}
            id={`${this.props.id}_line`}
        >
          Line 1
        </span>
        <textarea
          id={this.props.id}
          value={this.props.value}
          onMouseDown={this.handleCaretMove.bind(this)}
          onMouseUp={this.handleCaretMove.bind(this)}
          onKeyDown={this.handleCaretMove.bind(this)}
          onKeyUp={this.handleCaretMove.bind(this)}
          onChange={this.handleChange.bind(this)}
          readOnly={!this.props.editable}
          cols={1}
          spellCheck={false}
          style={this.props.wrap ? {whiteSpace: "normal"} : {}}
        />
        <div className={styles.buttonContainer}>
          {this.props.children}
          {this.props.editable && <>
            <input
              className="button"
              type="file"
              accept={`text/*,.txt,${this.props.expectedFileType}`}
              ref={this.loadRef}
              style={{display: "none"}}
              onInput={this.load.bind(this, this.props.id)}
            />
            <button className="button" onClick={this.promptForFile}>Load</button>
          </>}
          <button className="button" onClick={this.save}>Save</button>
        </div>
      </div>
    )
  }

  handleCaretMove(event) {
    const textarea = event.currentTarget
    const textBeforeCaret = textarea.value.slice(0, textarea.selectionStart);
    const lineBreaksBeforeCaret = textBeforeCaret.match(/\r?\n/gu)?.length ?? 0;

    if (!this.lineNumber) {
      this.lineNumber = document.getElementById(`${this.props.id}_line`)
    }

    this.lineNumber.innerHTML = `Line ${lineBreaksBeforeCaret + 1}`;
  }

  handleChange(event) {
    this.props.updateValue(event.target.id, event.target.value)
  }

  promptForFile() {
    this.loadRef.current.click()
  }

  async load(id, event) {
    const selectedFiles = event.target.files
    if (selectedFiles.length > 0) {
      this.props.updateValue(id, await event.target.files[0].text())
    }
  }

  save() {
    const a = document.createElement('a')
    const file = new Blob([this.props.value], {type: 'text/plain'})

    a.href = URL.createObjectURL(file)
    a.download = "lexurgy" + this.props.expectedFileType
    a.click()

    URL.revokeObjectURL(a.href)
  }
}
