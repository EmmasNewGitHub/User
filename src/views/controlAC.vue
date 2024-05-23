<template>
  <div id="app">
    <div class="control-panel">
      <div class="header">
        <font-awesome-icon icon="thermometer-half" size="2x" /> 室内温度
        <h1 class="large-text">{{ currentTemperature }}°C</h1>
      </div>
      <div class="toggle">
        <label class="switch">
          <input type="checkbox" v-model="power">
          <span class="slider"></span>
        </label>
        <div>Power {{ power ? 'On' : 'Off' }}</div>
      </div>
      <div class="setting">
        <font-awesome-icon icon="thermometer-half" size="2x" />目标温度
        <button @click="changeTargetTemperature(-1)">-</button>
        <input type="number" v-model="targetTemperature" />
        <button @click="changeTargetTemperature(1)">+</button>
      </div>
      <div class="setting">
        <font-awesome-icon icon="fan" size="2x" /> 风速控制
        <button @click="changeWindSpeed(-1)">-</button>
        <input type="number" v-model="windSpeed" />
        <button @click="changeWindSpeed(1)">+</button>
      </div>
     

      <div class="setting">
        <font-awesome-icon icon="thermometer-half" size="2x" />运行时长
        <button @click="changeTargetDuration(-1)">-</button>
        <input type="number" v-model="targetDuration" />
        <button @click="changeTargetDuration(1)">+</button>
      </div>
      <div class="setting">
            <font-awesome-icon icon="thermometer-half" size="2x" />额外费用 
            <button @click="changeAdditionalFee(-1)">-</button>
            <input type="number" v-model="additionalFee" />
            <button @click="changeAdditionalFee(1)">+</button>
      </div>
        模式
        <select v-model="mode" @change="modeChanged">
          <option value="">选择一种模式</option>
          <option value="1">制冷</option>
          <option value="0">制热</option>
        </select>


        <div class="goback">
        <button class="goback-button" @click="goback">返回</button>
      </div>

      </div>
    </div>
  
</template>

<script>
import axios from 'axios';  // 确保 axios 正确引用

export default {
  name: 'App',
  data() {
    return {
      power: false,
      currentTemperature: 0,
      targetDuration: 1,
      additionalFee: 0,
      userdata: {},
      roomdata: {},
      roomId: null,
      on: true,
      acPower: false,
      powerOn: false,
      currentTime: null,
      currentTemp: null,
      setTemp: 20,
      windSpeed: 1, 
      timer: null,
      runSeconds: 0,
      runMinutes: 0,
      temp: 0,
      runHours: 0,
      userId: null,
      requestTime: '2007-04-05 03:29',
      targetTemperature: 18, 
      targetDuration: 1,
      flag: 0, // 关闭空调
      powerOnTime: null,
      mode: 1, 
      reason:-1,
    }
  },
  mounted() {
    this.connectSSE();
    this.TempSSE();
    axios.get("http://localhost:9151/user/userDetail") // 获取 userId
      .then(res => {
        this.userdata = res.data.data;
        this.userId = this.userdata.id;
        // alert("user ID:" + this.userId);
        let url = `http://localhost:9151/user/conditioner/getRoomId?userId=${this.userId}`;
        axios.get(url) // 获取 roomId
          .then(res => {
            this.roomId = res.data.data;
            alert("UserId:" + this.userId + "\nRoomId:" + this.roomId);
            this.connectSSE();
            this.TempSSE();
                    this.axios.get(`http://localhost:9151/user/conditioner/status?roomId=${this.roomId}`)
                      .then(res => {
                        this.roomdata = res.data.data;
                        if (res.data.data) {
                          this.windSpeed = this.roomdata.windSpeed;
                          this.mode = this.roomdata.mode;
                          this.windSpeed=this.roomdata.windSpeed;
                          this.targetDuration=this.roomdata.targetDuration;
                          this.powerOn=true;
                          this.power=true;
                          alert("成功获取房间空调信息，该房间原先已打开空调！");
                        
                        } else {
                          this.acPower = false;  // 如果没有空调信息，默认为关闭
                          alert("该房间还没有开启空调");
                        }

                       
                      })
                      .catch(error => {
                        console.log("请求空调信息失败: " + error.response.data.message);
                        alert("请求空调信息失败: " + error.response.data.message);
                      });

          })
          .catch(error => {
            console.log("获取 roomId 失败" + error);
            alert('获取 roomId 失败, 先假设 roomId=10');
            this.roomId = 10;
          });
      })
      .catch(error => {
        alert('获取 userId 失败');
        console.log("失败" + error);
      });
  },
  methods: {
    modeChanged(event){
      const newMode = event.target.value;
      this.mode=newMode;//立即更新mode
      this.updateModeAndTurnOn(newMode);
      // this.turnOnAirConditioner(newMode);
    },
    updateModeAndTurnOn(newMode) {
    this.mode = newMode;
    this.$nextTick(() => {
      // this.turnOnAirConditioner(this.mode);
              if(this.power){
                                  let url = `http://localhost:9151//user/conditioner/adjustMode?roomId=${this.roomId}&mode=${this.mode}`;
                                  this.axios.post(url, { 
                                    mode: this.mode,
                                    roomId: this.roomId,
                                  })
                                  .then((res) => {
                                    if (res.data.code == 200) {
                                     // alert("已成功发送调整模式，请稍等！");
                                          if(this.reason===6){//用户主动关闭
                                              console.log('已调整模式');
                                            }
                                    } else {
                                      alert("调整模式失败");
                                    }
                                  })
                      }
    });
  },
    changeTargetTemperature(step) {
      this.targetTemperature = Number(this.targetTemperature)+step;
      if(this.power){//当空调开启时要向空发送调整参数的请求
                      let url = `http://localhost:9151/user/conditioner/adjustTargetTemperature?targetTemperature=${this.setTemp}&roomId=${this.roomId}`;
                    // this.setTemp--;
                    this.axios.post(url, {
                      targetTemperature: this.targetTemperature,
                      roomId: this.roomId,
                    })
                    .then((res) => {
                      if (res.data.code == 200) {
                        // alert("已成功发送调温请求，请稍等！");
                            if(this.reason===6){
                                console.log('已调整目标温度');
                              }
                      } else {
                        alert("调温失败");
                      }
                    })
      }
    },
    changeWindSpeed(step) {
    
      let newWindspeed = Number(this.windSpeed) + step; // 确保targetDuration是数字
      if (newWindspeed>= 1&&newWindspeed<=3) {
        this.windSpeed= Number(this.windSpeed )+ step;
              if(this.power){
                          let url = `http://localhost:9151/user/conditioner/adjustWindSpeed?windSpeed=${this.windSpeed}&roomId=${this.roomId}`;
                          this.axios.post(url, { 
                            windSpeed: this.windSpeed,
                            roomId: this.roomId,
                          })
                          .then((res) => {
                            if (res.data.code === 200) {
                              //alert("已成功发送调整风速请求，请稍等！");
                                  if(this.reason===6){//用户主动关闭
                                      console.log('已调整风速');
                                    }
                            } else {
                              alert("调风失败");
                            }
                          })

              }
      }
   
    },
    changeTargetDuration(step){//调整targetDuration

      let newDuration = Number(this.targetDuration) + step; // 确保targetDuration是数字
      if (newDuration >= 0) {
          this.targetDuration = newDuration;
                      if(this.power){
                                let url = `http://localhost:9151/user/conditioner/adjustTargetDuration?targetDuration=${this.targetDuration}&roomId=${this.roomId}`;
                                this.axios.post(url, { 
                                  targetDuration: this.targetDuration,
                                  roomId: this.roomId,
                                })
                                .then((res) => {
                                  if (res.data.code === 200) {
                                    //alert("已成功发送调整运行时长请求，请稍等！");
                                      if(this.reason===6){//调整参数
                                          console.log('运行时长已调整');
                                        }
                                  } else {
                                    alert("调整运行时长失败");
                                  }
                                })
                    }
            }
    },
    changeAdditionalFee(step) {
      let newFee = Number(this.additionalFee) + step; // 确保additionalFee是数字
    if (newFee >= 0) {
      this.additionalFee = newFee;
                          if(this.power){
                                let url = `http://localhost:9151/user/conditioner/adjustAdditionalFee?additionalFee=${this.additionalFee}&roomId=${this.roomId}`;
                                this.axios.post(url, { 
                                  additionalFee: this.additionalFee,
                                  roomId: this.roomId,
                                })
                                .then((res) => {
                                  if (res.data.code === 200) {
                                  alert("已成功调整额外费用，请稍等！");
                                  } else {
                                    alert("调整费用失败！");
                                  }
                                })

                    }
        }
    },
    toggleAirConditioner() {
      if (this.power) {
        this.turnOnAirConditioner();
        
      } else {
        this.turnOffAirConditioner();
      }
    },
    turnOnAirConditioner(newMode) {
      console.log("Attempting to turn on AC with mode:", this.mode);
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 月份从0开始，所以加1
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const sec = now.getSeconds();
    
    // const formattedTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    //格式化为 'YYYY-MM-DD HH:MM' 的形式
    const formattedTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    const url = `http://localhost:9151/user/conditioner/turnOn?roomId=${this.roomId}`;
    const requestBody = {
      roomId: this.roomId,
      userId: this.userId,
      on: true, // 空调开启状态
      targetTemperature: this.targetTemperature,
      windSpeed: this.windSpeed,
      additionalFee: this.additionalFee,
      targetDuration: this.targetDuration , // 用户输入的小时数转换为秒
      requestTime:formattedTime,
      mode:this.mode
    };
    axios.post(url, requestBody).then(response => {
      console.log("已经提出开启请求，请稍等！");
      if(this.requestQueueSize===0){//可打开
        console.log("已打开空调");
      }else{
        console.log("当前等待"+this.requestQueueSize+"人");
      }
    }).catch(error => {
      console.error("开启空调失败", error);
      this.power = false; // 如果开启失败，重置开关状态
    });
  },
    turnOffAirConditioner() {
      const url = `http://localhost:9151/user/conditioner/turnOff?roomId=${this.roomId}`;
      axios.post(url).then(response => {
        console.log("用户主动关闭空调，请稍等");
        if(this.reason===2){//用户主动关闭
          console.log('已关闭空调');
        }
      }).catch(error => {
        console.error("关闭空调失败", error);
        this.power = true; // 如果关闭失败，重置开关状态
        this.mode="";//关机以后重新将页面上的mode设置为null
      });
    },
    //空调开关SSE通信
    connectSSE() {
    if (this.roomId) {
        const eventSource = new EventSource(`http://localhost:9151/user/conditioner/sse/subscribe?roomId=${this.roomId}`);
        eventSource.addEventListener('status-update', event => {
        console.log('New SSE Data:', event.data);
        const eventData = JSON.parse(event.data);
        this.serviceQueueLength = eventData.source.serviceQueueLength;
        this.requestQueueSize = eventData.source.requestQueueSize;
        this.reason=eventData.reason;
          //监控空调发来的关闭原因
            if (this.reason === 1) {
            this.power = false; // 设置空调为关闭状态
            this.acPower=false;
            alert("计时器到时，已关闭空调");
            }else if(this.reason===2){
              this.power = false; // 设置空调为关闭状态
              this.acPower=false;
              alert("用户主动关闭空调");
            }else if(this.reason===3){
              this.power = false; // 设置空调为关闭状态
              this.acPower=false;
              alert("到达目标温度，已关闭空调");
            }else if(this.reason===4){
              this.power = false; // 设置空调为关闭状态
              this.acPower=false;
              alert("资源被抢占，已关闭空调");
            }else if(this.reason===5){
              this.power = false; // 设置空调为关闭状态
              this.acPower=false;
              alert("意外关闭空调");
            }
            else if(this.reason===6){
              alert("参数调整成功");
            }
      });
      eventSource.onmessage = event => {
        console.log('General SSE message:', event.data);
      };
      eventSource.onerror = error => {
        console.error('SSE failed:', error);
        eventSource.close(); 
      };
    } else {
      console.error('Room ID is undefined. Cannot connect to SSE.');
    }
  },

//室温SSE
  TempSSE() {
    if (this.roomId) {
      const eventSource = new EventSource(`http://localhost:9151/user/conditioner/sse/nowTemp?roomId=${this.roomId}`);
      eventSource.addEventListener('temperature-update', event => {
        console.log('New TempSSE Data:', event.data);
        const eventData = JSON.parse(event.data);
        this.currentTemp=this.currentTemperature = eventData.temperature;
      });

      eventSource.onmessage = event => {
        console.log('General TempSSE message:', event.data);
      };

      eventSource.onerror = error => {
        console.error('TempSSE failed:', error);
        eventSource.close(); 
      };
    } else {
      console.error('Room ID is undefined. Cannot connect to TempSSE.');
    }
  },
  goback() {
        this.$router.push("/mine");
      },
  },
  watch: {
    power(newValue, oldValue) {
      // 当电源开关变化时触发
      this.toggleAirConditioner();
    },
  
    mode(newMode) {
    console.log("Mode changed to:", newMode);
    if (this.power&&(this.mode==='1'||this.mode==='0')) { // 只有当电源打开时才执行
      // this.turnOnAirConditioner(newMode);
          let url = `http://localhost:9151/user/conditioner/adjustMode?roomId=${this.roomId}&mode=${this.mode}`;
                          this.axios.post(url, { 
                            mode:this.mode,
                            roomId: this.roomId,
                          })
                          .then((res) => {
                            if (res.data.code == 200) {
                              //alert("已成功发起调整模式，请稍等！");
                            } else {
                              alert("调整模式失败！");
                            }
                          })

    }
  }

  }
  }

</script>



<style>
.control-panel {
  width: 350px;
  margin: auto;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border-radius: 8px;
  background-color: #f4f4f8;
}
.goback-button {
  width: 80px; /* 更小的宽度 */
  height: 30px; /* 更小的高度 */
  font-size: 0.8rem; /* 更小的字体大小 */
  padding: 5px;
  margin: 10px;
}
.large-text {
  font-size: 2.5rem;
  color: red;
}
.setting, .toggle {
  margin: 20px 0;
}
button {
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
}
input[type="number"], select {
  width: 80px;
  height: 50px;
  font-size: 1.5rem;
  text-align: center;
}
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #2196F3;
}
input:checked + .slider:before {
  transform: translateX(26px);
}
</style>