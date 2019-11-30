
const initialState = {
    byClerks: null
};

export const types = {
    FETCH_CLERKS: "CLERK/FETCH_CLERKS",          //获取员工信息
}

export const actions = {
    fetchClerks: (byClerks) => ({
        type: types.FETCH_CLERKS,
        byClerks
    }),
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_CLERKS:
            return { ...state, byClerks: action.byClerks };
        default:
            return state;
    }
}

export default reducer;

export const getClerks = (state) => state.clerk.byClerks;