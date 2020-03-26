import { activityStatus } from "../../../../utils/common";

export const judgeStatus = (activity) => {
    if (!activity) {
        return null;
    }
    let time = new Date().getTime();
    let status = activityStatus["upcoming"];
    if (time > activity.startTime && time < activity.endTime) {
        status = activityStatus["ongoing"];
    } else if (time > activity.endTime) {
        status = activityStatus["expired"];
    }
    if (activity.enforceTerminal) {
        status = activityStatus["expired"];
    }
    return status;
}