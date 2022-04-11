import React, { Component } from "react";
import { Tabs, TabPanel , Tab, TabList} from 'react-tabs'
import queryString from 'query-string';
import axios from 'axios';
import '../Styles/details.css';
import Modal from 'react-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';


const customStyles = {
    content: {
        position: 'absolute',
        inset: '50% auto auto 50%',
        border: '1px solid brown',
        background: 'white',
        overflow: 'auto',
        borderRadius: '4px',
        outline: 'none',
        padding: '20px',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: "763px",
        height: '-webkit-fill-available'
        
    },
};

const Danger = {
  content: {
    'width': '547px',
    'height': 'auto'
  }
}


class Details extends Component {
    constructor() {
        super();
        this.state = {
            restaurant: {},
            menuItems: [],
            menuItemsModalIsOpen: false,
            galleryModelIsOpen: false,
            formModalIsOpen: false,
            subTotal: 0,
            name: undefined,
            contactNumber : undefined,
            email : undefined,
            address : undefined,
        }
    }
    
    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const { restaurant } = qs;

        axios({
            method: 'GET',
            url: `http://localhost:4567/restaurant/${restaurant}`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ restaurant: response.data.restaurant })
            })
            .catch()
    }

    handleOrder = (resId) => {
        axios({
            method: 'GET',
            url: `http://localhost:4567/menuitems/${resId}`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ menuItems: response.data.menuItems, menuItemsModalIsOpen: true })
            })
            .catch()
    }

    handleModal = (state, value) => {
        this.setState({ [state]: value })
    }

    handleInputChange = (state , event) => {
      this.setState({ [state]: event.target.value})  
    }
 
    //event.target.value->  is the syntax to capture the value of an input field
    addItems = (index, operationType) => {
        let total = 0;
        // Spread Operator - Copy of Reference Types
        const items = [...this.state.menuItems];
        const item = items[index];

        if (operationType == 'add') {
            item.qty++;
        }
        else {
            item.qty--;
        }
        items[index] = item;
        items.map((item) => {
            total += item.qty * item.price;
        })
        this.setState({ menuItems: items, subTotal: total });
    }
  
    isDate(val) {
      // Cross realm comptatible
      return Object.prototype.toString.call(val) === '[object Date]'
  }

  isObj = (val) => {
      return typeof val === 'object'
  }

  stringifyValue = (val) => {
      if (this.isObj(val) && !this.isDate(val)) {
          return JSON.stringify(val)
      } else {
          return val
      }
  }

    buildForm = ({ action, params }) => {
      const form = document.createElement('form')
      form.setAttribute('method', 'post')
      form.setAttribute('action', action)

      Object.keys(params).forEach(key => {
          const input = document.createElement('input')
          input.setAttribute('type', 'hidden')
          input.setAttribute('name', key)
          input.setAttribute('value', this.stringifyValue(params[key]))
          form.appendChild(input)
      })
      return form
  }

    post = (details) => {
      const form = this.buildForm(details)
      document.body.appendChild(form)
      form.submit()
      form.remove()
  } 
    getData = (data) => {
      return fetch(`http://localhost:4567/payment`, {
          method: "POST",
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
      }).then(response => response.json()).catch(err => console.log(err))
  }

    handlePayment = (event) => {

      const { subTotal, email } = this.state;

      if (!email) {
          alert('Please fill this field and then Proceed...');
      }
      else {
          // Payment API Call 
          const paymentObj = {
              amount: subTotal,
              email: email
          };

          this.getData(paymentObj).then(response => {
              var information = {
                  action: "https://securegw-stage.paytm.in/order/process",
                  params: response
              }
              this.post(information)
          })
      }
      event.preventDefault();
  }

  render() {
    const { restaurant, menuItems, menuItemsModalIsOpen, subTotal , galleryModelIsOpen, formModalIsOpen } = this.state;
    return (
      <div className="mb-5">
        <div className="filter-header">
          <div className="filter-logo-div mx-5">
            <span className="filter-logo">e!</span>
          </div>
        </div>
        <div className="px-5">
          <img
            src={`./${restaurant.image}`} 
            alt="No Image, Sorry for the Inconvinience" height="300px"
          />
          <button class="gallery-button py-2" 
            onClick={() => this.handleModal('galleryModelIsOpen', true)}>
            Click to see Image Gallery
          </button>
        </div>

        <div className="px-5 pt-5">
          <div class="h1 mt-3">
            {restaurant.name}
            <button className="btn btn-danger btn" 
            onClick={() => this.handleOrder(restaurant._id)}>Place Online Order</button>
          </div>
          <div class="tabs">
            <Tabs>
              <TabList className="TabList">
                <Tab>Overview</Tab>
                <Tab>Contact</Tab>
              </TabList>
              <hr className="tabline" />
              <TabPanel className="Details">
                <h2 class="about">About the place</h2>
                <h4 class="head">Cuisine</h4>
                <h6 class="value">{restaurant && restaurant.cuisine && restaurant.cuisine.map((item) => { return `${item.name}, ` })}</h6>
                <h4 class="head">Average Cost</h4>
                <h6 class="value">&#8377; {restaurant.min_price} for two people(approx)</h6>
              </TabPanel>
              <TabPanel>
                <h4 class="head">Phone Number</h4>
                <h6 class="value">{restaurant.contact_number}</h6>
                <h4 class="head">Address</h4>
                <h6 class="value">{`${restaurant.locality}, ${restaurant.city}`}</h6>
              </TabPanel>
            </Tabs>
          </div>
        </div>
        <Modal
                    isOpen={menuItemsModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        
                        <div class="container-float" style={{ float: 'right', marginBottom: '10px' ,fontWeight: 'bolder'}}
                            onClick={() => this.handleModal('menuItemsModalIsOpen', false)}>X</div>
                        <div >
                            <h3 className="restaurant-name">{restaurant.name}</h3>
                            <h3 className="item-total">SubTotal : {subTotal}</h3>
                            <button className="btn btn-danger order-button"
                                onClick={() => {
                                    this.handleModal('menuItemsModalIsOpen', false);
                                    this.handleModal('formModalIsOpen', true);
                                }}> Pay Now</button>
                            {menuItems.map((item, index) => {
                                return <div style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', borderBottom: '2px solid #dbd8d8' }}>
                                    <div className="card" style={{ width: '43rem', margin: 'auto' }}>
                                        <div className="row" style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                            <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 " style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                                <span className="card-body">
                                                    <h5 className="item-name">{item.name}</h5>
                                                    <h5 className="item-price">&#8377;{item.price}</h5>
                                                    <p className="item-descp">{item.description}</p>
                                                </span>
                                            </div>
                                            <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                                                <img className="card-img-center title-img" src={`../${item.image}`} style={{
                                                    height: '75px',
                                                    width: '75px',
                                                    borderRadius: '20px',
                                                    marginTop: '12px',
                                                    marginLeft: '3px'
                                                }} />
                                                {item.qty == 0 ? <div>
                                                    <button className="add-button" onClick={() => this.addItems(index, 'add')}>Add</button>
                                                </div> :
                                                    <div className="add-number">
                                                        <button onClick={() => this.addItems(index, 'subtract')}>-</button>
                                                        <span class="qty">{item.qty}</span>
                                                        <button onClick={() => this.addItems(index, 'add')}>+</button>
                                                    </div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}
                            <div className="card" style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', margin: 'auto' }}>

                            </div>
                        </div>
                    </div>
                </Modal>
                <Modal
                  isOpen={galleryModelIsOpen}
                  style={customStyles}
              > 
              <div>
              <div class="container-float" style={{ float: 'right', marginBottom: '10px' ,fontWeight: 'bolder'}}
                            onClick={() => this.handleModal('galleryModelIsOpen', false)}>X</div>
                <Carousel>
                <div>
                       {restaurant&& restaurant.thumb && restaurant.thumb.map(item => {
                        return <div>
                          <img src={`./${item}`} />
                        </div>
                      })}
                </div>
                </Carousel>       
              </div>
                </Modal>
                <Modal
                  isOpen={formModalIsOpen}
                  style={Danger}
              > 
              <div>
              <div class="container-float" style={{ float: 'right', marginBottom: '10px' ,fontWeight: 'bolder' }}
                            onClick={() => this.handleModal('formModalIsOpen', false)}>X</div>
                   <form style={customStyles}>
                            <label class="form-label">Name</label>
                            <input style={{ width: '400px' }} type="text" class="form-control" onChange={(event) => this.handleInputChange('name', event)} />
                            <label class="form-label">Email</label>
                            <input type="text" class="form-control" onChange={(event) => this.handleInputChange('email', event)} />
                            <label class="form-label">Contact Number</label>
                            <input type="text" class="form-control" onChange={(event) => this.handleInputChange('contactNumber', event)} />
                            <label class="form-label">Address</label>
                            <input type="text" class="form-control" onChange={(event) => this.handleInputChange('address', event)} />
                            <button class="btn btn-danger" style={{ marginTop: '20px', float: 'right' }} onClick={this.handlePayment}>Proceed</button>
                        </form>
              </div>
                </Modal>
      </div>
    );
  }
}

export default Details;
