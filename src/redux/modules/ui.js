export const totalCountDown=5;
const initialState = {
    clientHeight: null,
    clientWidth: null,
    countDown: totalCountDown,
};

//action types
export const types = {
    GET_CLIENT_SIZE: "UI/GET_CLIENT_SIZE",     //获取浏览器宽高
    START_COUNT_DOWN: "UI/START_COUNT_DOWN",    //开始倒计时
    FINISH_COUNT_DOWN: "UI/FINISH_COUNT_DOWN",  //结束倒计时
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
        default:
            return state;
    }
};

export default reducer;

//selector
export const getClientWidth = (state) => state.ui.clientWidth;
export const getClientHeight = (state) => state.ui.clientHeight;
export const getCountDown = (state) => state.ui.countDown;