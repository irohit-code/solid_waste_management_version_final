const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const moment = require('moment');

const url = 'mongodb://localhost:27017/solidv2';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));



////////////////////////////// SCHEMA /////////////////////////////////////

//CITIZEN

const citizenSchema = new mongoose.Schema({
    Name: {
      type: String,
      required: true
    },
    Address: {
      type: String,
      required: true
    },
    ContactNumber: {
      type: String,
      required: true,
      unique: true
    },
    Email: {
      type: String,
      required: true,
      unique: true
    },
    Password: {
      type: String,
      required: true
    }
  });
  
  const Citizen = mongoose.model('Citizen', citizenSchema);
// REQUEST
const requestSchema = new mongoose.Schema({
  CitizenName: {
    type: String,
    required: true
  },
  ContactNumber: {
    type: String,
    required: true
  },
  Address: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true
  },
  Date: {
    type: Date,
    required: true
  },
  Time: {
    type: String,
    required: true
  },
  Status: {
    type: String,
    default: 'Not Collected'
  },
  AssignedStatus: {
    type: String,
    default: 'Not Assigned'
  }
});
const Request = mongoose.model('Request', requestSchema);

//HEAD
const headSchema = new mongoose.Schema({
  Name: {
      type: String,
      required: true
  },
  Email: {
      type: String,
      required: true,
      unique: true
  },
  Password: {
      type: String,
      required: true
  },
  ContactNumber: {
      type: String,
      required: true,
      unique: true
  },
  Address: {
      type: String,
      required: true
  }
});

const Head = mongoose.model('Head', headSchema);

//////////////////////////////////////////////////////////////////////////////
// REGISTER CITIZEN

app.post('/api/citizen/register', async (req, res) => {
    try {
      const { Name, Address, ContactNumber, Email, Password } = req.body;
  
      const existingCitizen = await Citizen.findOne({ $or: [{ Email }, { ContactNumber }] });
      if (existingCitizen) {
        return res.status(400).json({ error: 'Email or Contact Number already registered.' });
      }
  
      const newCitizen = new Citizen({
        Name,
        Address,
        ContactNumber,
        Email,
        Password
      });
  
      await newCitizen.save();
  
      res.status(201).json({ message: 'Registration successful.' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while registering citizen.' });
    }
  });


// LOGIN //

app.post('/api/login', async (req, res) => {
    try {
      const { Email, Password, role } = req.body;
  
      if (!Email || !Password) {
        return res.status(400).json({ error: 'Please provide both email and password' });
      }
  
      let UserModel;
  
      switch (role) {
        case 'Citizen':
          UserModel = Citizen;
          break;
  
        default:
          return res.status(400).json({ error: 'Invalid role' });
      }
  
      const user = await UserModel.findOne({ Email, Password });
  
      if (user) {
        return res.status(200).json({ message: 'Login successful' });
      } else {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
    } catch (error) {
      console.error('Login Error:', error);
      return res.status(500).json({ error: 'An error occurred while logging in' });
    }
  });

//////////////////////////// CITIZEN DASHBOARD

app.get('/api/citizen/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const citizen = await Citizen.findOne({ Email: email }); 
    if (!citizen) {
      return res.status(404).json({ error: 'Citizen not found' });
    }
    res.json({
      name: citizen.Name,
      contactNumber: citizen.ContactNumber,
      address: citizen.Address
    });
  } catch (error) {
    console.error('Error fetching citizen details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

//REQUEST GARBAGE
app.post('/api/request-garbage', async (req, res) => {
  try {
      const existingRequest = await Request.findOne({ Date: req.body.Date, Time: req.body.Time });
      if (existingRequest) {
          return res.status(400).json({ message: 'A request for this date and time already exists.' });
      }

      const newRequest = new Request({
          CitizenName: req.body.CitizenName,
          ContactNumber: req.body.ContactNumber,
          Address: req.body.Address,
          Email: req.body.Email,
          Date: req.body.Date,
          Time: req.body.Time,
          Status: 'Not Collected',
          AssignedStatus: 'Not Assigned'
      });

      const savedRequest = await newRequest.save();
      res.status(201).json(savedRequest);
  } catch (error) {
      console.error('Error submitting request:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/findrequests/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const requests = await Request.find({ Email: email }).select('Date Time Status AssignedStatus');
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching request history:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


///////////////////////////////////////////////////////////////////////////

// Start the server
const PORT = 7014;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
