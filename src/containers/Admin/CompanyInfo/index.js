import React from "react";
import { Descriptions, Input, Button, Row, Col, notification  } from 'antd';
import PageHeader from "../../../components/AdminPageHeader";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions as appActions, getCompanyInfo,getError,getRequestQuantity } from "../../../redux/modules/app";
import { actions as uiActions, getAlterInfoState } from "../../../redux/modules/ui";

class CompanyInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.companyInfo
            // companyName: "",
            // postCode: "",
            // contact: "",
            // websiteName: "",
            // weChatOfficialAccount: "",
            // address: ""
        }
    }
    alterCompanyInfo = () => {
        this.props.startAlterInfo();
    }

    completeAlter = () => {
        const info=this.state;
        for(var key in info){
            if(info[key].length==0){
                notification["error"]({
                    message: '信息缺失',
                    description:
                      '输入框不能为空！！！',
                  });
                return;
            }
        }
        this.props.alterCompanyInfo(info);
    }

    handleChange = (e) => {
        const name = e.target.name;
        this.setState({
            [name]: e.target.value
        })
    }

    render() {
        const { companyInfo, alterInfo,requestQuantity } = this.props;
        return (
            <PageHeader
                title="公司信息"
                toolTip={!alterInfo ? {
                    title: "修改公司信息",
                    icon: "edit",
                    handleClick: this.alterCompanyInfo
                } : null}>
                <div>
                    <Descriptions column={2} bordered>
                        <Descriptions.Item label="公司名称">
                            {!alterInfo ? companyInfo.companyName :
                                <Input value={this.state.companyName} allowClear name="companyName" onChange={this.handleChange} />
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="邮编">
                            {!alterInfo ? companyInfo.postCode :
                                <Input value={this.state.postCode} allowClear name="postCode" onChange={this.handleChange} />
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="联系方式">
                            {!alterInfo ? companyInfo.contact :
                                <Input value={this.state.contact} allowClear name="contact" onChange={this.handleChange} />
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="平台名称">
                            {!alterInfo ? companyInfo.websiteName :
                                <Input value={this.state.websiteName} allowClear name="websiteName" onChange={this.handleChange} />
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="微信公众号">
                            {!alterInfo ? companyInfo.weChatOfficialAccount :
                                <Input value={this.state.weChatOfficialAccount} allowClear name="weChatOfficialAccount" onChange={this.handleChange} />
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="地址">
                            {!alterInfo ? companyInfo.address :
                                <Input value={this.state.address} allowClear name="address" onChange={this.handleChange} />
                            }
                        </Descriptions.Item>
                    </Descriptions>
                    {alterInfo ?
                        <Row style={{ margin: "20px 0" }}>
                            <Col span={12} offset={6}>
                                <Button type="primary" block onClick={this.completeAlter} loading={requestQuantity>0} >{requestQuantity>0?"":"确认修改"}</Button>
                            </Col>
                        </Row>
                        : null}
                </div>
            </PageHeader>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        companyInfo: getCompanyInfo(state),
        alterInfo: getAlterInfoState(state),
        error:getError(state),
        requestQuantity:getRequestQuantity(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        ...bindActionCreators(appActions, dispatch),
        ...bindActionCreators(uiActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyInfo);