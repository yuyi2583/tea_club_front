export default {
    convertToStandardTreeData: ({ productType, byProductType, productDetail, byProductDetail }) => {
        let treeData = new Array();
        productType.forEach((uid) => {
            treeData.push({ id: uid, pId: -1, value: uid, title: byProductType[uid].type });
        });
        productDetail.forEach((uid) => {
            treeData.push({ id: uid, pId: byProductDetail[uid].type, value: uid, title: byProductDetail[uid].name, isLeaf: true });
        })
        return treeData;
    },
    onLoadData: (treeNode,props) =>
        new Promise(resolve => {
            const { id } = treeNode.props;
            props.fetchProductDetail(id).then(() => {
                resolve();
            });
        }),
    onChange: (value,setFieldsValue) => {
        console.log("on change", value);
        setFieldsValue({"avtivityApplyForProduct":value});
        // this.setState({ value });
    },
}