
/**
 * 选择优惠产品范围方法
 */
export const activityApplyForProduct = {
    convertToStandardTreeData: ( productTypes, byProductTypes, products, byProducts ) => {
        let treeData = new Array();
        try {
            productTypes.forEach((uid) => {
                treeData.push({ id: `type_${uid}`, pId: -1, value: `type_${uid}`, title: byProductTypes[uid].name });
            });
            products.forEach((uid) => {
                treeData.push({ id: `product_${uid}`, pId: `type_${byProducts[uid].type.uid}`, value: `product_${uid}`, title: byProducts[uid].name, isLeaf: true });
            })
        } catch (err) {
            console.log("convert standard tree data err",err);
            
            treeData = new Array();
        }
        return treeData;
    },
    // onLoadData: (treeNode, props) =>
    //     new Promise(resolve => {
    //         const { id } = treeNode.props;
    //         props.fetchProductsNameByType(id.split("_")[1]).then(() => {
    //             resolve();
    //         });
    //     }),
    onChange: (value, setFieldsValue) => {
        console.log("on change", value);
        setFieldsValue({ "avtivityApplyForProduct": value });
        // this.setState({ value });
    },
}