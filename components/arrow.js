import React from "react";
import styles from '../styles/Home.module.css'

export default class Arrow extends React.Component {
  render() {
    return (
      <div className={styles.arrowContainer}>
        <div className={styles.arrow}>&gt;&gt;</div>
      </div>
    )
  }
}