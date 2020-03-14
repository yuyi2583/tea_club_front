import {actions as appActions} from "./app";
import {post} from "../../utils/request";
import url from "../../utils/url";

const initialState = {
   
};

//action types
export const types = {
   UPLOAD_PHOTO:"PHOTO/UPLOAD_PHOTO",
};

//action creators
export const actions = {
    uploadPhoto:(file)=>{
        return (dispatch) => {
            // dispatch(appActions.startRequest());
            const params={file}
            return post(url.uploadPhoto(),params).then((result) => {
                console.log("upload file result",result);
                return Promise.resolve();
                // dispatch(appActions.finishRequest());
                // if (!result.error) {
                //     dispatch(fetchShopsSuccess(convertShopsToPlainStructure(result.data)));
                // } else {
                //     dispatch(appActions.setError(result.error.msg));
                //     return Promise.reject(result.error);
                // }
            })
        }
    }
};

//reducers
const reducer = (state = initialState, action) => {
    switch (action.type) {
        
        default:
            return state;
    }
};

export default reducer;
