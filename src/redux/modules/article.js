import url from "../../utils/url";
import { get, put, post, _delete } from "../../utils/request";
import { requestType,fetchTimeRange,fetchArticleStatus } from "../../utils/common";
import { callNotification } from "../../utils/commonUtils";
import { actions as appActions } from "./app";

const initialState = {
    tags: new Array(),
    byTags: new Object(),
    articles: new Array(),
    byArticles: new Object()
}

//action types
export const types = {
    FETCH_TAGS: "ARTICLE/FETCH_TAGS",
    ADD_TAG: "ARTICLE/ADD_TAG",
    ADD_ARTICLE: "ARTICLE/ADD_ARTICLE",
    FETCH_ARTICLES: "ARTICLE/FETCH_ARTICLES",
    TERMINAL_ARTICLE: "ARTICLE/TERMINAL_ARTICLE",
};

//action creators
export const actions = {
    //获取文章标签列表
    fetchTags: () => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return get(url.fetchTags()).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(fetchTagsSuccess(convertTagsToPlainStructure(result.data)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.error));
                    return Promise.reject(result.error);
                }
            });
        }
    },
    //新增文章标签
    addTag: (tag) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            const params = { name: tag };
            return post(url.addTag(), params).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(addTagSuccess((result.data)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.error));
                    return Promise.reject(result.error);
                }
            });
        }
    },
    //新增文章
    addArticle: (article) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            const params = { ...article };
            return post(url.addArticle(), params).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(addArticleSuccess());
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.error));
                    return Promise.reject(result.error);
                }
            });
        }
    },
    //根据条件获取文章列表
    fetchArticles: (status = fetchArticleStatus.valid, timeRange = fetchTimeRange.last3Months()) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return get(url.fetchArticles(status,timeRange)).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(fetchArticlesSuccess(convertArticlesToPlainStructure(result.data)));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.error));
                    return Promise.reject(result.error);
                }
            });
        }
    },
    //将文章失效不再展示
    terminalArticle: (uid) => {
        return (dispatch) => {
            dispatch(appActions.startRequest());
            return _delete(url.terminalArticle(uid)).then((result) => {
                dispatch(appActions.finishRequest());
                if (!result.error) {
                    dispatch(terminalArticleSuccess(uid));
                    return Promise.resolve();
                } else {
                    dispatch(appActions.setError(result.error));
                    return Promise.reject(result.error);
                }
            });
        }
    }

}

const convertTagsToPlainStructure = (data) => {
    let tags = new Array();
    let byTags = new Object();
    data.forEach(tag => {
        tags.push(tag.uid);
        if (!byTags[tag.uid]) {
            byTags[tag.uid] = tag;
        }
    });
    return {
        tags,
        byTags,
    }
}

const fetchTagsSuccess = ({ tags, byTags }) => ({
    type: types.FETCH_TAGS,
    tags,
    byTags
})

const addTagSuccess = (tag) => ({
    type: types.ADD_TAG,
    tag
})

const addArticleSuccess = () => ({
    type: types.ADD_ARTICLE
})

const convertArticlesToPlainStructure = (data) => {
    let articles = new Array();
    let byArticles = new Object();
    let byTags = new Object();
    data.forEach(article => {
        let tags = new Array();
        articles.push(article.uid);
        article.tags.forEach(tag => {
            tags.push(tag.uid);
            if (!byTags[tag.uid]) {
                byTags[tag.uid] = tag;
            }
        });
        if (!byArticles[article.uid]) {
            byArticles[article.uid] = { ...article, tags };
        }
    });
    return {
        articles,
        byArticles,
        byTags
    }
}

const fetchArticlesSuccess = ({ articles, byArticles, byTags }) => ({
    type: types.FETCH_ARTICLES,
    articles,
    byArticles,
    byTags
})

const terminalArticleSuccess = (uid) => ({
    type: types.TERMINAL_ARTICLE,
    uid
})

//reducers
const reducer = (state = initialState, action) => {
    let articles;
    let byArticles;
    let tags;
    let byTags;
    switch (action.type) {
        case types.FETCH_TAGS:
            return { ...state, tags: action.tags, byTags: action.byTags };
        case types.ADD_TAG:
            tags = state.tags.concat([action.tag.uid]);
            byTags = { ...state.byTags, [action.tag.uid]: action.tag };
            return { ...state, tags, byTags };
        case types.FETCH_ARTICLES:
            return { ...state, articles: action.articles, byArticles: action.byArticles, byTags: action.byTags };
        case types.TERMINAL_ARTICLE:
            byArticles = { ...state.byArticles, [action.uid]: { ...state.byArticles[action.uid], enforceTerminal: true } };
            return { ...state, byArticles };
        default:
            return state;
    }
}

export default reducer;

//selectors
export const getTags = (state) => state.article.tags;
export const getByTags = (state) => state.article.byTags;
export const getArticles = (state) => state.article.articles;
export const getByArticles = (state) => state.article.byArticles;