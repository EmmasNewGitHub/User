<template>
  <div>
    <el-container class="wrapper">
      <el-main class="section text-left">
        <!-- 用户信息卡片 -->
        <el-card class="box-card mine-card">
          <div class="text item">
            <span class="home-title">我的家</span>
            <span class="exclusive-title">| 专享服务</span>
            <el-row>
              <el-col :span="4" class="text-right">
                <img v-if="userdata.sex == 1" src="../assets/img/man.png" class="avatar" />
                <img v-else src="../assets/img/woman.png" class="avatar" />
              </el-col>
              <el-col :span="18">
                <p class="username">
                  {{ userdata.userName }}
                  <i v-if="userdata.sex == 1" class="el-icon-male man"></i>
                  <i v-else class="el-icon-female woman"></i>
                </p>
                <p class="userid">id：{{ userdata.id }}</p>
              </el-col>
            </el-row>
          </div>
        </el-card>
        
        <el-card class="box-card mine-card-tool">
          <div class="text item">
            <el-row>

              

              <el-col :span="5" class="text-center">
                <router-link to="/history" >
                  <img src="../assets/img/dingdan.png" alt="dingdan" class="icon" />
                  <p class="tool-text">我的订单</p>
                </router-link>
              </el-col>


              <el-col :span="5" class="text-center">
                <router-link to="/checkinfo" >
                  <img src="../assets/img/mine.png" alt="mine" class="icon" />
                  <p class="tool-text">我的信息</p>
                </router-link>
              </el-col>
              <el-col :span="5" class="text-center">
                <router-link to="/contact" >
                  <img src="../assets/img/phone.png" alt="phone" class="icon" />
                  <p class="tool-text">联系我们</p>
                </router-link>
              </el-col>
              <el-col :span="5" class="text-center">
                <a @click="checkACStatus" class="text-plain ac">
                  <img src="../assets/img/ac.png" alt="Air Conditioner" class="icon" />
                  <p class="tool-text">空调详单</p>
                </a>
              </el-col>

              <el-col :span="5" class="text-center">
                <router-link to="/controlAC" class="text-plain contact">
                  <img src="../assets/img/controller.jpg" alt="Controller" class="icon" />
                  <p class="tool-text">调整空调</p>
                </router-link>
              </el-col>

            </el-row>
          </div>
        </el-card>

        <div class="btn-logout">
          <!-- <el-button type="primary" class="btn-block" style="font-size: 18px;" @click="dialogVisible = true"> -->
            <!-- <el-button  class="btn-block" style="font-size: 18px;" @click="dialogVisible = true"> -->
          <el-button   class="btn-block" style="font-size: 18px;"  @click="dialogVisible = true">
                退出
          </el-button>
        </div>
      </el-main>
      <el-footer class="footer">
        <footbar></footbar>
      </el-footer>
    </el-container>
    <el-dialog title="退出" :visible.sync="dialogVisible" width="95%">
      <span>你确定退出登录吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false" style="font-size: 18px;">取消</el-button>
        <el-button @click="logoutBtn">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import footbar from "@/components/footbar.vue";

export default {
  data() {
    return {
      dialogVisible: false,
      userdata: {}
    };
  },
  components: {
    footbar
  },
  methods: {
    logoutBtn() {
      this.dialogVisible = false;
      this.$router.push("/login");
      this.axios.get("http://localhost:9151/user/logout")
        .then(res => {
         
        })
        .catch(res => {
          console.log("失败" + res);
        });
    },
    checkACStatus() {
      this.axios.get("http://localhost:9151/user/specificBill")
        .then(res => {
          if (res.data.code === 200) {
        // 如果状态码为200，显示成功消息和从后端获取的消息
        this.$message({
          // message: `连接成功，状态码：${res.data.code}，消息：${res.data.message}消息：${res.data.data}`,
          message: `连接成功，状态码：${res.data.code}，请稍等，即将为您跳转...`,
          type: 'success'
        });
        //延时一小段时间以后跳转到myac页面
        setTimeout(() => {
          this.$router.push('/myac');
        }, 3000);  // 3000 毫秒后跳转，可以根据需要调整时间
      } else {
            this.$message({
              message: `连接失败，错误码：${res.data.code}`,
              type: 'error'
            });
          }
        })
        .catch(error => {
          console.error('请求失败：', error);
          this.$message.error(`请求失败，请稍后重试`);
        });
    }
  },
  mounted() {
    this.axios.get("http://localhost:9151/user/userDetail")
      .then(res => {
        this.userdata = res.data.data;
       
      })
      .catch(res => {
        console.log("失败" + res);
      });
  }
};
</script>

<style scoped>
.mine-bg {
  background: url(../assets/img/mine.jpg);
  height: 30vh;
  background-size: 100%;
  border: 0px solid transparent;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
.el-row {
  display: flex;
  justify-content: space-around; /* 所有列均匀分布，包括两侧的间距 */
}
.text, .tool-text {
  font-size: 12px; /* 调整字体大小 */
}
.item {
  padding: 12px 0; /* 调整内边距 */
}
.mine-card, .mine-card-tool {
  margin: 1rem;
  height: 115px;
}
.avatar {
  width: 3.5rem; 
}
.username, .userid {
  font-size: 0.8rem; 
  margin-left: 0.5rem; 
}
.man, .woman {
  font-size: 16px; 
  color: #409EFF; 
}
.woman {
  color: #ff557f; 
}
.order, .info, .password, .contact, .ac {
  font-size: 12px; 
  padding: 3px; /* 减小内边距 */
}
.order {
  color: #53A8FF;
}
.contact {
  color: #F56C6C;
}
.info {
  color: rgb(65, 105, 225);
}
.password {
  color: #67C23A;
}
.ac {
  color: #42b983;
}
.icon {
  vertical-align: middle; 
  width: 50px; 
  height: 43px; 
  margin-right: 5px;
}
.home-title {
  font-size: 18px;
  font-weight: bold;
}
.exclusive-title {
  font-size: 9px;
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
