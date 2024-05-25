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
        <input type="number" v-model="targetTemperature"  disabled />
        <button @click="changeTargetTemperature(1)">+</button>
      </div>
      <div class="setting">
        <font-awesome-icon icon="fan" size="2x" /> 风速控制
        <button @click="changeWindSpeed(-1)">-</button>
        <input type="number" v-model="windSpeed"  disabled />
        <button @click="changeWindSpeed(1)">+</button>
      </div>
     

      <div class="setting">
        <font-awesome-icon icon="thermometer-half" size="2x" />运行时长
        <button @click="changeTargetDuration(-1)">-</button>
        <input type="number" v-model="targetDuration" disabled  />
        <button @click="changeTargetDuration(1)">+</button>
      </div>
      <div class="setting">
            <font-awesome-icon icon="thermometer-half" size="2x" />额外费用 
            <button @click="changeAdditionalFee(-1)">-</button>
            <input type="number" v-model="additionalFee"  @input="checkAdditionalFee" disabled/>
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
import axios from 'axios';  // Ensure axios is correctly imported

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
      flag: 0,
      powerOnTime: null,
      mode: 1, 
      reason:-1,
      // SSEurl:'http://localhost:9151/',//这里http://localhost:9151/要修改成服务器的url！！！！！！！！！！！
      SSEurl:'http://10.29.150.77:9151/',
    }
  },
  mounted() {
    this.connectSSE();
    this.TempSSE();
    // axios.get("/user/getUserInfo") // Updated URL
    axios.get("/user/userDetail")
      .then(res => {
        this.userdata = res.data.data;
        this.userId = this.userdata.id;       
        let url = '/user/conditioner/getRoomId';
        
        axios.get(url) // Updated URL
          .then(res => {
            this.roomId = res.data.data;
            alert("UserId:" + this.userId + "\nRoomId:" + this.roomId);
            this.connectSSE();
            this.TempSSE();
                    axios.get(`/user/conditioner/status?roomId=${this.roomId}`) // Updated URL
                      .then(res => {
                        this.roomdata = res.data.data;
                        if (res.data.data.powerOn) {
                          this.windSpeed = this.roomdata.windSpeed;
                          this.mode = this.roomdata.mode;
                          this.windSpeed=this.roomdata.windSpeed;
                          this.targetDuration=this.roomdata.targetDuration;
                          this.powerOn=true;
                          this.power=true;
                          alert("成功获取房间空调信息，该房间原先已打开空调！");
                        
                        } else {
                          this.acPower = false;  
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
      this.mode=newMode;
      this.updateModeAndTurnOn(newMode);
    },
    updateModeAndTurnOn(newMode) {
    this.mode = newMode;
    this.$nextTick(() => {
              if(this.power){
                                  let url = `/user/conditioner/adjustMode?roomId=${this.roomId}&mode=${this.mode}`; // Updated URL
                                  axios.post(url, { 
                                    mode: this.mode,
                                    roomId: this.roomId,
                                  })
                                  .then((res) => {
                                    if (res.data.code == 200) {
                                    }
                                    else {
                                      alert("调整模式失败");
                                    }
                                  })
                      }
    });
  },
    changeTargetTemperature(step) {
      this.targetTemperature = Number(this.targetTemperature)+step;
      if(this.power){
                      let url = `/user/conditioner/adjustTargetTemperature?targetTemperature=${this.setTemp}&roomId=${this.roomId}`; // Updated URL
                    // this.setTemp--;
                    axios.post(url, {
                      targetTemperature: this.targetTemperature,
                      roomId: this.roomId,
                    })
                    .then((res) => {
                      if (res.data.code === 200) {
                      }
                      else {
                        alert("调温失败");
                      }
                    })
      }
    },
    changeWindSpeed(step) {
    
      let newWindspeed = Number(this.windSpeed) + step; 
      if (newWindspeed>= 1&&newWindspeed<=3) {
        this.windSpeed= Number(this.windSpeed )+ step;
              if(this.power){
                          let url = `/user/conditioner/adjustWindSpeed?windSpeed=${this.windSpeed}&roomId=${this.roomId}`; // Updated URL
                          axios.post(url, { 
                            windSpeed: this.windSpeed,
                            roomId: this.roomId,
                          })
                          .then((res) => {
                            if (res.data.code === 200) {
                            }
                            else {
                              alert("调风失败");
                            }
                          })

              }
      }
   
    },
    changeTargetDuration(step){
      let newDuration = Number(this.targetDuration) + step;
      if (newDuration >= 0) {
          this.targetDuration = newDuration;
                      if(this.power){
                                let url = `/user/conditioner/adjustTargetDuration?targetDuration=${this.targetDuration}&roomId=${this.roomId}`; // Updated URL
                                axios.post(url, { 
                                  targetDuration: this.targetDuration,
                                  roomId: this.roomId,
                                })
                                .then((res) => {
                                  if (res.data.code === 200) {
                                  }
                                  else {
                                    alert("调整运行时长失败");
                                  }
                                })
                    }
            }
    },
   
    changeAdditionalFee(step) {
      let newFee = Number(this.additionalFee) + step; 
    if (newFee >= 0) {

      this.additionalFee = newFee;
                          if(this.power){
                                let url = `/user/conditioner/adjustAdditionalFee?additionalFee=${this.additionalFee}&roomId=${this.roomId}`; // Updated URL
                                axios.post(url, { 
                                  additionalFee: Number(this.additionalFee),
                                  roomId: this.roomId,
                                })
                                .then((res) => {
                                  if (res.data.code === 200) {
                                  }
                                  else {
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
    const month = now.getMonth() + 1; 
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const sec = now.getSeconds();
    
    const formattedTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    const url = `/user/conditioner/turnOn?roomId=${this.roomId}`;
    const requestBody = {
      roomId: this.roomId,
      userId: this.userId,
      powerOn: true,
      targetTemperature: this.targetTemperature,
      windSpeed: this.windSpeed,
      additionalFee: this.additionalFee,
      targetDuration: this.targetDuration ,
      requestTime:formattedTime,
      mode:this.mode
    };
    axios.post(url, requestBody).then(response => {
      console.log("已经提出开启请求，请稍等！");
      if(this.requestQueueSize===0){
        console.log("已打开空调");
      }else{
        console.log("当前等待"+this.requestQueueSize+"人");
      }
    }).catch(error => {
      console.error("开启空调失败", error);
      this.power = false; 
    });
  },
    turnOffAirConditioner() {
      const url = `/user/conditioner/turnOff?roomId=${this.roomId}`;
      axios.post(url).then(response => {
        console.log("用户主动关闭空调，请稍等");
        if(this.reason===2){
          console.log('已关闭空调');
        }
      }).catch(error => {
        console.error("关闭空调失败", error);
        this.power = true; 
        this.mode="";
      });
    },
    //
    //空调开关SSE通信
    connectSSE() {
    if (this.roomId) {
        // const eventSource = new EventSource(`http://localhost:9151/user/conditioner/sse/subscribe?roomId=${this.roomId}`);
        const eventSource = new EventSource(this.SSEurl+`user/conditioner/sse/subscribe?roomId=${this.roomId}`);
        // alert(this.SSEurl+`user/conditioner/sse/subscribe?roomId=${this.roomId}`)
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
      const eventSource = new EventSource(this.SSEurl+`user/conditioner/sse/subscribe?roomId=${this.roomId}`);
      // const eventSource = new EventSource(`http://localhost:9151/user/conditioner/sse/subscribe?roomId=${this.roomId}`);
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
      checkAdditionalFee(){
        if (this.additionalFee < 0) {
        this.additionalFee = 0;
      }
      }



  },

  watch: {
    power(newValue, oldValue) {
      // 当电源开关变化时触发
      this.toggleAirConditioner();
    },
  
    mode(newMode) {
    console.log("Mode changed to:", newMode);
    if (this.power&&(this.mode==='1'||this.mode==='0')) { 
          let url = `/user/conditioner/adjustMode?roomId=${this.roomId}&mode=${this.mode}`; // Updated URL
                          axios.post(url, { 
                            mode:this.mode,
                            roomId: this.roomId,
                          })
                          .then((res) => {
                            if (res.data.code == 200) {
                            }
                            else {
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
.setting {
    /* display: flex; */
    /* flex-direction: column; */
}

.input-with-button {
    display: flex;
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
}

.confirm-button {
    font-size: 0.8em;
    margin-top: 5px;
    width: fit-content;
    height: fit-content;
}



</style>