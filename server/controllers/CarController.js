const Cars = require('../schema/CarSchama');
const constant = require('../config/Constant');
const CarSchama = require('../schema/CarSchama');

exports.index = async (req, res) => {
  try {
    const car = await Cars.find();
    res.status(200).json({
      message: constant.MSG_FOR_GET_CAR_DATA_SUCCESSFULLY,
      data: car
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.store = async (req, res) => {
  const { carName, numberPlate } = req.body;

  try {
    const existingCar = await Cars.findOne({
      $or: [{ carName }, { numberPlate }],
    });

    if (existingCar) {
      return res.status(400).json({
        message: 'Car name or Number plate already exists.',
      });
    }

    const addCar = await Cars.create({
      carName: carName,
      numberPlate: numberPlate,
    });

    res.status(201).json({
      message: constant.MSG_FOR_BOOKING_SUCCEESFULL,
      data: addCar,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.show = async (req, res) => {
  try {
    const car = await Cars.findById(req.params.id);
    if (!car) {
      res.status(404).json({ message: constant.MSG_FOR_CAR_DATA_NOT_FOUND });
    } else {
      res.status(200).json({
        message: constant.MSG_FOR_GET_CAR_DATA_SUCCESSFULLY,
        data: car
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the existing car by ID
    const existingCar = await Cars.findById(id);

    if (!existingCar) {
      return res.status(404).json({ message: constant.MSG_FOR_CAR_DATA_NOT_FOUND });
    }

    // Check if the updated carName conflicts with existing cars (excluding the current car)
    const { carName } = req.body;
    if (carName !== existingCar.carName) {
      const carWithSameName = await Cars.findOne({ carName });
      if (carWithSameName && carWithSameName._id.toString() !== id) {
        return res.status(400).json({
          message: 'Car with the same car name already exists.',
        });
      }
    }

    // Update the car with the request body
    existingCar.set(req.body);
    const updatedCar = await existingCar.save();

    res.status(200).json({
      message: constant.MSG_FOR_CAR_DATA_UPDATE_SUCCEESFULL,
      data: updatedCar,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCar = await Cars.findByIdAndDelete(id);
    if (!deletedCar) {
      res.status(404).json({ message: constant.MSG_FOR_CAR_DATA_NOT_FOUND });
    } else {
      res.status(200).json({ message: constant.MSG_FOR_CAR_DATA_DELETE_SUCCEESFULL });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.carNames = async (req, res) => {
  try {
    const cars = await Car.find({}, 'carName');
    const carNames = cars.map((car) => car.carName);
    res.status(200).json({
      status: true,
      message: constant.MSG_FOR_GET_CAR_NAMES_SUCCESSFULLY,
      data: carNames,
    });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

exports.numberPlates = async (req, res) => {
  try {
    const cars = await Car.find({}, 'numberPlate');
    const numberPlates = cars.map((car) => car.numberPlate);
    res.status(200).json({
      status: true,
      message: constant.MSG_FOR_GET_NUMBER_PLATES_SUCCESSFULLY,
      data: numberPlates,
    });
  } catch (error) {
    resizeTo.json({ status: false, message: error.message });
  }
};

