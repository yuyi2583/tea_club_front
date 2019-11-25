export const totalCountDown = 5;
const initialState = {
    clientHeight: null,
    clientWidth: null,
    countDown: totalCountDown,
    openMessageDrawer: false,
};

//action types
export const types = {
    GET_CLIENT_SIZE: "UI/GET_CLIENT_SIZE",             //获取浏览器宽高
    START_COUNT_DOWN: "UI/START_COUNT_DOWN",           //开始倒计时
    FINISH_COUNT_DOWN: "UI/FINISH_COUNT_DOWN",         //结束倒计时
    OPEN_MESSAGE_DRAWER: "UI/OPEN_MESSAGE_DRAWER",     //打开消息抽屉
    CLOSE_MESSAGE_DRAWER: "UI/CLOSE_MESSAGE_DRAWER",    //关闭消息抽屉
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