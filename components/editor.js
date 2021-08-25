import React from "react";
import styles from '../styles/Home.module.css'

export default class Editor extends React.Component {
  render() {
    return (
      <div className={styles.editor}>
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <textarea id={this.props.id}/>
      </div>
    )
  }
}
