<template>
  <div>
    <Row :gutter="10">
      <Col :span='24'>
        <!-- 搜索框操控组件 -->
        <Card style="margin-bottom: 5px">
          <div class="search-bar">
            <Form inline label-position="left" :label-width="60" >
              <FormItem label="关键词">
                <Input type="text" v-model="searchForm.goods" placeholder="" style="width:80px">
                </Input>
              </FormItem>
              <!--<FormItem label="支付方式" >-->
                <!--<Select :value="-1">-->
                  <!--<Option :value="-1">全部</Option>-->
                  <!--<Option :value="1">支付宝</Option>-->
                  <!--<Option :value="0">微信</Option>-->
                <!--</Select>-->
              <!--</FormItem>-->
              <ButtonGroup >
                <Button @click="search()"><Icon type="md-search" /></Button>
              </ButtonGroup>
            </Form>
          </div>
        </Card>
        <Card>
          <!-- 工具栏 -->
          <div>
            <ButtonGroup>
              <Button @click="tool_add_button()" ><Icon type="md-add" size="15"  /></Button>
              <Poptip
                confirm
                placement="right-start"
                title="删除？"
              >
                <Button @click="tool_delete_button()"><Icon type="md-trash" size="15"  /></Button>
              </Poptip>
            </ButtonGroup>
          </div>
          <br>

          <!--新建修改-->
          <div  v-if="modify_show">
            <Card style="width: 600px">
              <Form inline  :label-width="50" >
                <FormItem label="名字：">
                  <Input type="text" placeholder="" style="width:80px" v-model="tagFrom.name"></Input>
                </FormItem>
                <FormItem label="颜色：">
                  <ColorPicker v-model="tagFrom.color" />
                </FormItem>
                <FormItem label="描述：">
                  <Input type="text" placeholder="" style="width:80px"  v-model="tagFrom.desc"></Input>
                </FormItem>
                <ButtonGroup >
                  <Button @click="tagFrom_save_click" type="primary">保存</Button>
                  <Button @click="tagForm_delete_click" type="error">取消</Button>
                </ButtonGroup>
              </Form>
              <Tag :color="tagFrom.color">{{tagFrom.name}}</Tag>
            </Card>
          </div>
          <!-- 表格显示部分 -->
          <div>
            <Table border
                   stripe
                   width="600"
                   :columns="columns"
                   :data="columns_data"
                   ref="selection"
                   @on-select="tagTable_on_select"
            >
              <!--标签展示-->
              <template slot-scope="{ row,index }" slot="tag_show">
                <Tag :color="row.color">{{row.name}}</Tag>
              </template>
              <!-- 操作按钮 -->
              <template slot-scope="{ row,index }" slot="action">
                <Button type="primary" size="small" @click="tagTable_edit_click(row,index)">编辑</Button>
              </template>
            </Table>
            <br>
          </div>
          <!-- 分页部分 -->
          <div>
            <Page
                    :total="total"
                    :page-size="pageSize"
                    @on-change="on_change"
            >
            </Page>
          </div>
        </Card>
      </Col>
    </Row>

    <!--弹出框-->

    <!--删除确认-->
    <Modal v-model="modal_delete_show"
           title="创建句集"
           width="350"
    >
      <div>
        <Form label-position="top">
          <FormItem label="句集名称">
            <Input></Input>
          </FormItem>
          <FormItem label="颜色">
            <Input ></Input>
          </FormItem>
        </Form>
      </div>
    </Modal>

  </div>
</template>

<script>
import Calendar from 'vue-calendar-component'
export default {
  mounted () {
    this.search()
  },
  components: {
    Calendar
  },

  data () {
    return {
      total: 11,
      pageSize: 10,
      searchForm: {
        goods: ''
      },
      tagFrom: {
        color: '#2D8CF0',
        name: '默认标签',
        desc: ''
      },
      tagAddFlag: true,
      modify_show: false,
      modal_delete_show: false,

      columns_data: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '标签',
          slot: 'tag_show'
        },
        {
          title: '描述',
          key: 'desc'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ]

    }
  },

  methods: {
    getPage (num) {

    },
    tool_add_button () {
      this.modify_show = true
      this.tagAddFlag = true
    },

    tool_delete_button () {
      // this.modal_delete_show = true
    },

    // 标签修改，取消按钮点击事件
    tagForm_delete_click () {
      this.modify_show = false
      // 重置form表单
      this.tagFrom = {
        color: '#2D8CF0',
        name: '默认标签',
        desc: ''
      }
      // 修改后端数据 TODO
    },

    // 标签修改，保存按钮点击事件
    tagFrom_save_click () {
      var tempTag = this.tagFrom

      // 判断是新增标签还是修改标签
      if (this.tagAddFlag == true) {
        this.columns_data.unshift(tempTag)
      }
      this.tagAddFlag = true
      // 头部添加
      // 重置form表单
      this.tagFrom = {
        color: '#2D8CF0',
        name: '默认标签',
        desc: ''
      }

      // 修改后端数据 TODO
    },

    // 表格编辑按钮点击事件
    tagTable_edit_click (row, index) {
      this.modify_show = true
      this.tagFrom = row
      this.tagAddFlag = false
    },

    tagTable_on_select (selection, row) {
      console.log(selection, row)
    },

    on_change (nextNum) {
      alert('页面发生变动')
    },

    search () {
      this.$http.post('tags/list.json', this.searchForm)
        .then((response) => {
          console.log(response)
          this.columns_data = response.data.result.rows
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    refresh () {
      alert('refresh')
    },
    show (index) {
      this.$Modal.info({
        title: '信息查看',
        content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
      })
    },
    remove (index) {
      this.data6.splice(index, 1)
      alert('删除了第' + index)
    },

    clickDay (data) {
      console.log(data) // 选中某天
    },
    changeDate (data) {
      console.log(data) // 左右点击切换月份
    },
    clickToday (data) {
      console.log(data) // 跳到了本月
    }

  }
}
</script>

<style>
  .search-bar{
    height: 30px;

  }
</style>
