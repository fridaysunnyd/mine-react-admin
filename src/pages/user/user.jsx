import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Form,
  Input,
  Select,
  Modal,
} from 'antd'

import {reqUsers,reqAddOrUpdateUser,reqDeleteUser} from '../../api'
import {formateDate} from '../../utils'

const FormItem = Form.Item
const Option = Select.Option

/*
后台管理的用户管理路由组件
 */
export default class User extends Component {

  state = {
    users:[],
    user:{},
    isShow:false
  }

  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: (role_id) => this.roleName[role_id]
      },
      {
        title: '操作',
        render: (user) => (
          <span>
            <a href="javascript:;" onClick={() => this.showUpdate(user)}>修改</a>
            &nbsp;&nbsp;
            <a href="javascript:;" onClick={() => this.clickDelete(user)}>删除</a>
          </span>
        )
      },
    ]
  }
  showUpdate = (user) =>{
    this.setState({
      user:user,
      isShow:true
    })
  }
  showAddUser = () =>{
    this.setState({
      user:{},
      isShow:true
    })

  }
  getUsers = async () =>{
    const result = await reqUsers()
    if(result.status === 0) {
      const {users,roles} = result.data
      this.roles = roles
      this.roleName = roles.reduce((pre,role) =>{
        const {_id,name} = role
        pre[_id] = name
        return pre
      },{} )
      this.setState({
        users
      })
    }
  }
  AddOrUpdateUser =async () =>{
    const user =  this.form.getFieldsValue()
    this.form.resetFields()
    if(this.state.user) {
      user._id = this.state.user._id
    }
    this.setState({
      isShow: false
    })
    const result = await reqAddOrUpdateUser(user)
    if(result.status === 0){
      this.getUsers()
    }
  }
  clickDelete =async (user) =>{
    const result = await reqDeleteUser(user._id)
    if(result.status === 0){
      this.getUsers()
    }
  }

  componentWillMount(){
    this.initColumns()
  }
  componentDidMount () {
    this.getUsers()
  }

  render() {
    const {users,user,isShow} = this.state
    return (
      <div>
        <Card>
          <Button type="primary" onClick={this.showAddUser}>创建用户</Button>
        </Card>

        <Table
          columns={this.columns}
          rowKey='_id'
          dataSource={users}
          bordered
          pagination={{defaultPageSize: 10, showQuickJumper: true}}
        />

        <Modal
          title={user._id ? '修改用户' : '添加用户'}
          visible={isShow}
          onCancel={() => this.setState({isShow: false})}
          onOk={this.AddOrUpdateUser}
        >
          <UserForm setForm={(form) => this.form = form} user={user} roles={this.roles} />
        </Modal>
      </div>
    )
  }
}

class UserForm extends React.Component{

  componentWillMount(){
    this.props.setForm(this.props.form)
  }

  render (){
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16}
    }
    const {user,roles} = this.props
    return (
      <Form>
        <FormItem label="用户名" {...formItemLayout}>
          {
            getFieldDecorator('username', {
              initialValue: user.username
            })(
              <Input type="text" placeholder="请输入用户名"/>
            )
          }
        </FormItem>

        {
          !user._id ?
            (
              <FormItem label="密码" {...formItemLayout}>
                {
                  getFieldDecorator('password', {
                    initialValue: ''
                  })(
                    <Input type="passowrd" placeholder="请输入密码"/>
                  )
                }
              </FormItem>
            ) : null
        }



        <FormItem label="手机号" {...formItemLayout}>
          {
            getFieldDecorator('phone', {
              initialValue: user.phone
            })(
              <Input type="phone" placeholder="请输入手机号"/>
            )
          }
        </FormItem>

        <FormItem label="邮箱" {...formItemLayout}>
          {
            getFieldDecorator('email', {
              initialValue: user.email
            })(
              <Input type="email" placeholder="请输入邮箱"/>
            )
          }
        </FormItem>

        <FormItem label="角色" {...formItemLayout}>
          {
            getFieldDecorator('role_id', {
              initialValue: user.role_id
            })(
              <Select style={{width: 200}}>
                {
                  roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                }
              </Select>
            )
          }
        </FormItem>
      </Form>
    )
  }
}
UserForm = Form.create()(UserForm)