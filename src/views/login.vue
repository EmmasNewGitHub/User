<template>
    <div>
        <el-container class="wrapper">
            <el-main class="section text-center">
                <div class="login-bg"></div>
                <el-card class="box-card login-card">
                    <div class="text item">
                        <p class="login-title">
                           
                            HELLO!
                        </p>
                        <el-form
                            :model="login"
                            status-icon
                            ref="login"
                            label-width="80px"
                        >
                            <el-form-item label="账号" prop="email">
                                <el-input
                                    type="text"
                                    placeholder="请输入手机号或电子信箱"
                                    v-model="login.email"
                                    autocomplete="off"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="pass">
                                <el-input
                                    type="password"
                                    v-model="login.password"
                                    placeholder="请输入至少6位字母数据组合"
                                    autocomplete="off"
                                ></el-input>
                            </el-form-item>
                        </el-form>

                    </div>
                </el-card>
               <!-- <el-button
                    circle
                    :type="btnType"
                    @click="loginBtn"
                    class="loginbtn"
                    :disabled="disabled"
                >
                    <i :class="iconstyle" style="font-size: 54px"></i>
                </el-button>-->
                <el-button
                    :type="btnType"
                    @click="loginBtn"
                    class="loginbtn"
                    :disabled="disabled">
                    登录
                </el-button>

                <div class="register">

                    <p>
                        <router-link to="/register" style="color: black">注册账号</router-link
                        >
                    </p>
                </div>
            </el-main>
        </el-container>
        <el-footer class="footer text-center">
            <copyright></copyright>
        </el-footer>



         <!-- 登录成功的弹窗 -->
        <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" center>
            <span>您已成功登录，即将跳转...</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="closeDialog">确定</el-button>
            </span>
        </el-dialog>



        <!-- 登录失败的弹窗 -->
        <el-dialog
            title="提示"
            :visible.sync="failDialogVisible"
            width="50%"
            center>
            <span>您的密码或账号输入不正确，请重新尝试</span>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="closeFailDialog">确定</el-button>
            </span>
        </el-dialog>







    </div>
</template>

<script>
import copyright from "@/components/copyright.vue";
import store from "../store";
export default {
    data() {
        return {
            login: {
                email: "",
                password: "",
            },
            iconstyle: "iconfont icon-r-right",
            disabled: false,
            btnType: "primary",
            isRealLogin: true,
            dialogVisible:false,
            failDialogVisible:false,
        };
    },
    components: {
        copyright,
    },
    methods: {
        loginBtn() {
            if (
                this.login.email.trim() == "" ||
                this.login.password.trim() == ""
            ) {
                this.$message({
                    message: "账号或密码不能为空",
                    type: "error",
                });
                return;
            }
            this.iconstyle = "el-icon-loading";
            this.disabled = true;

            // this.axios
            //     .post("http://localhost:9151/user/login", {
            //         email: this.login.email,
            //         password: this.login.password,
            //     })
            //     .then((res) => {
            //         if (res.data.code == 200) {
            //             this.iconstyle = "el-icon-check";
            //             this.btnType = "success";
                        
            //             this.dialogVisible = true;  // 显示成功弹窗
            //             //this.disabled = false;
            //             setTimeout(() => {
            //                 this.disabled = false;
            //                 this.$store.commit("setFind");
            //                //this.$router.push("/findroom");
            //                 this.$router.push("/mine")
            //             }, 2000);
            //         } else {
                        
            //             this.failDialogVisible = true; // 显示登录失败弹窗
            //             this.handleLoginError();
            //             }
            //     }).catch((e) => {
            //         this.failDialogVisible = true; // 确保这里也设置显示失败弹窗
            //         this.handleLoginError();
                   
            //     });
            
                this.$http({
                    method: 'post',
                    url: '/user/login',
                    data: {
                        email: this.login.email,
                        password: this.login.password,
                    }
                }).then((res) => {
                    if (res.data.code === 200) {
                        this.iconstyle = "el-icon-check";
                        this.btnType = "success";
                        
                        this.dialogVisible = true; 
                        setTimeout(() => {
                            this.disabled = false;
                            this.$store.commit("setFind");
                            this.$router.push("/mine");
                        }, 2000);
                    } else {
                        this.failDialogVisible = true;
                        this.handleLoginError();
                    }
                }).catch((e) => {
                    this.failDialogVisible = true; 
                    this.handleLoginError();
                });



        },

        handleLoginError() {
            this.iconstyle = "el-icon-close";
            this.btnType = "danger";
            this.disabled = false;
            setTimeout(() => {
                this.iconstyle = "iconfont icon-r-right";
                this.btnType = "primary";
            }, 2000);
        },


        closeDialog() {
            this.dialogVisible = false;
        },
        closeFailDialog() {
            this.failDialogVisible = false;
        },
        nologinBtn() {
            this.$store.commit("setFind");
            this.$router.push("/findroom");
        },
        
    },
};
</script>

<style scoped>
/* @import './assets/css/fontello.css'; */


/* 覆盖所有 Element UI 按钮的伪元素内容 */
.el-button::before {
    content: none !important;
    display: none !important;
}
.login-bg {
    background: rgb(255, 255, 255);
    height: 30vh;
    background-size: 100%;
    border: 0px solid transparent;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}

.text {
    font-size: 14px;
}

.item {
    /* padding: 18px 0; */
}

.login-card {
    margin: -7rem 1rem 1rem 1rem;
}

.login-title {
    font-size: 2rem;
    font-weight: lighter;
    margin-top: 1rem;
}

.wrapper {
    min-height: 90vh;
}

.el-main {
    max-height: 90vh;
}

#app {
    overflow: hidden;
}

.loginbtn {
    background-color: #409EFF;  /* Element UI primary color */
    border: none;
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 4px;  /* Gives a slight round corner */
    cursor: pointer;
    transition: background-color 0.3s;
    width: 90%; 
}

.loginbtn:hover {
    background-color: #66b1ff;  /* Lighter blue on hover */
}

.register {
    margin-top: 5vh;
}

.register a,
.register div {
    color: #f9ff40;
}

.register p {
    margin: 0.5rem;
}
</style>
