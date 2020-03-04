import { actions as appActions } from "./app";
import url from "../../utils/url";
import { get } from "../../utils/request";
import { requestType } from "../../utils/common";

const initialState = {
    activities: new Array(),
    byActivities: new Object(),
    // activityRules: new Array(),
    byActivityRules: new Object(),
}

export const types = {
    FETCH_ACTIVITIES: "ACTIVITY/FETCH_ACTIVITIES", //
    TERMINAL_ACTIVITY: "ACTIVITY/TERMINAL_ACTIVITY",
};

export const actions = {
    fetchActivities: (reqType = requestType.appRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            return get(url.fetchActivities()).then((data) => {
                dispatch(appActions.finishRequest(reqType));
                if (!data.error) {
                    dispatch(fetchActivitiesSuccess(convetActivitiesToPlainStructure(data.activities)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(data.error));
                    return Promise.reject();
                }
            });
        }
    },
    terminalActivity: (uid, reqType = requestType.appRequest) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(reqType));
            return get(url.terminalActivity()).then((data) => {
                dispatch(appActions.finishRequest(reqType));
                if (!data.error) {
                    dispatch(terminalActivitySuccess(uid));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(data.error));
                    return Promise.reject();
                }
            });
        }
    },
}

const convetActivitiesToPlainStructure = (data) => {
    let activities = new Array();
    let byActivities = new Object();
    let byActivityRules = new Object();
    data.forEach((item) => {
        let activityRules = new Array();
        item.activityRules.forEach((rule) => {
            activityRules.push(rule.uid);
            if (!byActivityRules[rule.uid]) {
                byActivityRules[rule.uid] = rule;
            }
        })
        activities.push(item.uid);
        if (!byActivities[item.uid]) {
            byActivities[item.uid] = { ...item, activityRules };
        }
    });
    return {
        activities,
        byActivities,
        byActivityRules,
    }
}

const terminalActivitySuccess = (uid) => ({
    type: types.TERMINAL_ACTIVITY,
    uid,
})

const fetchActivitiesSuccess = ({ activities, byActivities, byActivityRules }) => ({
    type: types.FETCH_ACTIVITIES,
    activities,
    byActivities,
    byActivityRules,
})

const reducer = (state = initialState, action) => {
    let byActivities;
    switch (action.type) {
        case types.FETCH_ACTIVITIES:
            return { ...state, activities: action.activities, byActivities: action.byActivities, byActivityRules: action.byActivityRules };
        case types.TERMINAL_ACTIVITY:
            // debugger
            byActivities = new Object();
            state.activities.forEach((uid) => {
                if (uid == action.uid) {
                    byActivities[uid] = { ...state.byActivities[uid], enforceTerminal: true };
                } else {
                    byActivities[uid] = state.byActivities[uid];
                }
            })
            return { ...state, byActivities }
        default:
            return state;
    }
}

export default reducer;

export const getActivities = (state) => state.activity.activities;
export const getByActivities = (state) => state.activity.byActivities;
export const getByActivityRules = (state) => state.activity.byActivityRules;
