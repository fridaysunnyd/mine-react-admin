import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  Table,
  Button,
  Icon,
  Modal,
  Form,
  Select,
  Input,
  message
} from 'antd'

import {
  reqCategory,
  reqAddCategory,
  reqUpdateCategory} from '../../api'

const Item = Form.Item
const Option = Select.Option

/*
管理的分类管理路由组件
 */
export default class Category extends Component {
  state = {
    categorys:[],
    isShowAdd:false,
  }
  getCategorys = async () =>{
    const result = await reqCategory(0)
    if(result.status === 0 ){
      this.setState({
        categorys:result.data
      })
    }
  }
  addCategory = async() =>{
    this.setState({
      isShowAdd:false
    })
    const {parentId,categoryName} = this.form.getFieldsValue()
    //console.log({parentId,categoryName})
    const result = await reqAddCategory({parentId,categoryName})
    if(result.status === 0){
      message.success('添加成功')
      this.getCategorys()
    }
  }
  isShowAdd = () =>{
    this.setState({isShowAdd:true})
    //console.log(this.form);
  }
  componentDidMount(){
    this.getCategorys()

  }
  componentWillMount(){
    this.columns = [{
      title: '分类名称',
      dataIndex: 'name',
      // render: (value) => <a href='javascript:'>{value}</a>
    }, {
      title: '操作',
      width: 300,
      render: (category) => {
        return (
          <span>
            <a href="javascript:">修改分类</a>
            &nbsp;&nbsp;&nbsp;
            <a href="javascript:">查看子分类</a>
          </span>
        )
      }
    }, ]
  }
  render() {
    const {categorys,isShowAdd} = this.state
    return (
      <div>
        <Card>
          <span style={{fontSize: 20}}>一级分类列表</span>
          <Button type='primary' style={{float: 'right'}} onClick={this.isShowAdd}>
            <Icon type='plus'/>
            添加分类
          </Button>
        </Card>
        <Table
          bordered
          rowKey='_id'
          columns={this.columns}
          dataSource={categorys}
          loading={!categorys || categorys.length===0}
          pagination={{defaultPageSize: 6}}
        />
        <Modal
          title="添加分类"
          visible={isShowAdd}
          onOk={this.addCategory}
          onCancel={() => this.setState({isShowAdd: false})}
        >
          <AddForm categorys={categorys} setForm={(form) => this.form = form}/>
        </Modal>
      </div>
    )
  }
}

class AddForm extends React.Component{
  static propTypes = {
    categorys: PropTypes.array.isRequired,
    setForm: PropTypes.func.isRequired,
  }
  componentWillMount () {
    this.props.setForm(this.props.form)
  }
  render (){
    const {categorys} = this.props
    const {getFieldDecorator} = this.props.form
    return (
      <Form>
        <Item label='所属分类'>
          {
            getFieldDecorator('parentId', {
              initialValue: '0'
            })(
              <Select>
                <Option key='0' value='0'>一级分类</Option>
                {
                  categorys.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
        <Item label='分类名称'>
          {
            getFieldDecorator('categoryName', {
              initialValue: ''
            })(
              <Input placeholder="请输入分类名称"/>
            )
          }
        </Item>
      </Form>
    )
  }
}
AddForm = Form.create()(AddForm)