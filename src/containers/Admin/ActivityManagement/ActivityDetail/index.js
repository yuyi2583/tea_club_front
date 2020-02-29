import React from "react";

class ActivityDetail extends React.Component{
    componentDidMount(){
        console.log("activity detail's match",this.props.match);
        
    }
    render(){
        return(
            <div>ActivityDetail</div>
        );
    }
}

export default ActivityDetail;