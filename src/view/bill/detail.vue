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
                <Upload action="">
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
              <Button ><Icon type="ios-pricetag" size="15" /></Button>
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
            >
              <template slot-scope="{ row,index }" slot="payNum">
                {{row.payNum/100}}
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
    >
      <div>
        <CheckboxGroup >
          <Checkbox v-for="i in 15"><Tag color="success">发票</Tag></Checkbox>
        </CheckboxGroup>
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
      total: 80,
      pageSize: 10,
      searchForm: {
        goods: ''
      },
      modal_tag_bill_show:true,
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
          title: '花费金额（元）',
          key: 'payNum',
          slot: 'payNum'
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
    getPage (num) {
    },
    on_change (nextNum) {
      alert('页面发生变动')
    },
    search () {
      this.$http.post('alibill/list.json', this.searchForm)
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
    },
    addTagChange (row,index) {
      // 保存标签
      // let scrollWidth = this.$refs.addTagInput.scrollWidth;
      // this.newTagWidth = scrollWidth
      var color = this.getRandomColor()
      if(row.newTagText !=""){
        this.columns_data[index].tags.push({ 'name': row.newTagText, 'color': color})
        row.newTagText = ""
      }

      // 发送post请求进行数据持久化
      //TODO
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
