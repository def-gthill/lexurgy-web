import React from "react";
import styles from '../styles/Home.module.css'

export default class Editor extends React.Component {
  static defaultProps = {
    editable: true,
  };

  render() {
    const containerStyle = styles[this.props.id + "Container"];
    return (
      <div className={styles.editor + ' ' + containerStyle}>
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <textarea
          id={this.props.id}
          value={this.props.value}
          onChange={this.props.handleChange}
          readOnly={!this.props.editable}
        />
      </div>
    )
  }
}
