import React, { Component } from "react";
import '../Styles/Filter.css'
import axios from "axios";
import queryString from 'query-string'


class Filter extends React.Component {
  constructor() {
      super();
      this.state = {
          restaurants: [],
          locations: [],
          mealtype: undefined,
          location: undefined,
          cuisine: undefined,
          lcost: undefined,
          hcost: undefined,
          sort: 1,
          page: 1,
          pageCount: []
      }
  }

  componentDidMount() {
      const qs = queryString.parse(this.props.location.search);
      const { mealtype, location } = qs;

      const filterObj = {
          mealtype: Number(mealtype),
          location
      };

      axios({
          method: 'POST',
          url: 'http://localhost:4567/filter',
          headers: { 'Content-Type': 'application/json' },
          data: filterObj
      })
          .then(response => {
              this.setState({ restaurants: response.data.restaurants, mealtype, pageCount: response.data.pageCount })
          })
          .catch()

      axios({
          method: 'GET',
          url: 'http://localhost:4567/locations',
          headers: { 'Content-Type': 'application/json' }
      })
          .then(response => {
              this.setState({ locations: response.data.locations })
          })
          .catch()
  }

  handleSortChange = (sort) => {

      const { mealtype, cuisine, location, lcost, hcost, page } = this.state;

      const filterObj = {
          mealtype: Number(mealtype),
          cuisine: cuisine.length == 0 ? undefined : cuisine,
          location,
          lcost,
          hcost,
          sort,
          page
      };

      axios({
          method: 'POST',
          url: 'http://localhost:4567/filter',
          headers: { 'Content-Type': 'application/json' },
          data: filterObj
      })
          .then(response => {
              this.setState({ restaurants: response.data.restaurants, sort, pageCount: response.data.pageCount })
          })
          .catch()
  }

  handleCostChange = (lcost, hcost) => {

      const { mealtype, cuisine, location, sort, page } = this.state;

      const filterObj = {
          mealtype: Number(mealtype),
          cuisine: cuisine.length == 0 ? undefined : cuisine,
          location,
          lcost,
          hcost,
          sort,
          page
      };

      axios({
          method: 'POST',
          url: 'http://localhost:4567/filter',
          headers: { 'Content-Type': 'application/json' },
          data: filterObj
      })
          .then(response => {
              this.setState({ restaurants: response.data.restaurants, lcost, hcost, pageCount: response.data.pageCount })
          })
          .catch()
  }

  handleLocationChange = (event) => {
    const location = event.target.value;

    const { mealtype, cuisine, lcost, hcost, sort, page } = this.state;

    const filterObj = {
        mealtype: Number(mealtype),
        cuisine: cuisine.length == 0 ? undefined : cuisine,
        location,
        lcost,
        hcost,
        sort,
        page
    };

    axios({
        method: 'POST',
        url: 'http://localhost:4567/filter',
        headers: { 'Content-Type': 'application/json' },
        data: filterObj
    })
        .then(response => {
            this.setState({ restaurants: response.data.restaurants, location, pageCount: response.data.pageCount })
        })
        .catch()
}

handlePageChange = (page) => {

  const { mealtype, cuisine, location, lcost, hcost, sort } = this.state;

  const filterObj = {
      mealtype: Number(mealtype),
      cuisine: cuisine.length == 0 ? undefined : cuisine,
      location,
      lcost,
      hcost,
      sort,
      page
  };

  axios({
      method: 'POST',
      url: 'http://localhost:4567/filter',
      headers: { 'Content-Type': 'application/json' },
      data: filterObj
  })
      .then(response => {
          this.setState({ restaurants: response.data.restaurants, page, pageCount: response.data.pageCount })
      })
      .catch()
}

handleCuisineChange = (cuisineId) => {

  const { mealtype, cuisine, location, lcost, hcost, sort, page } = this.state;

  const index = cuisine.indexOf(cuisineId);

  if (index == -1) {
      cuisine.push(cuisineId);
  } else {
      cuisine.splice(index, 1);
  }

  const filterObj = {
      mealtype: Number(mealtype),
      cuisine: cuisine.length == 0 ? undefined : cuisine,
      location,
      lcost,
      hcost,
      sort,
      page
  };

  axios({
      method: 'POST',
      url: 'http://localhost:4567/filter',
      headers: { 'Content-Type': 'application/json' },
      data: filterObj
  })
      .then(response => {
          this.setState({ restaurants: response.data.restaurants, cuisine, pageCount: response.data.pageCount })
      })
      .catch()
}

handleNavigate = (resId) => {
  this.props.history.push(`/details?restaurant=${resId}`);
}

  render() {
    const {restaurants, locations, pageCount} = this.state;
    return (
      <React.Fragment >
        <div className="filter-header" >
          <div className="filter-logo-div mx-5">
            <span className="filter-logo">e!</span>
          </div>
        </div>
        <div className="row container my-4 mx-auto">
          {/* Filter Section */}
          <div
            className="accordion col-12 col-sm-12 col-md-3 col-lg-3 px-3 py-3 mb-3 filter-section"
            id="accordionExample"
          >
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingOne">
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  Filter/Sort
                </button>
              </h2>
              <div
                id="collapseOne"
                class="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">
                  <label className="select-loc-title">Select Location</label>
                  <select className="select-loc" onChange={this.handleLocationChange}>
                  <option value="0">Select</option>
                  {locations.map((item) => {
                        return <option value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                        })}
                  </select>

                  <div>
                    <div className="cuisines-title">Cuisines</div>
                    <div className="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox" onChange={() => this.handleCuisineChange(1)}
                        
                      />
                      <label class="form-check-label" for="defaultCheck1">
                        North Indian
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox" onChange={() => this.handleCuisineChange(2)}
                        
                      />
                      <label class="form-check-label" for="defaultCheck2">
                        South Indian
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox" onChange={() => this.handleCuisineChange(3)}
            
                      />
                      <label class="form-check-label" for="defaultCheck3">
                        Chinese
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox" onChange={() => this.handleCuisineChange(4)}
                        
                      />
                      <label class="form-check-label" for="defaultCheck4">
                        Fast Food
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox" onChange={() => this.handleCuisineChange(5)}
                        
                      />
                      <label class="form-check-label" for="defaultCheck5">
                        Street Food
                      </label>
                    </div>
                  </div>
                  <div>
                    <div className="costfortwo-title">Cost For Two</div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio" onChange={() => this.handleCostChange(1, 500)}
                        name="flexRadioDefault" 
                        id="flexRadioDefault1"
                      />
                      <label class="form-check-label" for="flexRadioDefault1">
                        Less than &#8377;500
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio" onChange={() => this.handleCostChange(500, 1000)}
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                      />
                      <label class="form-check-label" for="flexRadioDefault1">
                        &#8377;500 - &#8377;1000
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio" onChange={() => this.handleCostChange(1000, 1500)}
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                      />
                      <label class="form-check-label" for="flexRadioDefault1">
                        &#8377;1000 - &#8377;1500
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio" onChange={() => this.handleCostChange(1500, 2000)}
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                      />
                      <label class="form-check-label" for="flexRadioDefault1">
                        &#8377;1500 - &#8377;2000
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio" onChange={() => this.handleCostChange(2000, 50000)}
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                      />
                      <label class="form-check-label" for="flexRadioDefault1">
                        &gt; &#8377;2000
                      </label>
                    </div>
                  </div>
                  <div>
                    <div className="sort-title">Sort</div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio" onChange={() => this.handleSortChange(1)}
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                      />
                      <label class="form-check-label" for="flexRadioDefault1">
                        Price low to high
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio" onChange={() => this.handleSortChange(-1)}
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                      />
                      <label class="form-check-label" for="flexRadioDefault1">
                        Price high to low
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-12 col-md-9 col-lg-9 mx-auto results">
           
        { restaurants.length > 0 ? restaurants.map(item => {
          return   <div className="row result-section ms-md-3 mb-3 p-4" 
          onClick={() => this.handleNavigate(item._id)}>
          <div className="col-12 col-sm-12 col-md-6 col-lg-3">
            <img
              className="thumb"
              src={`./${item.image}`}
              alt="Restaurant Thumb"
            />
          </div>
          <div className="col-12 col-sm-12 col-md-6 col-lg-9">
            <h3>{item.name}</h3>
            <h5>{item.locality}</h5>
            <h6>{item.city}</h6>
          </div>
          <hr className="line-break mt-3" />
          <div className="row">
            <div className="col-12 col-sm-12 col-lg-4">
              <table className="table-transparent">
                <thead>
                  <tr>
                    <th scope="row">CUISINES: </th>
                    <td>{item.cuisine.map(cuisineItem => {return `${cuisineItem.name},`})}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">COST FOR TWO:</th>
                    <td>&#8377;{item.min_price}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div> 
        }) : <div className="no-records">No Records Found</div>}
        
            {restaurants.length > 0 ?
            <div className="row">
              <div className="col-12 col-sm-12 my-3 mx-auto text-center">
                <span  className="p-3 border page"> &lt; </span>
                {pageCount.map(pageNo => {
                      return <span className="p-3 border page" onClick={() => this.handlepagechange(pageNo)}>{pageNo}</span>
                  })}
                <span  className="p-3 border page">&gt; </span>
                
              </div> 
            </div>: null }
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Filter;
