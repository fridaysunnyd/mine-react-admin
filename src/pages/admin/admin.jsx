import React, {Component} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'

import MemoryUtils from '../../utils/MemoryUtils'
/*
后台管理主界面的路由组件
 */
export default class Admin extends Component {

  render() {
    // 检查用户是否已经登陆, 如果还没有, 自动跳转到登陆界面
    const user = MemoryUtils.user
    if(!user || !user._id) {
      // this.props.history.replace('/login')  // 用在事件回调函数中
      return <Redirect to='/login'/>
    }
    return (
      <div>
        Admin
      </div>
    )
  }
}