import React from "react"
import styles from "../styles/Checkdrop.module.css"

export default class Checkdrop extends React.Component {
  constructor(props) {
    super(props)
    this.updateEnabled = this.updateEnabled.bind(this)
    this.updateChosen = this.updateChosen.bind(this)
  }

  render() {
    const options = this.props.options.map((option, index) => (
      <option
        key={index}
        value={option}
        selected={option === this.props.chosen}
      >{option}</option>
    ))
    return (
      <div className={styles.checkdrop}>
        <input
          id={this.props.id}
          type="checkbox"
          checked={this.props.enabled}
          onChange={this.updateEnabled}
        />
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <select onChange={this.updateChosen} disabled={!this.props.enabled}>
          {options}
        </select>
      </div>
    )
  }

  updateEnabled(event) {
    this.props.onChange(
      this.props.id,
      event.target.checked,
      this.props.chosen,
    )
  }

  updateChosen(event) {
    this.props.onChange(
      this.props.id,
      this.props.enabled,
      event.target.value,
    )
  }
}
