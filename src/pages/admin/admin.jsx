import React, {Component} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {Row, Col} from 'antd'

import MemoryUtils from '../../utils/MemoryUtils'
import LeftNav from '../../components/left-nav/left-nav'
import Header from '../../components/header/header'
import Footer from '../../components/footer/footer'
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
      <Row className='container'>
        <Col span={4}>
          <LeftNav></LeftNav>
        </Col>
        <Col span={20} className='main'>
          <Header/>
          <div className='content'>

          </div>
          <Footer/>
        </Col>
      </Row>
    )
  }
}