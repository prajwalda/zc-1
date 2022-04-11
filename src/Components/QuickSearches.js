import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../Styles/Home.css";
import QuickSearchItem from './QuickSearchItem';

class QuickSearches extends Component {
  render() {
    const { mealtypesData } = this.props;
    return (
      <React.Fragment>
        <div className="container mb-5">
          <div className="quick-searches mt-5 ms-4">Quick Searches</div>
          <div className="qs-subtitle mt-3 ms-4">
            Discover restaurants by type of meal
          </div>
          <div className="row mt-3">
          {mealtypesData.map(item => {
            return <QuickSearchItem 
            heading={item.name }
            description={item.content}
            image={item.image}
            id={item.meal_type}
            />
          })}

        </div>
             
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(QuickSearches);
