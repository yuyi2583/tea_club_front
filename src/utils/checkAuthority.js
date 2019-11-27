import React from "react";
import NoPermission from "../components/NoPermission";

export default function checkAuthority(WrappedComponents){
    return class CheckAuthority extends React.Component{
        constructor(props){
            super(props);
            this.state={
                component:WrappedComponents,
            }
        }

        componentDidMount(){
            const {authority}=this.props;
            console.log("flag in check:"+WrappedComponents.flag)
            console.log(WrappedComponents);
            const filter=authority.filter((permission)=>permission.name===WrappedComponents.flag);
            if(filter.length==0){
                this.setState({component:NoPermission});
            }
        }

        render(){
            const C=this.state.component;
            return <C {...this.props} />;

        }
    }
}