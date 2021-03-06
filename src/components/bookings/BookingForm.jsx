import React from 'react'
import { Link, withRouter } from 'react-router-dom';
import 'flatpickr/dist/themes/airbnb.css'
import Flatpickr from 'react-flatpickr'
import bookText from '../../images/fontImages/book.png'
import { history } from '../../index'

class BookingForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      startDate: null,
      endDate: null,
      endDatePossibilities: []
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.updateStartDate = this.updateStartDate.bind(this)
  }

  componentDidMount() {
    this.props.getBookingsByProperty(parseInt(this.props.match.params[0]))
  }

  handleSubmit(event) {
    event.preventDefault()
    
    this.props.postBooking({
      booking: {
        start_date: this.state.startDate,
        end_date: this.state.endDate,
        guest_id: this.props.guestId,
        property_id: this.props.property.id
      }
    })
    .then(madeBooking => {
      history.push(`/bookings/${madeBooking.data.id}`)  // can I just remove the 'book-me' part of the url?
    })
  }

  updateStartDate(startDate) {
    let newStart = new Date(startDate).toJSON().slice(0, 10)
    let newEndDatePoss = [];
    let startPlusOne = startDate.setDate(startDate.getDate()+1)
    let curDate = new Date(startPlusOne);
      
    while (
      ! this.props.conflictDates.includes(curDate.toJSON().slice(0, 10)) &&
      newEndDatePoss.length <= 30  // limit stay to 30 days??
    ) {
      newEndDatePoss.push(new Date(curDate).toJSON().slice(0, 10))

      const nextCur = curDate.setDate(curDate.getDate()+1)
      curDate = new Date(nextCur)
    }

    if (newEndDatePoss.length === 0) {
      // user picked a bad start date...
      // can I put some kind of notice here so they don't think it's broken?
    }
    
    this.setState({ 
      endDatePossibilities: newEndDatePoss,
      startDate: newStart
    })
  }

  render() {
    return (
      <div className="booking-form-parent">
        <div className="app-form booking-form-container">

        </div>

        <Link 
          to={`/properties/${this.props.match.params[0]}`} 
          className="close-form-button"
        >
          X
        </Link>
        
        <form className="booking-form" onSubmit={e => this.handleSubmit(e)}>
          <img className="form-title" src={bookText} alt="Book A Stay"/>

          <label htmlFor="start_date">Start Date</label>
          <Flatpickr
            name="start_date"
            id="start_date"
            value={this.state.startDate}
            onChange={startDate => {
              this.updateStartDate(startDate[0])
            }}
            options={
              // { minDate: new Date().toJSON().slice(0, 10) },
              // * seems like including the disable option
              // * makes the minDate option not do anything
              { disable: this.props.conflictDates }
            }
          />
  
          <label htmlFor="end_date">End Date</label>
          <Flatpickr
            name="end_date"
            id="end_date"
            value={this.state.endDate}
            onChange={endDate => {
              let newEnd = new Date(endDate).toJSON().slice(0, 10)
              this.setState({ endDate: newEnd })
            }}
            options={
              // { minDate: this.state.startDate + 1 },
              { enable: this.state.endDatePossibilities }
            }
          />
  
          <input type="submit" value="Book your stay!"/>
        </form>
      </div>
    )
  }

}

export default withRouter(BookingForm)