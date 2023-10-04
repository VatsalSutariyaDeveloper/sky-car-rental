import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../index.css";
import CustomTextField from './CustomTextField';
import styles from '../../style';
import { radio } from '../../assets';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, Link } from 'react-router-dom';

const UpdateBooking = ({ match }) => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    clientName: '',
    dealerName: '',
    carName: '',
    numberPlate: '',
    price: '',
    destination: '',
    bookingDate: '',
    returnDate: '',
  });
  const [error, setError] = useState({}); // State to hold validation error messages
  useEffect(() => {
    // Fetch the booking data for the specified ID from your Node.js backend
    fetch(`http://localhost:3000/car-booking/${id}`) // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => setFormData(data.data)) // Populate form data with fetched data
      .catch((error) => console.error('Error fetching data:', error));
  }, [id]);
  
  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear the error message when the user starts typing again
    setError({ ...error, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate bookingDate and returnDate
    if (new Date(formData.bookingDate) >= new Date(formData.returnDate)) {
      setError({
        bookingDate: 'Booking date must be before return date.',
      });
      return; // Prevent form submission if validation fails
    }

    try {
      const response = await axios.put(`http://localhost:3000/car-booking/${id}`, formData); // Replace with your actual API endpoint

      console.log(response.data);

      setFormData({
        clientName: '',
        dealerName: '',
        carName: '',
        numberPlate: '',
        price: '',
        destination: '',
        bookingDate: '',
        returnDate: '',
      });
      // Show a success message using react-toastify or other notification methods
      toast.success('Booking updated successfully');

      // Redirect the user to a different page or perform other actions as needed
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className={`bg-primary ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <div className='p-3 md:p-6 flex'>
            <img src={radio} alt="" className='mr-2' />
            <p className='text-gradient text-lg mt-1 md:mt-0 md:text-2xl uppercase'>Update Booking Form</p>
            <hr />
          </div>
        </div>
      </div>
      <section className="md:h-[30rem] md:flex flex-col justify-center items-center">
        <form onSubmit={handleSubmit}>
          <div className="px-2 pb-5">
            <div className="md:grid md:grid-cols-2 md:gap-2">
              <CustomTextField type="text" label="Name" name="clientName" value={formData.clientName} onChange={handleChange} />
              <CustomTextField type="text" label="Dealer Name" name="dealerName" value={formData.dealerName} onChange={handleChange} />
              <CustomTextField type="text" label="Car Name" name="carName" value={formData.carName} onChange={handleChange} />
              <CustomTextField type="text" label="Number Plate" name="numberPlate" value={formData.numberPlate} onChange={handleChange} />
              <CustomTextField type="number" label="Price" name="price" value={formData.price} onChange={handleChange} />
              <CustomTextField type="text" label="Destination" name="destination" value={formData.destination} onChange={handleChange} />
              <CustomTextField type="date" label="Booking Date" name="bookingDate" value={formData.bookingDate} onChange={handleChange} minDate={new Date().toISOString().split('T')[0]} error={error.bookingDate} />
              <CustomTextField type="date" label="Return Date" name="returnDate" value={formData.returnDate} onChange={handleChange} minDate={new Date().toISOString().split('T')[0]} error={error.returnDate} />
            </div>
            {error.bookingDate && <p className="text-red-500">{error.bookingDate}</p>} {/* Display validation error for bookingDate */}
            {error.returnDate && <p className="text-red-500">{error.returnDate}</p>} {/* Display validation error for returnDate */}
            <div className='flex justify-center'>
              <div className='px-1'>
                <button className='bg-primary text-[#33bbcf] py-2 px-5 mt-5 rounded-md w-full uppercase' type="submit">Update Booking</button>
              </div>
              <div className='px-1'>
                <Link to='/'>
                <button className='bg-primary text-[#33bbcf] py-2 px-5 mt-5 rounded-md w-full uppercase'>Cancel</button>
                </Link>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  )
}

export default UpdateBooking;
