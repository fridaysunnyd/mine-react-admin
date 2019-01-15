import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {reqLogin} from '../../api'
import storageUtils from '../../utils/storageUtils'
import MemoryUtils from '../../utils/MemoryUtils'
import {
  Form,
  Icon,
  Input,
  Button
} from 'antd'
import logo from '../../assets/images/logo.png'
import './index.less'
/*
登陆的路由组件
 */
export default class Login extends Component {
  state = {
    errorMsg:''
  }
  login = (result) => {
    if(result.status === 0){
      //保存
      const user = result.data
      storageUtils.saveUser(user)  // local中
      MemoryUtils.user = user // 内存中
      //跳转
      this.props.history.replace('/')
    }else {
      this.setState({
        errorMsg: result.msg
      })
    }
  }
  render() {
    const {errorMsg} = this.state
    return (
      <div className="login">
        <div className="login-header">
          <img src={logo} alt="logo"/>
          React项目: 后台管理系统
        </div>
        <div className="login-content">
          <div className="login-box">
            <div className="error-msg-wrap">
              <div className={errorMsg ? "show" : ""}>
                {errorMsg}
              </div>
            </div>
            <div className="title">用户登陆</div>
            <LoginForm login={this.login}/>
          </div>
        </div>
      </div>
    )
  }
}
/*form对象:
 this.props.form: 得到form对象
 getFieldDecorator(fieldName, options)(<Input/>): 包装Input组件生成一个新包装组件
 getFieldValue(fieldName): 得到某个Field中的Input的value
 resetFields(): 重置所有输入框
 validateFields((error, values) => {}): 对所有表单项进行验证*/
class LoginForm extends React.Component{
  static propTypes = {
    login: PropTypes.func.isRequired
  }

  checkPassword = (rule,value,callback) => { // 如果不满足要求, 通过调用callback()来指定对应的message
    if(!value) {
      callback('必须输入密码')
    } else if(value.length<4 || value.length>8) {
      callback('密码必须是4到8位')
    } else {
      callback() // 如果不传参数代表成功
    }
  }

  clickLogin = () =>{
    // 只有当验证没有错误时才输出输入的数据
    this.props.form.validateFields(async (error, values) => {
      console.log('validateFields', error, values)
      if(!error) {
        console.log('收集表单数据', values)
        const {username,password} = values
        const result = await reqLogin(username, password)
        this.props.login(result)
      } else {
        this.props.form.resetFields() // 重置所有输入框
      }
    })
  }
  render (){
    const {getFieldDecorator} = this.props.form
    return (
      <Form className="login-form">
        <Form.Item>
          {
            getFieldDecorator('username',{
              initialValue: 'admin', // input的默认值
              rules: [ // 声明式验证配置
                { type: "string", required: true, message: '必须输入用户名' },
                { min: 4, message: '长度不能少于4位' },
              ],
            })(
              <Input placeholder="用户名" prefix={<Icon type="user"/>}/>
            )
          }
        </Form.Item>
        <Form.Item>
          {
            getFieldDecorator('password',{
              rules: [{validator: this.checkPassword}]  // 编程式验证
            })(
              <Input type="password" placeholder="密码" prefix={<Icon type="safety"/>}/>
            )
          }
        </Form.Item>
        <Form.Item>
          <Button type="primary" className="login-form-button" onClick={this.clickLogin}>登录</Button>
        </Form.Item>
      </Form>
    )
  }
}
LoginForm = Form.create()(LoginForm)