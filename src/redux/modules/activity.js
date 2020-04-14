import { actions as appActions } from "./app";
import url from "../../utils/url";
import { get, post, put, _delete } from "../../utils/request";
import { requestType } from "../../utils/common";

const initialState = {
    activities: new Array(),
    byActivities: new Object(),
    byActivityRules: new Object(),
    activityRuleTypes: new Array(),
    byActivityRuleTypes: new Object(),
    byPhotos: new Object(),
    byMutexActivities: new Object(),
    byActivityApplyForProduct: new Object(),
    byActivityApplyForCustomerTypes: new Object()
}

export const types = {
    FETCH_ACTIVITIES_NAME_DESC: "ACTIVITY/FETCH_ACTIVITIES_NAME_DESC",
    FETCH_ACTIVITY_RULE_TYPES: "ACTIVITY/FETCH_ACTIVITY_RULE_TYPES",
    TERMINAL_ACTIVITY: "ACTIVITY/TERMINAL_ACTIVITY",
    FETCH_ACTIVITIES: "ACTIVITY/FETCH_ACTIVITIES", //
    ADD_ACTIVITY: "ACTIVITY/ADD_ACTIVITY",
    FETCH_ACTIVITY: "ACTIVITY/FETCH_ACTIVITY",
    UPDATE_ACTIVITY: "ACTIVITY/UPDATE_ACTIVITY"
};

export const actions = {
    //获取所有活动的名称和描述
    fetchActivitiesNameDesc: () => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return get(url.fetchActivitiesNameDesc()).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(fetchActivitiesNameDescSuccess(convertActivitiesToPlainStructure(result.data)));
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    //获取所有活动规则类型
    fetchActivityRuleTypes: () => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return get(url.fetchActivityRuleTypes()).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(fetchActivityRuleTypesSuccess(convertActivityRuleTypeToPlainStructure(result.data)));
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    //新增活动
    addActivity: (activity) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            const params = { ...activity };
            return post(url.addActivity(), params).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {//TODO
                    dispatch(addActivitySuccess());
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            })
        }
    },
    //获取所有活动信息列表
    fetchActivities: () => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return get(url.fetchActivities()).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(fetchActivitiesSuccess(convertActivitiesToPlainStructure(result.data)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            });
        }
    },
    //终止活动
    terminalActivity: (uid) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return _delete(url.terminalActivity(uid)).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(terminalActivitySuccess(uid));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            });
        }
    },
    //根据uid获取活动详细数据
    fetchActivity: (uid) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return get(url.fetchActivity(uid)).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(fetchActivitySuccess(convertActivityToPlainStructure(result.data)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    return Promise.reject(result.error);
                }
            });
        }
    },
    //修改活动信息
    updateActivity: (activity) => {
        return (dispatch) => {
            dispatch(appActions.startRequest(requestType.updateRequest));
            const params = { ...activity };
            return put(url.updateActivity(), params).then((result) => {
                dispatch(appActions.finishRequest(requestType.updateRequest));
                if (!result.error) {
                    dispatch(updateActivitySuccess(convertActivityToPlainStructure(result.data)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.msg));
                    // console.error(result.error);
                    return Promise.reject(result.error);
                }
            });
        }
    },
}

const convertActivitiesToPlainStructure = (data) => {
    let activities = new Array();
    let byActivities = new Object();
    let byActivityRules = new Object();
    data.forEach((item) => {
        let activityRules = new Array();
        try {
            item.activityRules.forEach((rule) => {
                activityRules.push(rule.uid);
                if (!byActivityRules[rule.uid]) {
                    byActivityRules[rule.uid] = rule;
                }
            })
        } catch{
            activityRules = new Array();
        }
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

const fetchActivitiesNameDescSuccess = ({ activities, byActivities, byActivityRules }) => ({
    type: types.FETCH_ACTIVITIES_NAME_DESC,
    activities,
    byActivities,
    byActivityRules
})

const convertActivityRuleTypeToPlainStructure = (data) => {
    let activityRuleTypes = new Array();
    let byActivityRuleTypes = new Object();
    data.forEach(item => {
        activityRuleTypes.push(item.uid);
        if (!byActivityRuleTypes[item.uid]) {
            byActivityRuleTypes[item.uid] = item;
        }
    });
    return {
        activityRuleTypes,
        byActivityRuleTypes
    }
}

const fetchActivityRuleTypesSuccess = ({ activityRuleTypes, byActivityRuleTypes }) => ({
    type: types.FETCH_ACTIVITY_RULE_TYPES,
    activityRuleTypes,
    byActivityRuleTypes
});

const addActivitySuccess = () => ({
    type: types.ADD_ACTIVITY
});


const fetchActivitiesSuccess = ({ activities, byActivities, byActivityRules }) => ({
    type: types.FETCH_ACTIVITIES,
    activities,
    byActivities,
    byActivityRules,
});

const terminalActivitySuccess = (uid) => ({
    type: types.TERMINAL_ACTIVITY,
    uid,
});

const convertActivityToPlainStructure = (data) => {
    let photos = new Array();
    let byPhotos = new Object();
    let mutexActivities = new Array();
    let byMutexActivities = new Object();
    let activityRules = new Array();
    let byActivityRules = new Object();
    let byTotalActivityApplyForProduct = new Object();
    let byTotalActivityApplyForCustomerTypes = new Object();
    data.photos.forEach(photo => {
        photos.push(photo.uid);
        if (!byPhotos[photo.uid]) {
            byPhotos[photo.uid] = photo;
        }
    });
    data.mutexActivities.forEach(mutex => {
        mutexActivities.push(mutex.uid);
        if (!byMutexActivities[mutex.uid]) {
            byMutexActivities[mutex.uid] = mutex;
        }
    });
    data.activityRules.forEach(rule => {
        activityRules.push(rule.uid);
        if (!byActivityRules[rule.uid]) {
            byActivityRules[rule.uid] = rule;
        }
        const { activityApplyForProduct, byActivityApplyForProduct,
            activityApplyForCustomerTypes, byActivityApplyForCustomerTypes } = convertActivityRuleToPlainStructure(rule);
        byActivityRules[rule.uid] = { ...rule, activityApplyForProduct, activityApplyForCustomerTypes };
        byTotalActivityApplyForProduct = { ...byTotalActivityApplyForProduct, ...byActivityApplyForProduct };
        byTotalActivityApplyForCustomerTypes = { ...byTotalActivityApplyForCustomerTypes, ...byActivityApplyForCustomerTypes };
    });
    return {
        activity: { ...data, photos, mutexActivities, activityRules },
        byPhotos,
        byMutexActivities,
        byActivityRules,
        byActivityApplyForProduct: byTotalActivityApplyForProduct,
        byActivityApplyForCustomerTypes: byTotalActivityApplyForCustomerTypes
    }
}

const fetchActivitySuccess = (data) => ({
    type: types.FETCH_ACTIVITY,
    ...data
})

const convertActivityRuleToPlainStructure = (activityRule) => {
    let activityApplyForProduct = new Array();
    let byActivityApplyForProduct = new Object();
    let activityApplyForCustomerTypes = new Array();
    let byActivityApplyForCustomerTypes = new Object();
    activityRule.activityApplyForProduct.forEach(product => {
        activityApplyForProduct.push(product.uid);
        if (!byActivityApplyForProduct[product.uid]) {
            byActivityApplyForProduct[product.uid] = product;
        }
    });
    activityRule.activityApplyForCustomerTypes.forEach(type => {
        activityApplyForCustomerTypes.push(type.uid);
        if (!byActivityApplyForCustomerTypes[type.uid]) {
            byActivityApplyForCustomerTypes[type.uid] = type;
        }
    });
    return {
        activityApplyForProduct,
        byActivityApplyForProduct,
        activityApplyForCustomerTypes,
        byActivityApplyForCustomerTypes
    }
}

const updateActivitySuccess = (data) => ({
    type: types.UPDATE_ACTIVITY,
    ...data
})


const reducer = (state = initialState, action) => {
    let activities;
    let byActivities;
    switch (action.type) {
        case types.UPDATE_ACTIVITY:
        case types.FETCH_ACTIVITY:
            activities=state.activities;
            if(state.activities.indexOf(action.activity.uid)==-1){
                activities.push(action.activity.uid);
            }
            byActivities = { ...state.byActivities, [action.activity.uid]: action.activity };
            return {
                ...state, byActivities, byPhotos: action.byPhotos, byMutexActivities: action.byMutexActivities,
                byActivityRules: action.byActivityRules, byActivityApplyForProduct: action.byActivityApplyForProduct, byActivityApplyForCustomerTypes: action.byActivityApplyForCustomerTypes
            };
        case types.FETCH_ACTIVITY_RULE_TYPES:
            return { ...state, activityRuleTypes: action.activityRuleTypes, byActivityRuleTypes: action.byActivityRuleTypes };
        case types.TERMINAL_ACTIVITY:
            byActivities = new Object();
            state.activities.forEach((uid) => {
                if (uid == action.uid) {
                    byActivities[uid] = { ...state.byActivities[uid], enforceTerminal: true };
                } else {
                    byActivities[uid] = state.byActivities[uid];
                }
            })
            return { ...state, byActivities }
        case types.FETCH_ACTIVITIES_NAME_DESC:
        case types.FETCH_ACTIVITIES:
        case types.ALTER_ACTIVITY:
            return { ...state, activities: action.activities, byActivities: action.byActivities, byActivityRules: action.byActivityRules };
        default:
            return state;
    }
}

export default reducer;

export const getActivities = (state) => state.activity.activities;
export const getByActivities = (state) => state.activity.byActivities;
export const getByActivityRules = (state) => state.activity.byActivityRules;
export const getActivityRuleTypes = (state) => state.activity.activityRuleTypes;
export const getByActivityRuleTypes = (state) => state.activity.byActivityRuleTypes;
export const getByActivityPhotos = (state) => state.activity.byPhotos;
export const getByMutexActivities = (state) => state.activity.byMutexActivities;
export const getByActivityApplyForProduct = (state) => state.activity.byActivityApplyForProduct;
export const getByActivityApplyForCustomerTypes = (state) => state.activity.byActivityApplyForCustomerTypes;
