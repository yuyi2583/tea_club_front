//删除父数组中的子数组
export const removePointById = (parents, children) => {
    let newArray = new Array();
    if (children.length == 0) {
        newArray = [...parents];
    } else {
        for (let i = 0; i < parents.length; i++) {
            for (let j = 0; j < children.length; j++) {
                if (children[j] == parents[i]) {
                    break;
                } else if (j == children.length - 1) {
                    newArray.push(parents[i]);
                }
            }
        }
    }
    return newArray
}

//根据数字获取星期数
export const convertToDay = (arry) => {
    let result = arry.map((item) => {
        let day = "错误";
        switch (item) {
            case "1":
                day = "周一";
                break;
            case "2":
                day = "周二";
                break;
            case "3":
                day = "周三";
                break;
            case "4":
                day = "周四";
                break;
            case "5":
                day = "周五";
                break;
            case "6":
                day = "周六";
                break;
            case "7":
                day = "周日";
                break;
        }
        return day;
    });
    if (result.indexOf("错误")!==-1) {
        result = ["错误,请修改营业时间"];
    } else if (result.indexOf("周一") !== -1 && result.indexOf("周二") !== -1 && result.indexOf("周三") !== -1 &&
        result.indexOf("周四") !== -1 && result.indexOf("周五") !== -1 &&
        result.indexOf("周六") !== -1 && result.indexOf("周日") !== -1) {
        result = ["每天"];
    } else if (result.length === 5 && result.indexOf("周一") !== -1 && result.indexOf("周二") !== -1 && result.indexOf("周三") !== -1 &&
        result.indexOf("周四") !== -1 && result.indexOf("周五") !== -1) {
        result = ["工作日"];
    } else if (result.length === 2 && result.indexOf("周六") !== -1 && result.indexOf("周日") !== -1) {
        result = ["周末"];
    }
    return result;
}