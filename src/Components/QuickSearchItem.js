import React from "react";
import { withRouter } from "react-router-dom";

class QuickSearchItem extends React.Component{
  
  handleNavigate = (mealtypeId) => {
    const locationId = sessionStorage.getItem('locationId');
    if (locationId) {
        this.props.history.push(`/filter?mealtype=${mealtypeId}&location=${locationId}`);
    } else {
        this.props.history.push(`/filter?mealtype=${mealtypeId}`);
    }
}

      render(){
        const {heading, description, image, id} = this.props;
        return(
            
            <div className="card col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 col-xxl-4 my-3 mx-auto text-center" 
            onClick={() => this.handleNavigate(id)}>
              <div className="row">
                <div className="col-6 px-0 mx-0">
                  <img src={`./${image}`} height="160" width="140"
                  />
                </div>
                <div className="col-6 px-3 py-3">
                  <div className="card-title">
                      {heading}
                  </div>
                  <div className="card-description">
                    {description}
                  </div>
              </div>
            </div>
            </div>
        )
    }
}

export default withRouter(QuickSearchItem);