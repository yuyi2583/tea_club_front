export const getTreeData = (byBelong, byAuthority) => {
    let treeData = new Array();
    for (var key in byBelong) {
        let treeNode = new Object();
        treeNode.title = byBelong[key].title;
        treeNode.value = byBelong[key].title;
        treeNode.key = byBelong[key].name;
        treeNode.children=new Array();
        for(var index in byAuthority){
            if(byAuthority[index].belong===key){
                let child=new Object();
                child.title=byAuthority[index].title;
                child.value=byAuthority[index].title;
                child.key=byAuthority[index].name;
                treeNode.children.push(child);
            }
        }
        treeData.push(treeNode);
    }
    console.log("tree data",treeData);
    return treeData;
}