import React from "react";
import { Descriptions, Skeleton, Spin, } from "antd";
import { sex } from "../../../../../utils/common";
import PictureDisplay from "../../../../../components/PictrueDispaly";


class ApplicationDetail extends React.Component {

    componentDidMount() {
        const { applicationId } = this.props.match.params;
        this.props.fetchApplication(applicationId);
    }
    render() {
        let { applicationId } = this.props.match.params;
        const { byCustomerAvatar, byEnterpriseCustomerApplications,
            byEnterpriseBusinessLicense, retrieveRequestQuantity, updateRequestQuantity } = this.props;
        const { applicant, enterprise } = byEnterpriseCustomerApplications[applicationId];
        return (
            <div style={{ marginBottom: "20px" }}>
                <Spin spinning={updateRequestQuantity > 0}>
                    {retrieveRequestQuantity > 0 ?
                        <Skeleton active />
                        :
                        <div>
                            <Descriptions bordered column={2} style={{ margin: "10px 0" }}>
                                <Descriptions.Item label="申请人姓名">
                                    {applicant.name}
                                </Descriptions.Item>
                                <Descriptions.Item label="申请人联系方式">
                                    {applicant.contact}
                                </Descriptions.Item>
                                <Descriptions.Item label="申请人邮箱">
                                    {applicant.email}
                                </Descriptions.Item>
                                <Descriptions.Item label="申请人性别">
                                    {sex[applicant.gender]}
                                </Descriptions.Item>
                                <Descriptions.Item label="申请人照片" span={2}>
                                    {
                                        byCustomerAvatar.photo == undefined ? null :
                                            <PictureDisplay photo={byCustomerAvatar.photo} />
                                    }
                                </Descriptions.Item>
                            </Descriptions>
                            <Descriptions bordered column={2} style={{ margin: "10px 0" }}>
                                <Descriptions.Item label="申请公司名称">
                                    {enterprise.name}
                                </Descriptions.Item>
                                <Descriptions.Item label="申请公司联系方式">
                                    {enterprise.contact}
                                </Descriptions.Item>
                                <Descriptions.Item label="申请公司邮箱">
                                    {enterprise.email}
                                </Descriptions.Item>
                                <Descriptions.Item label="申请公司地址">
                                    {enterprise.address}
                                </Descriptions.Item>
                                <Descriptions.Item label="申请公司营业执照" span={2}>
                                    {
                                        byEnterpriseBusinessLicense.photo == undefined ? null :
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