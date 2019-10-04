<template>
  <div>
  <!--{{allTagList}}-->
  <!--{{modalTagSelection}}-->
  <!--{{selectionData}}-->
  <!--{{columns_data}}-->
    <Row :gutter="10">
      <Col :span='24'>
        <!-- 搜索框操控组件 -->
        <Card style="margin-bottom: 5px;">
            <div class="search-bar">
              <Form inline label-position="left" :label-width="60" >
                <FormItem label="关键词">
                  <Input type="text" v-model="searchForm.goods" placeholder="" style="width:80px">
                  </Input>
                </FormItem>
                <FormItem label="支付方式" >
                  <Select :value="-1">
                    <Option :value="-1">全部</Option>
                    <Option :value="1">支付宝</Option>
                    <Option :value="0">微信</Option>
                  </Select>
                </FormItem>
                <FormItem label="标签：">
                  <Select multiple :value="-1">
                    <Option v-for="i in 10"  :value="i">支付宝</Option>
                  </Select>
                </FormItem>
                <ButtonGroup >
                  <Button @click="search()"><Icon type="md-search" /></Button>
                </ButtonGroup>

                <FormItem>
                  <Upload action="">
                    <Button  type="success" icon="ios-cloud-upload-outline">微信</Button>
                  </Upload>
                </FormItem>
                <FormItem>
                  <Upload action="http://127.0.0.1:8900/upload/ali_bill">
                    <Button type="primary" icon="ios-cloud-upload-outline">支付宝</Button>
                  </Upload>
                </FormItem>
              </Form>
            </div>
          </Card>



        <Card>
          <!-- 工具栏 -->
          <div>
            <ButtonGroup>
              <!--打标签工具-->
              <Button @click="clickTagTool"><Icon type="ios-pricetag" size="15" /></Button>
              <!--删除工具-->
              <Poptip
                      confirm
                      placement="right-start"
                      title="删除？"
              >
                <Button><Icon type="md-trash" size="15"  /></Button>
              </Poptip>
            </ButtonGroup>
          </div>
          <br>
          <!-- 表格显示部分 -->
          <div>
            <Table border
                   stripe
                   :columns="columns"
                   :data="columns_data"
                   ref="selection"
                   @on-select="tabRowOnSelect"
                   @on-select-cancel="tabRowOnSelect"
                   @on-select-all="tabRowOnSelect"
                   @on-select-all-cancel="tabRowOnSelect"
            >
              <template slot-scope="{ row,index }" slot="payNum">
                <span v-if="row.incomeType>0">+{{row.payNum/100}}</span>
                <span v-if="row.incomeType<0">-{{row.payNum/100}}</span>
                <span v-if="row.incomeType==0">内部流转: {{row.payNum/100}}</span>
              </template>
              <template slot-scope="{row,index}" slot="payCreatTime">
                <span>{{row.payCreatTime*1000|formatDate}}</span>
              </template>
              <!--标签-->
              <template slot-scope="{ row,index }" slot="tags">
                <Tag v-for="tag in row.tags" :color="tag.color">{{tag.name}}</Tag>
                <!--<Button icon="ios-add" type="dashed" size="small" @click=""></Button>-->
                <!--<Input  size="small"  type="text" :style="`width:${newTagText.length*10+30}px`" v-model="newTagText" @on-blur="addTagChange(row,index)"></Input>-->
                <Input size="small"  type="text" :style="`width:${row.newTagText.length*10+30}px`" v-model="row.newTagText" @on-blur="addTagChange(row,index)"></Input>
              </template>
              <!--账单进度-->
              <template slot-scope="{ row,index }" slot="billStep">
                <Tag>未支付</Tag>
                <!--<Tag>已支付</Tag>-->
                <!--<Tag>发起退款</Tag>-->
                <!--<Tag>已退款</Tag>-->
              </template>
              <!-- 操作按钮 -->
              <template slot-scope="{ row,index }" slot="action">
                <Button type="primary" size="small">编辑</Button>
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
      <!-- <Col :span="6">
          <Calendar
              v-on:choseDay="clickDay"
              v-on:changeMonth="changeDate"
          ></Calendar>
      </Col> -->
      <!-- <Col :span='4'>
          <vc-calendar />
      </Col> -->
    </Row>

    <Modal v-model="modal_tag_bill_show"
           title="打标签"
           width="350"
           @on-ok="tagModalOnOK"
    >
      <div>
        <CheckboxGroup v-model="modalTagSelection">
          <Checkbox v-for="item in allTagList" :label="item.id">
            <Tag :color="item.color">{{item.name}}</Tag>
          </Checkbox>
        </CheckboxGroup>
      </div>
    </Modal>
    <template>
      <BackTop></BackTop>
    </template>
  </div>
</template>

<script>
import Calendar from 'vue-calendar-component'
import {formatDate} from '@/js/common.js'
export default {
  mounted () {
    this.search()
    this.getAllTags()
  },
  components: {
    Calendar
  },

  filters: {
      formatDate(time) {
          var date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      }
  },
  data () {
    return {
      total: 0,
      pageSize: 50,
      searchForm: {
        goods: ''
      },
      allTagList:[],
      modalTagSelection:[],
      modal_tag_bill_show:false,
      selectionData:[],
      newTagWidth:'30',
      columns_data: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'ID',
          key: 'id',
          width: 80
        },
        {
          title: '商品名称',
          key: 'goods'
        },
        {
            title: '交易方',
            key: 'trader'
        },
        {
            title: '交易创建时间',
            key:'payCreatTime',
            slot:'payCreatTime'
        },
        {
          title: '花费金额/元',
          key: 'payNum',
          slot: 'payNum',
          sortable: true
        },
        {
            title: '备注',
            key: 'remark'
        },
        {
          title: '标签',
          key: 'payNum',
          slot: 'tags'
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

  // modal 打标签确定事件
  async tagModalOnOK(){
      var data = {}
      var billIdList = []
      data.tagIdList = this.modalTagSelection
      for(var i=0;i<this.selectionData.length;i++){
          billIdList.push(this.selectionData[i].id)
      }
      data.billIdList = billIdList
      this.$http.post("tag/join_bill",data)
    },
    // modal 中获取全部标签
    getAllTags(){
      this.$http.post("tag/list.json",{}).then((res)=>{
        console.log(res)
        this.allTagList= res.data.result.rows
      })
    },
    getPage (num) {
    },
    on_change (nextNum) {
      this.searchForm.page = nextNum
      this.searchForm.pageSize = this.pageSize
      this.search()
    },
    search () {
      this.searchForm.pageSize = this.pageSize
      this.$http.post('alibill/list.json', this.searchForm)
        .then((response) => {
          this.total = response.data.result.total
          this.columns_data = response.data.result.rows
          for(var i=0;i<this.columns_data.length;i++){
            this.columns_data[i].newTagText = ""
          }
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
    },

    //新建标签
    addTagChange (row,index) {
      // 保存标签
      // let scrollWidth = this.$refs.addTagInput.scrollWidth;
      // this.newTagWidth = scrollWidth
      var color = this.getRandomColor()
      if(row.newTagText !=""){
        // 发送post请求进行数据持久化  标签存在，添加记录；标签不存在，新建标签并添加记录
        this.columns_data[index].tags.push({ 'name': row.newTagText, 'color': color})
        row.newTagText = ""
      }


    },

    //选中一个checkbox
    tabRowOnSelect(selection,row){
      this.selectionData = selection
    },
    clickTagTool(){
      this.modal_tag_bill_show = true
      this.modalTagSelection = []
    },
    //生成随机颜色
    getRandomColor () {
      var colorArr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
      var color = ''
      for (var i = 0; i < 6; i++) {
        color += colorArr[Math.floor(Math.random() * 15)]
      }
      return '#' + color
    }
    }
  }
</script>

<style>
  .search-bar{
    height: 30px;

  }
</style>
