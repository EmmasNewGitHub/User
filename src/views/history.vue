<template>
  <div>
    <el-container class="wrapper">
      <el-main class="section text-left">
        <el-row>
          <el-col :span="24">
            <el-card class="box-card">
              <el-row>
                <el-col :span="18">
                  共有<span class="order-num">{{length}}</span>条订单
                </el-col>
                <el-col :span="6" class="text-right">
                  <el-button @click="back" type="text" class="order-back">返回</el-button>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="24" v-for="(order, index) in orderdata" :key="index">
            <el-card class="box-card" @click="showOrderDetails(order)">
              <el-row class="text item" :gutter="10">
                <el-col :span="8" class="order-head">
                  <div class="text-center">
                    <img src="@/assets/img/订单.png" alt="订单图标" class="order-icon" @click="handleIconClick(order)">
                    <p class="order-time-data">（点击获取详情）</p>
                  </div>
                  <div class="text-center">
                    <p class="order-id">订单号</p>
                    <p class="order-id-data">{{order.order.id}}</p>
                   
                  </div>
                </el-col>
                <el-col :span="16" class="order-detail">
                
                <p>入住时间：{{order.order.inTime}}</p>
                
                <p>预计费用：{{order.order.realPrice}}</p>
                
                <p class="order-time">下单时间：{{order.order.createTime}}</p>
                   
              </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="24" class="text-center mb-1">
            --- 没有了 ---
          </el-col>
        </el-row>
      </el-main>
      <el-footer class="footer">
        <footbar></footbar>
      </el-footer>
    </el-container>
    <el-dialog
      title="订单详情"
      :visible.sync="dialogVisible"
      width="50%"
      @close="handleClose">
      <div v-if="selectedOrder">
      <p>预订房间类型：{{ selectedOrder.room.type.typeName }}</p>
      <p>预订房间号：{{ selectedOrder.room.number }}</p>
      <p>入住时间：{{ selectedOrder.order.inTime }}</p>
      <p>离店时间：{{ selectedOrder.order.leaveTime }}</p>
      <p>入住人数：{{ selectedOrder.order.realPeople }}</p>
      <p>提供发票：{{ selectedOrder.order.fapiao == 1 ? '是' : '否' }}</p>
      <p>预计费用：{{ selectedOrder.order.realPrice }}</p>
      <p>是否受理：{{ selectedOrder.order.flag == 1 ? '是' : '否' }}</p>
      
    </div>
  </el-dialog>

</div>

</template>

<script>
  import footbar from "@/components/footbar.vue";
  export default {
    data() {
      return {
        orderdata: {},
        length: '',
        dialogVisible: false, 
        selectedOrder: null  
      }
    },
    components: {
      footbar,
    },
    methods: {
       handleIconClick(order) {
        this.selectedOrder = order;  // 设置选中的订单
        this.dialogVisible = true;   // 打开对话框
    },
      back() {
        this.$router.push("/mine");
      },
      showOrderDetails(order) {
        alert('hehe')
        this.selectedOrder = order;  // 设置选中的订单详情
        this.dialogVisible = true;   // 显示对话框
        console.log("Dialog should now be visible", this.dialogVisible, this.selectedOrder);
      },
      handleClose() {
        this.dialogVisible = false;  // 关闭对话框
      }
    },
    mounted() {
      // this.axios.get("http://localhost:9151/user/historyOrder")
      this.$http.get("/user/historyOrder") 
      // http://localhost:9153/
        .then(res => {
          this.orderdata = res.data.data;
          this.length = this.orderdata.length;
        })
        .catch(res => {
          alert('获取历史账单失败，请稍后再试...');
          console.log("获取历史账单失败，请稍后再试...");
        })
    }
  }
</script>

<style>

.order-icon:hover {
    transform: scale(1.1); 
}

  .text {
    font-size: 14px;
  }

  .item {
    padding: 15px 0 0 0;
  }

  .box-card {
    margin: 1rem;
  }

  .order-icon {
    cursor: pointer;  
    transition: transform 0.3s; 
    width: 46px; height: 46px;
  }

  .order-detail p {
    margin-top: 0;
    color: #606266;
  }

  .order-id,
  .order-time {
    margin-bottom: 0;
    color: #303133;
  }

  .order-id-data,
  .order-time-data {
    margin-top: 0.2rem;
    font-size: 0.5rem;
    color: #606266;
  }

  .order-num {
    font-size: 1.3rem;
    color: #e63c3c;
    margin: 0 0.3rem;
  }

  .order-back {
    padding: 5px;
  }
</style>
