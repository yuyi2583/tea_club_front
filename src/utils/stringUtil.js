//正则表达式验证手机号
export const validateContact = (contact) => {
    if (contact.length !== 11) {
        return false;
    }
    let regx = /\d{11}/;
    // console.log("contact:",contact,"validate result:",regx.test(contact));
    return regx.test(contact);
}

//正则表达式验证身份证号
export const validateId = (id) => {
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return reg.test(id);
}

/**
 * 字符串长度大于limit则返回带省略号的字符串
 * @param {*} str 
 * @param {*} limit 
 */
export const stringWithEllipsis = (str, limit = 20) => {
    if (str.length > limit) {
        return str.substring(0, limit) + "...";
    }
    return str;
}