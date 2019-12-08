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