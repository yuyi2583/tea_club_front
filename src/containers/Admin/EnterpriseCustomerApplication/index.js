import React from "react";
import { PageHeader, Button, Modal } from "antd";
import { Route } from "react-router-dom";
import ApplicantionDetail from "./components/ApplicationDetail";
import ApplicantionList from "./components/ApplicantionList";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Highlighter from 'react-highlight-words';
import {
    actions as customerActions, getByEnterpriseBusinessLicense, getByCustomerAvatar,
    getEnterpriseCustomerApplications, getByEnterpriseCustomerApplications
} from "../../../redux/modules/customer";
import { enterpriseCustomerApplicationStatus } from "../../../utils/common";

const { confirm } = Modal;

class EnterpriseCustomerApplication extends React.Component {

    getExtra = () => {
        const { history, match, byEnterpriseCustomerApplications } = this.props;
        let extra = null;
        try {
            if (history.location.pathname.indexOf("/enterprise_customer_application/") != -1) {
                const pathname = history.location.pathname.split("/");
                const uid = pathname[pathname.length - 1];
                if (byEnterpriseCustomerApplications[uid].status == "approve") {
                    extra = <strong>状态：{enterpriseCustomerApplicationStatus["approve"]}</strong>;
                } else if (byEnterpriseCustomerApplications[uid].status == "reject") {
                    extra = <strong>状态：{enterpriseCustomerApplicationStatus["reject"]}</strong>;
                } else {
                    extra = (
                        <span>
                            <Button type="primary" onClick={() => {
                                const thiz = this;
                                confirm({
                                    title: '确认通过?',
                                    content: '企业信息无误，确认通过审核',
                                    onCancel() {
                                    },
                                    onOk() {
                                        thiz.props.approveApplication(uid)
                                            .then(() => {
                                                thiz.props.callMessage("success", "审核通过成功");
                                            })
                                            .catch(err => {
                                                thiz.props.callMessage("error", "操作失败，" + err);
                                            })
                                    }
                                });
                            }}>通过申请</Button>
                            &nbsp;&nbsp;
                            <Button type="danger" onClick={() => {
                                const thiz = this;
                                confirm({
                                    title: '确认新增?',
                                    content: '确认拒绝审核？',
                                    onCancel() {
                                    },
                                    onOk() {
                                        thiz.props.rejectApplication(uid)
                                            .then(() => {
                                                thiz.props.callMessage("success", "拒绝申请成功");
                                            })
                                            .catch(err => {
                                                thiz.props.callMessage("error", "操作失败，" + err);
                                            })
                                    }
                                });
                            }}>拒绝申请</Button>
                        </span>
                    );
                }
            }
        } catch{
            extra = null;
        }
        return extra;
    }

    render() {
        const subTitle = this.props.getSubTitle();
        const extra = this.getExtra();
        const { match } = this.props;
        return (
            <div>
                <PageHeader
                    title="企业用户申请"
                    subTitle={subTitle}
                    onBack={this.props.handleBack}
                    extra={extra}>
                    <Route
                        path={match.url}
                        exact
                        render={props =>
                            <ApplicantionList
                                {...this.props}
                                {...props}
                            />
                        }
                    />
                    <Route
                        path={`${match.url}/enterprise_customer_application/:applicationId`}
                        exact
                        render={props =>
                            <ApplicantionDetail
                                {...this.props}
                                {...props}
                            />
                        }
                    />
                </PageHeader>
            </div>
        )
    }
}


const mapStateToProps = (state, props) => {
    return {
        enterpriseCustomerApplications: getEnterpriseCustomerApplications(state),
        byEnterpriseCustomerApplications: getByEnterpriseCustomerApplications(state),
        byCustomerAvatar: getByCustomerAvatar(state),
        byEnterpriseBusinessLicense: getByEnterpriseBusinessLicense(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(customerActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EnterpriseCustomerApplication);;