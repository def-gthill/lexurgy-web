import React from "react";
import styles from '../styles/Editor.module.css'

export default class Editor extends React.Component {
  static defaultProps = {
    editable: true,
    wrap: false,
  };

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
          <button className="button">Load</button>
          <button className="button">Save</button>
        </div>
      </div>
    )
  }
}
