import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../Styles/Home.css";
import WallpaperIm from "../Assets/wallpaper.png";
import axios from 'axios'


class Wallpaper extends React.Component {
  constructor() {
      super();
      this.state = {
          restaurants: [],
          inputText: undefined,
          suggestions: []
      }
  }

  handleLocationChange = (event) => {
      const locationId = event.target.value;
      sessionStorage.setItem('locationId', locationId);

      axios({
          method: 'GET',
          url: `http://localhost:4567/restaurants/${locationId}`,
          headers: { 'Content-Type': 'application/json' }
      })
          .then(response => {
              this.setState({ restaurants: response.data.restaurants, inputText: '' })
          })
          .catch()
  }

  handleSearch = (event) => {
      const { restaurants } = this.state;
      const inputText = event.target.value;

      const suggestions = restaurants.filter(item => item.name.toLowerCase().includes(inputText.toLowerCase()));
      this.setState({ inputText, suggestions });
  }

  selectingRestaurant = (resObj) => {
      this.props.history.push(`/details?restaurant=${resObj._id}`);
  }

  showSuggestion = () => {
      const { suggestions, inputText } = this.state;

      if (suggestions.length == 0 && inputText == undefined) {
          return null;
      }
      if (suggestions.length > 0 && inputText == '') {
          return null;
      }
      if (suggestions.length == 0 && inputText) {
          return <ul >
              <li>No Search Results Found</li>
          </ul>
      }
      return (
          <ul >
              {
                  suggestions.map((item, index) => (<li key={index} onClick={() => this.selectingRestaurant(item)}>{`${item.name} -   ${item.locality},${item.city}`}</li>))
              }
          </ul>
      );

  }


  render() {
    const { locationsData, inputText } = this.props;
    return (
      <div className="container-fluid back-img">
        <div className="row pt-4 mx-auto text-center logo-row">
          <div className="col-12">
            <p className="px-4 py-3 px-md-4 py-md-2 logo">e!</p>
          </div>
        </div>
        <div className="row pt-4 mx-auto text-center restaurant-title-row">
          <div className="col-12">
            <p className="restaurant-title">
              Find the best restaurants, cafés, and bars
            </p>
          </div>
        </div>
        <div className="row pt-4 mx-auto text-center search-bar-row">
          <div className="col-12 col-sm-12 col-md-1 col-lg-2 col-xl-2" />
          <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 mb-4">
            <div className="locationSelector">
              <select className="locationDropdown px-2 py-3" onChange={ this.handleLocationChange }>
              <option value="0">Select</option>
                  {locationsData.map((item) => {
                        return <option value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                        })}
              </select>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-6 col-lg-5 col-xl-5">
            <div className="restaurantSelector" >
              <div id="notebook">
              <input
                id="query"
                className="restaurantsinput ps-5 py-3"
                type="text"
                placeholder="Please Enter Restaurant Name"
                onChange={ this.handleSearch}
              /> 
              {this.showSuggestion()}
              </div>
              <div className="search-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  fill="currentColor"
                  className="bi bi-search "
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-1 col-lg-2 col-xl-2" />
        </div>
      </div>
    );
  }
}

export default withRouter(Wallpaper);
