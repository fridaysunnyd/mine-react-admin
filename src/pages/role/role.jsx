import React, {PureComponent} from 'react'
import {
  Card,
  Button,
  Table,
  Form,
  Input,
  Modal,
  message,
  Tree
} from 'antd'

import {reqRoles,reqAddRole,reqUpdateRole} from '../../api'
import {formateDate} from '../../utils'
import menuList from '../../config/menuConfig'

const {Item} = Form
const { TreeNode } = Tree

/*
后台管理的角色管理路由组件
 */
export default class Role extends PureComponent {

  state = {
    roles:[],
    role:{},//当前行角色
    menus: [], // 当前角色的所有权限的数组
    isShowAdd: false, // 是否显示添加角色的Modal
    isShowRoleAuth: false, // 是否显示设置角色权限的Modal
  }

  getRoles = async () =>{
    const result = await reqRoles()
    if(result.status === 0){
      const roles = result.data
      this.setState({
        roles
      })
    }
  }
  initColumns = () =>{
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        // render: (create_time) => formateDate(create_time)
        render: formateDate
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: formateDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
      }
    ]
  }
  onRow = (role) => {
    return {
      onClick: (event) => {
        this.setState({
          role,
          menus:role.menus
        })
      },       // 点击行

    };
  }
  showAddRole = () =>{
    this.setState({
      isShowAdd:true
    })
  }
  showRoleAuth = () =>{
    this.setState({
      isShowRoleAuth:true
    })
  }

  addRole = async() =>{
    this.setState({
      isShowAdd:false
    })
    const roleName = this.form.getFieldValue('roleName')
    this.form.resetFields()
    const result = await reqAddRole(roleName)
    if(result.status === 0){
      message.success('添加角色成功')
      this.getRoles()
    }
  }
  updateMenus = (menus) =>{
    //console.log('updateMenus',menus);
    this.setState({
      menus
    })
  }
  updateRoleAuth =async () =>{
    const {role,menus,isShowRoleAuth} = this.state
    this.setState({
      isShowRoleAuth:false
    })
    role.menus = menus
    const result = await reqUpdateRole(role)
    if(result.status === 0){
      message.success('更新权限成功')
      this.getRoles()
    }

  }
  componentWillMount(){
    this.getRoles()
    this.initColumns()
  }

  render() {
    const {roles,role,isShowAdd,isShowRoleAuth,menus} = this.state
    // 选择功能的配置
    const rowSelection = {
      type: 'radio',
      selectedRowKeys: [role.create_time],
      onChange: (selectedRowKeys, selectedRows) => {
       // console.log('onChange()', selectedRowKeys, selectedRows)
        this.setState({
          role: selectedRows[0],
          menus:selectedRows[0].menus
        })
      }
    }
    return (
      <div>
        <Card>
          <Button type="primary" onClick={this.showAddRole}>创建角色</Button>&nbsp;&nbsp;
          <Button type="primary" onClick={this.showRoleAuth} disabled={!role._id}>设置角色权限</Button>&nbsp;&nbsp;
        </Card>
        <Table
          columns={this.columns}
          dataSource={roles}
          bordered
          rowSelection={rowSelection}
          rowKey='create_time'
          onRow = {this.onRow}
          pagination={{defaultPageSize: 6, showQuickJumper: true}}
        />
        <Modal
          title="创建角色"
          visible={isShowAdd}
          onCancel={() => {
            this.setState({isShowAdd: false})
          }}
          onOk={this.addRole}
        >
          <AddRoleForm setForm={(form) => this.form = form}/>
        </Modal>
        <Modal
          title="设置角色权限"
          visible={isShowRoleAuth}
          onCancel={() => {
            this.setState({isShowRoleAuth: false,menus:role.menus})
          }}
          onOk={this.updateRoleAuth}
        >

          <RoleAuthTree
            updateMenus={this.updateMenus}
            menus={menus}
          />
        </Modal>
      </div>
    )
  }
}

class AddRoleForm extends PureComponent{
  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16}
    }

    return (
      <Form>
        <Item label="角色名称" {...formItemLayout}>
          {
            getFieldDecorator('roleName', {
              initialValue: ''
            })(
              <Input type="text" placeholder="请输入角色名称"/>
            )
          }
        </Item>
      </Form>
    )
  }
}
AddRoleForm = Form.create()(AddRoleForm)

class RoleAuthTree extends PureComponent{
  renderTreeNodes = (menuList) => {
    return (
      menuList.reduce((pre,item) => {
        const node = (
          <TreeNode title={item.title} key={item.key}>
            {
              item.children?
                this.renderTreeNodes(item.children):null
            }
          </TreeNode>
        )
        pre.push(node)
        return pre
      },[])
    )
  }
  onCheck = (checkedKeys, info) => {
    //console.log('onCheck', checkedKeys, info);
    this.props.updateMenus(checkedKeys)
  }
  render (){
    const {menus} = this.props
    return(
      <Tree
        checkable
        defaultExpandAll
        onCheck={this.onCheck}
        checkedKeys={menus}
      >
        <TreeNode title='平台权限' key='001'>
          {this.renderTreeNodes(menuList)}
        </TreeNode>
      </Tree>
    )
  }
}