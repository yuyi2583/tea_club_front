import React from "react";

class CompanyInfo extends React.Component{

    static getFlag=()=>"company_info";

    render(){
        return(
            <div>CompanyInfo</div>
        )
    }
}

CompanyInfo.flag="company_info";

export default CompanyInfo;