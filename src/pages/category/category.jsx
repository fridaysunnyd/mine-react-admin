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
    parentId:'0',
    parentName:'',
    categorys:[],
    subCategorys:[],
    isShowAdd:false,
    isShowUpdate:false,
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
      this.state.parentId === '0' ?this.getCategorys():this.getSubCategorys()
    }
  }
  showUpdate = (category) =>{
    this.category = category
    this.setState({
      isShowUpdate:true
    })
  }
  updateCategory = async () =>{
    this.setState({
      isShowUpdate:false
    })
    const categoryName = this.form.getFieldValue('categoryName')
    console.log(categoryName);
    const categoryId = this.category._id
    const result = await reqUpdateCategory({categoryId,categoryName})
    if(result.status === 0){
      message.success('更新成功')
      //this.getCategorys()
      this.state.parentId === '0' ?this.getCategorys():this.getSubCategorys()
    }
  }
  showSubCategorys = (category) =>{
    this.setState({
      parentId:category._id,
      parentName:category.name
    },this.getSubCategorys)
  }
  getSubCategorys = async() =>{
    const {parentId} = this.state
    const result = await reqCategory(parentId)
    if(result.status === 0){
      this.setState({
        subCategorys:result.data,
      })
    }
  }
  showCategorys = () =>{
    this.setState({
      parentId:'0',
      subCategorys:[]
    })
  }
  tableData = () =>{
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
            <a href="javascript:" onClick={() =>{this.showUpdate(category)}}>修改分类</a>
            &nbsp;&nbsp;&nbsp;
            <a href="javascript:" onClick={() =>{this.showSubCategorys(category)}}>查看子分类</a>
          </span>
        )
      }
    }, ]
  }
  componentDidMount(){
    this.getCategorys()

  }
  componentWillMount(){
    this.tableData()
  }
  render() {
    const {parentId,categorys,isShowAdd,isShowUpdate,subCategorys,parentName} = this.state
    const category = this.category || {}
    return (
      <div>
        <Card>
          {
            parentId==='0'
              ? <span style={{fontSize: 20}}>一级分类列表</span>
              : (
              <span>
                  <a href="javascript:" style={{fontSize: 20}} onClick={this.showCategorys}>一级分类列表</a>
                &nbsp;&nbsp;&nbsp;
                <Icon type="arrow-right" />
                &nbsp;&nbsp;&nbsp;
                <span>{parentName}</span>
                </span>
            )
          }
          <Button type='primary'
                  style={{float: 'right'}}
                  onClick={() => this.setState({isShowAdd: true})}>
            <Icon type='plus'/>
            添加分类
          </Button>
        </Card>
        <Table
          bordered
          rowKey='_id'
          columns={this.columns}
          dataSource={parentId==='0' ? categorys : subCategorys}
          loading={!categorys || categorys.length===0}
          pagination={{defaultPageSize: 6}}
        />

        <Modal
          title="添加分类"
          visible={isShowAdd}
          onOk={this.addCategory}
          onCancel={() => this.setState({isShowAdd: false})}
        >
          <AddForm parentId={parentId} categorys={categorys} setForm={(form) => this.form = form}/>
        </Modal>
        <Modal
          title="更新分类"
          visible={isShowUpdate}
          onOk={this.updateCategory}
          onCancel={() => this.setState({isShowUpdate: false})}
        >
          <UpdateForm categoryName={category.name} setForm={(form) => this.form = form}/>
        </Modal>
      </div>
    )
  }
}

class AddForm extends React.Component{
  static propTypes = {
    categorys: PropTypes.array.isRequired,
    setForm: PropTypes.func.isRequired,
    parentId:PropTypes.string.isRequired
  }
  componentWillMount () {
    this.props.setForm(this.props.form)
  }
  render (){
    const {categorys,parentId} = this.props
    const {getFieldDecorator} = this.props.form
    return (
      <Form>
        <Item label='所属分类'>
          {
            getFieldDecorator('parentId', {
              initialValue:parentId
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

class UpdateForm extends React.Component{
  static propTypes = {
    setForm: PropTypes.func.isRequired,
    categoryName:PropTypes.string.isRequired
  }
  componentWillMount () {
    this.props.setForm(this.props.form)
  }
  render (){
    const {getFieldDecorator} = this.props.form
    const {categoryName} = this.props
    return (
      <Form>
        <Item>
          {
            getFieldDecorator('categoryName', {
              initialValue: categoryName
            })(
              <Input placeholder="请输入新的分类名称"/>
            )
          }
        </Item>
      </Form>
    )
  }
}
UpdateForm = Form.create()(UpdateForm)