/* eslint-disable react/destructuring-assignment */
import styles from '@styles/clui.module.css'
import classnames from 'classnames'
import React from 'react'

const Icon = {
  ERROR: '!',
  CHECKMARK: '✔',
  CARET: '❯'
}

type IconProps = {
  icon?: keyof typeof Icon
}

const PromptIcon: React.FC<IconProps> = (props: IconProps) => (
  <div className={classnames(styles.icon, props)}>
    <span style={{ lineHeight: 'unset' }}>{Icon[props.icon || 'CARET']} </span>
  </div>
)

export default PromptIcon
