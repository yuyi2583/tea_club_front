export const totalCountDown = 60;

const initialState = {
    clientHeight: null,             //客户端高度
    clientWidth: null,              //客户端宽度
    countDown: totalCountDown,      //计时数
    openMessageDrawer: false,       //打开消息抽屉
    alterInfo: false,                //修改信息状态
    shopId_shopManagement: "",          //门店管理选择的门店编号
    addButtonVisible_shopManagement: true,   //新增门店按钮显示
    modalVisible: false,             //modal显示与否
    modalLoading: false,                 //modal是否展示loading
};

//action types
export const types = {
    GET_CLIENT_SIZE: "UI/GET_CLIENT_SIZE",             //获取浏览器宽高
    START_COUNT_DOWN: "UI/START_COUNT_DOWN",           //开始倒计时
    FINISH_COUNT_DOWN: "UI/FINISH_COUNT_DOWN",         //结束倒计时
    OPEN_MESSAGE_DRAWER: "UI/OPEN_MESSAGE_DRAWER",     //打开消息抽屉
    CLOSE_MESSAGE_DRAWER: "UI/CLOSE_MESSAGE_DRAWER",    //关闭消息抽屉
    START_ALTER_INFO: "UI/START_ALTER_INFO",             //开始修改信息
    FINISH_ALTER_INFO: "UI/FINISH_ALTER_INFO",           //结束修改信息
    SHOPMANAGEMENT_SELECT_SHOP: "UI/SHOPMANAGEMENT_SELECT_SHOP",     //选择门店
    SHOPMANAGEMENT_ADD_BUTTON_VISIBLE: "UI/SHOPMANAGEMENT_ADD_BUTTON_VISIBLE", //显示按钮
    SHOPMANAGEMENT_ADD_BUTTON_INVISIBLE: "UI/SHOPMANAGEMENT_ADD_BUTTON_INVISIBLE",//去除按钮
    OPEN_MODAL: "UI/OPEN_MODAL",                     //打开modal
    CLOSE_MODAL: "UI/CLOSE_MODAL",                   //关闭modal
    SHOW_MODAL_LOADING: "UI/SHOW_MODAL_LOADING",
    HIDE_MODAL_LOADING: "UI/HIDE_MODAL_LOADING",
};

//action creators
export const actions = {
    setClientSize: (clientWidth, clientHeight) => ({
        type: types.GET_CLIENT_SIZE,
        clientHeight: clientHeight,
        clientWidth: clientWidth
    }),
    startCountDown: (countDown) => ({
        type: types.START_COUNT_DOWN,
        countDown,
    }),
    finishCountDown: () => ({
        type: types.FINISH_COUNT_DOWN,
    }),
    openMessageDrawer: () => ({
        type: types.OPEN_MESSAGE_DRAWER,
    }),
    closeMessageDrawer: () => ({
        type: types.CLOSE_MESSAGE_DRAWER,
    }),
    startAlterInfo: () => ({
        type: types.START_ALTER_INFO
    }),
    finishAlterInfo: () => ({
        type: types.FINISH_ALTER_INFO
    }),
    selectShop_shopManagement: (shopId) => ({
        type: types.SHOPMANAGEMENT_SELECT_SHOP,
        shopId_shopManagement: shopId
    }),
    setAddButtonVisible: () => ({
        type: types.SHOPMANAGEMENT_ADD_BUTTON_VISIBLE
    }),
    setAddButtonInvisible: () => ({
        type: types.SHOPMANAGEMENT_ADD_BUTTON_INVISIBLE
    }),
    openModal: () => ({
        type: types.OPEN_MODAL
    }),
    closeModal: () => ({
        type: types.CLOSE_MODAL
    }),
    showModalLoading: () => ({
        type: types.SHOW_MODAL_LOADING
    }),
    hideModalLoading: () => ({
        type: types.HIDE_MODAL_LOADING
    })
};

//reducers
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_CLIENT_SIZE:
            return { ...state, clientHeight: action.clientHeight, clientWidth: action.clientWidth };
        case types.START_COUNT_DOWN:
            return { ...state, countDown: action.countDown };
        case types.FINISH_COUNT_DOWN:
            return { ...state, countDown: totalCountDown };
        case types.OPEN_MESSAGE_DRAWER:
            return { ...state, openMessageDrawer: true };
        case types.CLOSE_MESSAGE_DRAWER:
            return { ...state, openMessageDrawer: false };
        case types.START_ALTER_INFO:
            return { ...state, alterInfo: true };
        case types.FINISH_ALTER_INFO:
            return { ...state, alterInfo: false };
        case types.SHOPMANAGEMENT_SELECT_SHOP:
            return { ...state, shopId_shopManagement: action.shopId_shopManagement };
        case types.SHOPMANAGEMENT_ADD_BUTTON_VISIBLE:
            return { ...state, addButtonVisible_shopManagement: true };
        case types.SHOPMANAGEMENT_ADD_BUTTON_INVISIBLE:
            return { ...state, addButtonVisible_shopManagement: false };
        case types.OPEN_MODAL:
            return { ...state, modalVisible: true };
        case types.CLOSE_MODAL:
            return { ...state, modalVisible: false };
        case types.SHOW_MODAL_LOADING:
            return { ...state, modalLoading: true };
        case types.HIDE_MODAL_LOADING:
            return { ...state, modalLoading: false };
        default:
            return state;
    }
};

export default reducer;

//selector
export const getClientWidth = (state) => state.ui.clientWidth;
export const getClientHeight = (state) => state.ui.clientHeight;
export const getCountDown = (state) => state.ui.countDown;
export const getMessageDrawerState = (state) => state.ui.openMessageDrawer;
export const getAlterInfoState = (state) => state.ui.alterInfo;
export const getShopId_shopManagement = (state) => state.ui.shopId_shopManagement;
export const getAddButtonVisible_shopManagement = (state) => state.ui.addButtonVisible_shopManagement;
export const getModalVisible = (state) => state.ui.modalVisible;
export const getModalLoading = (state) => state.ui.modalLoading;