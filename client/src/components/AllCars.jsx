import React, { useState, useEffect } from 'react';
import styles from '../style';
import { carimage, deletebtn, edit, carsearch, nodata, addcarcolored } from '../assets';
import { Link, useNavigate } from 'react-router-dom';
import iziToast from 'izitoast';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'izitoast/dist/css/iziToast.min.css';
import useAnimatedLoader from "./Hooks/useAnimatedLoader"


const AllCars = () => {
  const [searchInput, setSearchInput] = useState('');
  const [cars, setCars] = useState([]);
  const [carName, setCarName] = useState('');
  const [numberPlate, setNumberPlate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editCarId, setEditCarId] = useState(null);
  const { loading, startAnimatedLoading, stopAnimatedLoading, Loader } = useAnimatedLoader();
  const navigate = useNavigate();


  const fetchData = () => {
    startAnimatedLoading();
    fetch(`${window.react_app_url}car`)
      .then((response) => response.json())
      .then((data) => {
        setCars(data.data);
        stopAnimatedLoading();
      })
      .catch((error) => {
        toast.error('An error occurred while processing your request.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
        stopAnimatedLoading();
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleCarNameChange = (e) => {
    setCarName(e.target.value);
  };

  const handleNumberPlateChange = (e) => {
    const value = e.target.value.toUpperCase();
    setNumberPlate(value);
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const filteredCars = cars.filter((car) =>
    car.carName.includes(searchInput)
  );

  const deleteCar = (id) => {
    iziToast.question({
      timeout: false,
      close: false,
      overlay: true,
      displayMode: 'once',
      id: 'question',
      zindex: 999,
      title: 'Confirmation',
      message: 'Are you sure you want to delete this user?',
      position: 'center',
      color: 'cyan',
      buttons: [
        [
          '<button><b>Yes</b></button>',
          function (instance, toast) {
            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
            performDelete(id);
          },
          true,
        ],
        [
          '<button>No</button>',
          function (instance, toast) {
            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
          },
        ],
      ],
    });
  };

  const performDelete = async (id) => {
    try {
      await fetch(`${window.react_app_url}car/${id}`, {
        method: 'DELETE',
      });

      setCars((prevCars) => prevCars.filter((car) => car._id !== id));
    } catch (error) {
      toast.error('An error occurred while processing your request.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });    }
  };

  const openEditModal = (id, carName, numberPlate) => {
    setEditCarId(id);
    setCarName(carName);
    setNumberPlate(numberPlate);
    setShowModal(true);
  };

  const handleUpdateCar = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${window.react_app_url}car/${editCarId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ carName, numberPlate }),
      });

      if (response.ok) {
        setCars((prevCars) =>
          prevCars.map((car) =>
            car._id === editCarId
              ? { ...car, carName, numberPlate }
              : car
          )
        );

        setCarName('');
        setNumberPlate('');
        setShowModal(false);

      } else {
        toast.error('Failed to update car', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      }
    } catch (error) {
      toast.error('Error updating car', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  };

  const resetForm = () => {
    setCarName('');
    setNumberPlate('');
    setShowModal(false);
  };

  return (
    <div>
      <div className={`bg-primary`}>
        <section id="home" className={`md:flex-row flex-col ${styles.paddingY}`}>
          <div className={`${styles.flexCenter} flex-col xl:px-0 sm:px-16 pb-4`}>
            <div className="flex flex-row mt-3 md:mt-0 md:mx-0 md:ml-12">
              <div className="relative">
                <img
                  src={carsearch}
                  alt=""
                  className='mx-2 w-6 absolute top-1/2 left-2 transform -translate-y-1/2'
                />
                <input
                  className="bg-transparent text-white py-2 border border-gray-300 text-sm rounded-lg pl-14 pr-3 w-[310px] md:h-[43px]"
                  type="search"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                />
              </div>
            </div>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <Loader key={index} />
              ))}
            </div>
          ) : (
            <div className={`${styles.flexCenter} flex-col xl:px-0 sm:px-16`}>
              {filteredCars.length === 0 ? (
                <div className="">
                  <img src={nodata} alt="" className='md:h-screen h-96 md:-mt-0 sm:-mt-0' />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredCars.map((car) => (
                    <div key={car._id} className="flex justify-center items-center px-3 bg-discount-gradient rounded-[10px]">
                      <table className="text-gradient table-fixed">
                        <tbody>
                          <tr>
                            <td className="px-6 py-4 flex">
                              <img src={carimage} alt="car image" />
                              <span className='font-bold text-lg mx-3 mt-[2px]'>{car.carName.split('').map((char, index) => (
                              index > 0 && index % 10 === 0 ? <br key={index} /> : char
                            ))}</span>
                            </td>
                            <td>
                              <div className='flex justify-end mr-2'>
                                <button
                                  onClick={() =>
                                    openEditModal(car._id, car.carName, car.numberPlate)
                                  }
                                  className='w-7 mr-4 cursor-pointer hover:scale-125 transition duration-300'
                                >
                                  <img src={edit} alt="edit image" className='w-7 mr-4 cursor-pointer hover:scale-125 transition duration-300' />
                                </button>
                                <img
                                  src={deletebtn}
                                  alt="delete image"
                                  className="w-7 cursor-pointer hover:scale-125 transition duration-300"
                                  onClick={() => deleteCar(car._id)}
                                />
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4">Number Plate</td>
                            <td className="px-6 py-4"> {car.numberPlate.split('').map((char, index) => (
                              index > 0 && index % 10 === 0 ? <br key={index} /> : char
                            ))}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {showModal && (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none p-5">
            <div className="relative w-auto my-6 mx-auto max-w-3xl border border-white rounded-lg">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-primary outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="flex text-3xl font-semibold text-gradient">
                    <img src={addcarcolored} alt="" className='w-7' /> &nbsp; Edit Car
                  </h3>
                </div>
                {/* Body */}
                <form onSubmit={handleUpdateCar}>
                  <div className="relative p-6 flex-auto">
                    <input
                      className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
                      type="text"
                      placeholder="Car Name"
                      value={carName}
                      onChange={handleCarNameChange}
                    />
                    <input
                      className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
                      type="text"
                      placeholder="Number plate"
                      value={numberPlate}
                      onChange={handleNumberPlateChange}
                    />
                  </div>
                  {/* Footer */}
                  <div className="flex items-center justify-center p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="w-[150px] mx-2 px-4 py-2 text-black font-bold uppercase rounded text-xs bg-red-300"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </button>
                    <div className="text-center md:text-left">
                      <button
                        className="w-[150px] px-4 py-2 text-black font-bold uppercase rounded text-xs bg-blue-gradient"
                        type="submit"
                      >
                        Update Car
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-70 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </div>
  );
}

export default AllCars;
