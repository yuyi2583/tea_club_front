import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import { Provider } from "react-redux";
import configureStore from "./redux/configureStore";
import * as serviceWorker from './utils/serviceWorker';
import { ConfigProvider } from "antd";

import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('en');

const store = configureStore();


ReactDOM.render(
    <Provider store={store}>
        <ConfigProvider locale={zhCN}>
            <App />
        </ConfigProvider>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
