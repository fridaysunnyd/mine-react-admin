import React from 'react'
import {Menu, Icon} from 'antd'
import {NavLink, withRouter} from 'react-router-dom'

import './left-nav.less'
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'

const SubMenu = Menu.SubMenu
const Item = Menu.Item

class LeftNav extends React.Component {

  //数组变标签数组
  getNodes = (list) =>{
    return list.reduce((pre,item) =>{
      if(item.children){
        const subMenu = (
          <SubMenu key={item.path} title={<span><Icon type={item.icon} /><span>{item.title}</span></span>}>
            {
              this.getNodes(item.children)
            }
          </SubMenu>
        )
        pre.push(subMenu)
      }else {
        const menuItem = (
          <Item key={item.key}>
            <NavLink to={item.key}>
              <Icon type={item.icon}/> {item.title}
            </NavLink>
          </Item>
        )
        pre.push(menuItem)
      }
      return pre
    },[])
  }

  componentWillMount() {
    this.menuNodes = this.getNodes(menuList)
  }

  render() {
    const path = this.props.location.pathname
    return (
      <div className="left-nav">
        <div className="logo">
          <img src={logo} alt="logo"/>
          <h1>硅谷后台</h1>
        </div>
        <Menu mode="inline" theme='dark' defaultSelectedKeys={[path]}>
          {
            this.menuNodes
          }
        </Menu>
      </div>
    )
  }
}
export default withRouter(LeftNav)