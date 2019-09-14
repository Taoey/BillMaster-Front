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
              </template>
              <!-- 操作按钮 -->
              <template slot-scope="{ row,index }" slot="action">
                <Button type="primary" size="small">编辑</Button>
                <Poptip
                        placement="left"
                        confirm
                        title="删除？"
                        @on-ok="remove(index,row)"
                >
                  <Button type="error" size="small">删除</Button>
                </Poptip>
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


  </div>
</template>

<script>
  import Calendar from 'vue-calendar-component';
  export default {
    mounted () {
      this.search()
    },
    components: {
      Calendar
    },

    data(){
      return{
        total:11,
        pageSize:10,
        searchForm:{
          goods:""
        },
        columns_data:[],
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: 'ID',
            key: 'id',
            width:80
          },
          {
            title: '商品名称',
            key: 'goods'
          },
          {
            title: '花费金额（元）',
            key: 'payNum',
            slot:'payNum'
          },
          {
            title: '标签',
            key: 'payNum',
            slot:"tags",
          },
          {
            title: '操作',
            slot: 'action',
            width: 150,
            align: 'center'
          }
        ],
      }
    },

    methods: {
      getPage(num){

      },
      on_change(nextNum){
        alert("页面发生变动")
      },
      search(){
        this.$http.post('alibill/list.json',this.searchForm)
          .then((response)=>{
            console.log(response)
            this.columns_data = response.data.result.rows
          })
          .catch(function (error) {
            console.log(error);
          });

      },
      refresh(){
        alert("refresh")
      },
      show (index) {
        this.$Modal.info({
          title: '信息查看',
          content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
        })
      },
      remove (index) {
        this.data6.splice(index, 1);
        alert("删除了第"+index)
      },

      clickDay(data) {
        console.log(data); //选中某天
      },
      changeDate(data) {
        console.log(data); //左右点击切换月份
      },
      clickToday(data) {
        console.log(data); // 跳到了本月
      }

    }
  }
</script>

<style>
  .search-bar{
    height: 30px;

  }
</style>
