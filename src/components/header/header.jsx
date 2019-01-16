import React from 'react'
import {Row,Col,Modal} from 'antd'
import {withRouter} from 'react-router-dom'

import './header.less'
import memoryUtiles from '../../utils/MemoryUtils'
import storageUtils from '../../utils/storageUtils'
import menuList from '../../config/menuConfig'
import {formateDate} from '../../utils'
import {reqWeather} from '../../api'

 class Header extends React.Component {
    state = {
      sysTime:formateDate(Date.now()),
      dayPictureUrl:'',
      temperature:''
    }

     getMenuName = (path) => {
       let menuName
       menuList.forEach(menuItem => {
         if (menuItem.key === path){
           menuName = menuItem.title
         }else if(menuItem.children){
           menuItem.children.forEach(
             menuItem => {
               if (menuItem.key === path) {
                 menuName = menuItem.title
               }
             })
         }
       })
       return menuName || '首页'

     }
    logout = () => {
      Modal.confirm({
        content: '确定退出吗?',
        onOk: () => {
          storageUtils.removeUser()
          memoryUtiles.user = {}
          this.props.history.replace('/login')
        }
      })
    }
     getSysTime = () =>{
      this.intervalId = setInterval(() =>{
        this.setState({
          sysTime:formateDate(Date.now())
        })
      },1000)
     }
    getWeather = async() =>{
      const {dayPictureUrl, temperature} = await reqWeather('北京')
      this.setState({
        dayPictureUrl,
        temperature
      })
    }
    componentDidMount(){
      this.getSysTime()
      this.getWeather()
    }
    componentWillUnmount(){
      clearInterval(this.intervalId)
    }

  render() {
    const  {username} = memoryUtiles.user
    const path = this.props.location.pathname
    const menuName = this.getMenuName(path)
    const {sysTime,dayPictureUrl,temperature} = this.state
    return (
      <div className="header">
        <Row className="header-top">
          <Col span={24}>
            <span>欢迎，{username}</span>
            <a href="javascript:" onClick={this.logout}>退出</a>
          </Col>
        </Row>
        <Row className='breadcrumb'>
          <Col span={4} className='breadcrumb-title'>{menuName}</Col>
          <Col span={20} className='weather'>
            <span className='date'>{sysTime}</span>
            <span className='weather-img'>
              <img src={dayPictureUrl} alt="weather"/>
            </span>
            <span className='weather-detail'>{temperature}</span>
          </Col>
        </Row>
      </div>
    )
  }
}
export default withRouter(Header)