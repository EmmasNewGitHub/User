<template>
    <div>
      <h1>空调使用账单详情</h1>
      <div v-if="!acdata">
        <p>正在获取数据...</p>
      </div>
      <div v-else>
        <p>房间号: {{ acdata.roomId }}</p>
        <p>总费用: {{ acdata.totalFee.toFixed(2) }} 元</p>
        <p>记录数: {{ acdata.recordCount }}</p>
        <p>总服务时间: {{ acdata.totalServiceTime }} 小时</p>
      </div>
      


    <!-- 楼层信息卡片 -->
    <el-card class="info-card">
          <div class="info-content">
            楼层信息计费详情
          </div>
        </el-card>
        
        <!-- 设备控制区域提示卡片 -->
        <el-card class="info-card">
          <div class="info-content">
            定时空调使用计费说明
          </div>
        </el-card>


        <div class="goback">
        <button class="goback-button" @click="goback">返回</button>
      </div>


    </div>







    
  </template>
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import axios from 'axios';
  
  export default defineComponent({
    setup() {
      const acdata = ref(null); // 使用 ref 创建响应式数据
  
      const fetchAcData = async () => {
        try {
          const response = await axios.get('http://localhost:9151/user/conditionerBill');
          if (response.data.code === 200) {
            acdata.value = response.data.data; // 更新响应式引用的值
          } else {
            console.error(`Error fetching data: ${response.data.code}`);
          }
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      };
      fetchAcData();
      return { acdata };
    },
    methods:{
    goback(){
      this.$router.push("/myac");
    },
  }
  });
 
  </script>
  
  <style>
  div {
    font-family: Arial, sans-serif;
  }
  .info-card {
  margin: 1rem;
  padding: 20px;
  height: 110px;
  background-color: #f2f2f2; 
  border: 1px solid #ebebeb; 
}
.info-content {
  font-size: 16px; 
  color: #333; 
  font-weight: bold;
}
  </style>
  
