import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal,message } from 'antd';

import {reqRemoveImg} from '../../api'

export default class PicturesWall extends React.Component {
  static propTypes = {
    imgs: PropTypes.array
  }
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [], // loading: 上传中, done: 上传完成, remove: 删除
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  saveImgs = () => {
    return this.state.fileList.map(file => file.name)
  }
  getImgs = () =>{
    // 如果传入了imgs, 生成一个对应的fileList, 并更新fileList状态
    const imgs = this.props.imgs
    if (imgs && imgs.length > 0) {
      const fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: 'done', // loading: 上传中, done: 上传完成, remove: 删除
        url: 'http://localhost:5000/upload/' + img,
      }))
      this.state.fileList = fileList
    }
  }
  handleChange = async ({file, fileList}) => {
   // console.log('handleChange()', file, fileList)
    // 如果上传图片完成
    if (file.status === 'done') {
      let result = file.response
      if (result.status === 0) {
        message.success('上传成功了')
        const {name, url} = result.data
        file = fileList[fileList.length - 1]
        file.name = name
        file.url = url
      } else {
        message.error('上传失败了')
      }
    }
    else if (file.status === 'removed'){
     let result  = await reqRemoveImg(file.name)
      if(result.status===0) {
        message.success('删除图片成功')
      } else {
        message.error('删除图片失败')
      }
    }
    this.setState({fileList})
  }

  componentWillMount() {
    this.getImgs()

  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload"
          accept="image/*"
          name='image'
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

