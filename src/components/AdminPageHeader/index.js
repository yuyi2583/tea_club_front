import React from "react";
import PropTypes from "prop-types";
import { PageHeader, Icon, Tooltip, Empty } from 'antd';

function AdminPageHeader({ title, children, toolTip }) {
    return (
        <PageHeader
            title={title}
            tags={toolTip ?
                <Tooltip title={toolTip.title}>
                    <Icon type={toolTip.icon} onClick={toolTip.handleClick} />
                </Tooltip> :
                null
            }>
            {children}
        </PageHeader>
    )
}

AdminPageHeader.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.element,
    toolTip: PropTypes.shape({
        title: PropTypes.string,
        icon: PropTypes.string,
        handleClick: PropTypes.func
    })
}

AdminPageHeader.defaultProps = {
    children: <Empty />,
    toolTip: null
}

export default AdminPageHeader;