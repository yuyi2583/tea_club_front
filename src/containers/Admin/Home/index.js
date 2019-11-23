import React from "react";
import {Link} from "react-router-dom";

class Home extends React.Component {
   
    render() {
      const { location } = this.props;
      return (
        <Link to={{
          pathname: "/login",
          state: { from: location }
        }}>home</Link>
      )
    }
  }
  
  export default Home;