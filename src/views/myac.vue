<template>
  <div>
    <h1>空调状态详情</h1>
     <div class="button-container">
    <el-button class="getACDetail" @click="gogetACDetail">
        获取汇总账单
    </el-button>
    <el-button @click="goback" type="text" class="order-back">返回</el-button>
</div>

    <div v-if="acData === null || acData.length === 0">
      <p>没有获取到空调数据。</p>
    </div>
    <div v-else>
      <table class="table table-striped">
        <thead>
          <tr>
            <th v-for="(value, key) in acData[0]" :key="'header-' + key">
              {{ key }}
            </th>
          </tr>
        </thead>
        <tbody>
         
          <tr v-for="(item, index) in acData" :key="'row-' + index">
            <td v-for="(value, key) in item" :key="'data-' + index + '-' + key">
              {{ value }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="goback">
        <button class="goback-button" @click="goback">返回</button>
      </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      acData: null  // 用来存储从后端获取的数据
    };
  },
  methods: {
    // fetchAcData() {
    //   // this.axios.get("http://127.0.0.1:4523/m1/4382405-4026619-default/user/specificBill")
    //   this.axios.get("http://localhost:9151/user/specificBill") 
    //   .then(res => {
    //       if (res.data.code === 200) {
    //         // if (res.data.code ) {
    //         this.acData = res.data.data;
    //       } else {
    //         this.$message.error(`获取空调数据失败，错误码：${res.data.code}`);
    //       }
    //     })
    //     .catch(error => {
    //       console.error('请求空调数据失败：', error);
    //       this.$message.error('请求空调数据失败，请稍后重试');
    //     });
    // },
    fetchAcData() {
  this.$http.get("/user/specificBill") // Updated URL
    .then(res => {
      if (res.data.code === 200) {
        this.acData = res.data.data;
      } else {
        this.$message.error(`获取空调数据失败，错误码：${res.data.code}`);
      }
    })
    .catch(error => {
      console.error('请求空调数据失败：', error);
      this.$message.error('请求空调数据失败，请稍后重试');
    });
}
,
    gogetACDetail(){
      this.$router.push('/ACDetail');
    },
    goback(){
      this.$router.push('/mine');
    },
  },
  mounted() {
    this.fetchAcData();  // 页面加载时调用方法获取数据
  }
};
</script>


<style>
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

.table th {
  background-color: #eee;
}
.button-container {
    display: flex;
    flex-direction: column;
    justify-content: center; /* 垂直居中 */
    align-items: center; /* 水平居中 */
    /* height: 100vh; 让容器充满整个视口高度 */
}


</style>
