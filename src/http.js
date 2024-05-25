import axios from 'axios';

// axios.defaults.baseURL = 'http://localhost:9151/';
axios.defaults.baseURL = 'http://10.29.150.77:9151/';
axios.defaults.timeout = 2000;
axios.defaults.withCredentials = true;

export async function connectSSE(roomId) {
  try {
    const response = await axios.get(`/user/conditioner/sse/subscribe?roomId=${roomId}`);
    return response.data; // 返回 SSE 数据
  } catch (error) {
    throw new Error('Failed to connect to SSE: ' + error.message);
  }
}

export async function TempSSE(roomId) {
  try {
    const response = await axios.get(`/user/conditioner/sse/subscribe?roomId=${roomId}`);
    return response.data; // 返回 SSE 数据
  } catch (error) {
    throw new Error('Failed to fetch temperature SSE: ' + error.message);
  }
}

export default axios; // 导出修改后的 Axios 实例
