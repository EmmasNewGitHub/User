<template>  
    <div class="air-conditioning-container">  
      <div class="message-box">  
        <p>空调打开失败</p> 
        <p class="small-text">当前使用人数过多，请稍后</p>  
      </div>  
      <div class="button-group">  
        <button class="btn-confirm">确认</button>  
        <!-- 如果右边的按钮没有特定功能，则可以省略或设置为无操作 -->  
        <!-- <button class="btn-placeholder"></button> -->  
      </div>  
    </div>  
  </template>  
    
  <script>  
  export default {  
    name: 'AirConditioningPanel',  
    // 其他组件选项 
  }  
  </script>  
    
  <style scoped>  
  .air-conditioning-container {  
    /* 设置整个容器的背景颜色、边距等 */  
    padding: 20px;  
    background-color: #f5f5f5; 
  }  
    
  .message-box {  
    text-align: center; /* 让文本居中 */  
    margin-bottom: 20px; /* 与按钮组之间的间距 */  
  }  
    
  .message-box p {  
    color: #333; /* 文字颜色 */  
    margin: 0; /* 移除默认边距 */  
  }  
    
  .small-text {  
    font-size: 12px; /* 小字体的尺寸 */  
    color: #333; /* 小字体的颜色 */  
  }  
    
  .button-group {  
    display: flex;  
    justify-content: center; /* 让按钮组居中 */  
  }   
    
  .btn-confirm {  
  /* 确认按钮的样式 */  
  background-color: #e3dad513; /* 白色 */  
  border: black;  
  color: rgb(234, 48, 48);  /*red*/
  padding: 10px 20px;  
  text-align: center;  
  text-decoration: none;  
  display: inline-block;  
  font-size: 16px;  
  margin: 0 10px; /* 与右边按钮的间距 */  
  cursor: pointer;  
  border-radius: 4px; /* 可选：添加边框圆角 */  
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 可选：添加阴影效果 */  
}  
body {
  background-color: #ccc; /* 灰色 */
}


  </style>