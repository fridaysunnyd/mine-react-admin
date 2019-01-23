import React from 'react'
import {Menu, Icon} from 'antd'
import {NavLink, withRouter} from 'react-router-dom'

import './left-nav.less'
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import MemoryUtils from '../../utils/MemoryUtils'

const SubMenu = Menu.SubMenu
const Item = Menu.Item

class LeftNav extends React.Component {

  hasAuth = (item) =>{
    const key = item.key
    const menuSet = this.menuSet
    /*
     1. 如果菜单项标识为公开
     2. 如果当前用户是admin
     3. 如果菜单项的key在用户的menus中
     */
    if(item.isPublic || MemoryUtils.user.username === 'admin' || menuSet.has(key)){
      return true
      // 如果有子节点, 需要判断有没有一个child的key在menus中
    } else if(item.children){
      return item.children.find(child => menuSet.has(child.key))
    }
  }

  //数组变标签数组
  getNodes = (list) =>{
    return list.reduce((pre,item) =>{
      if(this.hasAuth(item)) {
        if(item.children){
          const subMenu = (
            <SubMenu key={item.key} title={<span><Icon type={item.icon} /><span>{item.title}</span></span>}>
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
      }
      return pre
    },[])
  }

  componentWillMount() {
    this.menuSet = new Set(MemoryUtils.user.role.menus)
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