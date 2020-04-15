import React from "react";
import { Descriptions, Skeleton, Spin, } from "antd";
import { sex } from "../../../../../utils/common";
import PictureDisplay from "../../../../../components/PictrueDispaly";
import { map } from "../../../../../router";
import { Redirect } from "react-router-dom";


class ApplicationDetail extends React.Component {
    state = {
        from: null,
    }

    componentDidMount() {
        const { applicationId } = this.props.match.params;
        this.props.fetchApplication(applicationId).catch(err => {
            this.props.callMessage("error", err);
            this.setState({ from: `${map.admin.AdminHome()}/customer_management/enterprise_customer_applications` });
        });
    }
    render() {
        const { from } = this.state;
        if (from != null) {
            return <Redirect to={from} />;
        }
        let { applicationId } = this.props.match.params;
        const { byCustomerAvatar, byEnterpriseCustomerApplications,
            byEnterpriseBusinessLicense, retrieveRequestQuantity, updateRequestQuantity } = this.props;
        const isDataNull = byEnterpriseCustomerApplications[applicationId] == undefined;
        let applicant;
        let enterprise;
        if (!isDataNull) {
            applicant = byEnterpriseCustomerApplications[applicationId].applicant;
            enterprise = byEnterpriseCustomerApplications[applicationId].enterprise;
        }
        return (
            <div style={{ marginBottom: "20px" }}>
                <Spin spinning={updateRequestQuantity > 0}>
                    {retrieveRequestQuantity > 0 ?
                        <Skeleton active />
                        :
                        <div>
                            <Descriptions bordered column={2} style={{ margin: "10px 0" }}>
                                <Descriptions.Item label="申请人姓名">
                                    {isDataNull ? null : applicant.name}
                                </Descriptions.Item>
                                <Descriptions.Item label="申请人联系方式">
                                    {isDataNull ? null : applicant.contact}
                                </Descriptions.Item>
                                <Descriptions.Item label="申请人邮箱">
                                    {isDataNull ? null : applicant.email}
                                </Descriptions.Item>
                                <Descriptions.Item label="申请人性别">
                                    {isDataNull ? null : sex[applicant.gender]}
                                </Descriptions.Item>
                                <Descriptions.Item label="申请人照片" span={2}>
                                    {
                                        isDataNull ? null : byCustomerAvatar.photo == undefined ? null :
                                            <PictureDisplay photo={byCustomerAvatar.photo} />
                                    }
                                </Descriptions.Item>
                            </Descriptions>
                            <Descriptions bordered column={2} style={{ margin: "10px 0" }}>
                                <Descriptions.Item label="申请公司名称">
                                    {isDataNull ? null : enterprise.name}
                                </Descriptions.Item>
                                <Descriptions.Item label="申请公司联系方式">
                                    {isDataNull ? null : enterprise.contact}
                                </Descriptions.Item>
                                <Descriptions.Item label="申请公司邮箱">
                                    {isDataNull ? null : enterprise.email}
                                </Descriptions.Item>
                                <Descriptions.Item label="申请公司地址">
                                    {isDataNull ? null : enterprise.address}
                                </Descriptions.Item>
                                <Descriptions.Item label="申请公司营业执照" span={2}>
                                    {
                                        isDataNull ? null : byEnterpriseBusinessLicense.photo == undefined ? null :
                                            <PictureDisplay photo={byEnterpriseBusinessLicense.photo} />

                                    }
                                </Descriptions.Item>
                            </Descriptions>
                        </div>
                    }
                </Spin>
            </div >
        );
    }
}

export default ApplicationDetail;