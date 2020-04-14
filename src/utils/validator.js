export default {
    phone:{pattern:/^1(3|4|5|6|7|8|9)\d{9}$/,message:"手机号码有误，请重填"},
    otp:{ pattern:/\d{6}/, message: "请输入6为数字验证码"},
    postCode:{pattern:/^[0-9]{6}$/,message:"邮编格式错误"},
}