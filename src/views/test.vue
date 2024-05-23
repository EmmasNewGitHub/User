<template>
    <div id="app">
      <h1>SSE 数据监控</h1>
      <ul>
        <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
      </ul>
    </div>
</template>
<script>
export default {
  name: 'SseView',
  data() {
    return {
      messages: []  // 存储接收到的 SSE 消息
    };
  },
  mounted() {
    this.initializeSSE();
  },
  methods: {
    initializeSSE() {
      const sseUrl = 'http://localhost:9151/user/conditioner/sse/subscribe?roomId=1';
      const sse = new EventSource(sseUrl);
      
      sse.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.messages.push('接收到数据: ' + JSON.stringify(data)); // 将接收到的消息存储到 messages 数组
      };

      sse.onerror = (error) => {
        console.error('SSE 连接错误:', error);
        sse.close();  // 出错时关闭 SSE 连接
        this.messages.push('SSE 连接出错，已关闭');
      };
    }
  },
  beforeDestroy() {
    if (sse) {
      sse.close();  // 确保在组件销毁时关闭 SSE 连接
    }
  }
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 60px;
}
</style>
