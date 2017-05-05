import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import StripeCheckout from 'react-stripe-checkout';
import GoogleMaps from '../components/GoogleMaps';
import SnypprList from '../components/SnypprList';

const URL = 'http://localhost:3000/nearbySnypprs';
const GMAPURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

class ClientDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nearbySnypprs: [],
      clientAddress: this.props.profile.address,
      clientConverted: '',
    };
  }

  componentDidMount() {
    console.log('profile in dash', this.props.profile);
    this.fetchSnypprs(this.state.clientAddress);
  }
  onToken(token) {
    console.log('token is', { token, snyppr: 'acct_1AFZLMC3YHU2IY7a' });
    axios.post('/transaction', { token, snyppr: 'acct_1AFZLMC3YHU2IY7a' })
     .then((response) => {
       console.log('data is', response);
     });
  }
  fetchSnypprs(address) {
    axios.get(`${URL}/${address}`)
      .then((results) => {
        this.setState({ nearbySnypprs: results });
      })
      .then(() => {
        axios.get(`${GMAPURL}${this.state.clientAddress}`)
          .then((results) => {
            this.setState({ clientConverted: results.data.results[0].geometry.location });
          });
      })
      .catch((err) => {
        console.log('error fucked up ', err);
      });
  }
  render() {
    console.log('client dashboards state ', this.state);
    return (
      <div className="dashboard">
        <div className="clientheader">
          <h1 className="clientheadline">Snyppr</h1>
        </div>
        <div className="dashboard-box">
          <div className="navigation">
            <div className="picturebox">
              <img className="userpic" alt="placeholderimage" src="https://timeforgeography.co.uk/static/img/avatar-placeholder.png" height="100" width="100" />
            </div>
            <div className="navmenu">
              <div className="navmenu-items">Profile</div>
              <div className="navmenu-items">Payment</div>
              <div className="navmenu-items">favorites</div>
              <div className="navmenu-items">reviews</div>
              <div href="#" className="navmenu-items">logout</div>
            </div>
          </div>
          <div className="right-box">
            <GoogleMaps
              clientAddress={this.state.clientConverted}
              snypprs={this.state.nearbySnypprs} google={window.google}
            />
            <SnypprList snypprs={this.state.nearbySnypprs} />
          </div>
          <StripeCheckout
            token={this.onToken}
            stripeKey="pk_test_IhZuZuB7uOy8VF5pg4XA54Df"
            name="Barber"
            description="Cut"
            ComponentClass="div"
            panelLabel="Pay Snyppr"
            amount={1000000}
            currency="USD"
            locale="us"
            email="info@vidhub.co"
          />
        </div>
        <div className="clientfooter" >
          <span className="footerdet">Refer Friends</span>
          <span className="footerdet">About Us</span>
          <span className="footerdet">Become Snyppr</span>
        </div>
      </div>
    );
  }
}

ClientDashboard.propTypes = {
  profile: PropTypes.shape.isRequired,
  //cant put a onclick to div tag for logout
//  logout: PropTypes.func.isRequired,
};

export default ClientDashboard;
