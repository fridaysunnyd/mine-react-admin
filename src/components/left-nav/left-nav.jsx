import React from 'react'

import './left-nav.less'
import logo from '../../assets/images/logo.png'

export default class LeftNav extends React.Component {

  render() {

    return (
      <div className="left-nav">
        <div className="logo">
          <img src={logo} alt="logo"/>
          <h1>硅谷后台</h1>
        </div>
      </div>
    )
  }
}
