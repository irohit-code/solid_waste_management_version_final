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

//STAFF

const staffSchema = new mongoose.Schema({
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
    required: true
  },
  Gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  Age: {
    type: Number,
    required: true
  },
  Address: {
    type: String,
    required: true
  },
  WorkingArea: {
    type: String,
    required: true
  }
});

// WORKER

const workerSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  Age: {
    type: Number,
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
    required: true
  },
  Address: {
    type: String,
    required: true
  },
  WorkingArea: {
    type: String,
    required: true
  }
});
//ASSIGNED WORK 

const assignedWorkSchema = new mongoose.Schema({
  workerName: {
    type: String,
    required: true
  },
  workerEmail: {
    type: String,
    required: true
  },
  workerContact: {
    type: String,
    required: true
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true
  },
  requestAddress: {
    type: String,
    required: true
  },
  requestTime: {
    type: String,
    required: true
  },
  requestDate: {
    type: Date,
    required: true
  },
  assignedStatus: {
    type: String,
    enum: ['Assigned', 'Not Assigned', 'Collected', 'Not Collected'],
    default: 'Assigned',
    required: true
  },
  status: {
    type: String,
    enum: ['Not Collected', 'Collected'],
    default: 'Not Collected',
    required: true
  }
});

// COMPLETED WORKS

const completedWorkSchema = new mongoose.Schema({
  workerName: {
      type: String,
      required: true
  },
  contactNumber: {
      type: String,
      required: true
  },
  requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      required: true
  },
  requestDate: {
      type: Date,
      required: true
  },
  requestTime: {
      type: String,
      required: true
  },
  requestAddress: {
      type: String,
      required: true
  },
  bioWasteKg: {
      type: Number,
      required: true
  },
  nonBioWasteKg: {
      type: Number,
      required: true
  },
  totalWasteKg: {
      type: Number,
      required: true
  },
  completedDate: {
      type: Date,
      required: true
  }
});

const CompletedWork = mongoose.model('CompletedWork', completedWorkSchema);

const AssignedWork = mongoose.model('AssignedWork', assignedWorkSchema);

const Worker = mongoose.model('Worker', workerSchema);

const Staff = mongoose.model('Staff', staffSchema);

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
      case 'Head':
        UserModel = Head;
        break;
      case 'Staff':
        UserModel = Staff;
        break;
      case 'Worker':
        UserModel = Worker;
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
// GET CITIZEN NAME
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

//////////////////////////////////////////// HEAD
//GET HEAD NAME
app.get('/api/head/:email', async (req, res) => {
  try {
    const head = await Head.findOne({ Email: req.params.email });
    if (head) {
      res.json(head);
    } else {
      res.status(404).json({ message: 'Head not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//GET CITIZEN
app.get('/api/citizens', async (req, res) => {
  try {
    const citizens = await Citizen.find();
    res.json(citizens);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//GET STAFF
app.get('/api/staff', async (req, res) => {
  try {
    const staffMembers = await Staff.find();
    res.json(staffMembers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// GET WORKER
app.get('/api/get-worker', async (req, res) => {
  try {
    const workMembers = await Worker.find();
    res.json(workMembers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// REGISTER STAFF


app.post('/api/staff/register', async (req, res) => {
  const { Name, Email, Password, Gender, Age, Address, WorkingArea, ContactNumber } = req.body;

  try {
    if (!Name || !Email || !Password || !Gender || !Age || !Address || !WorkingArea || !ContactNumber) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingStaff = await Staff.findOne({ Email });
    if (existingStaff) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newStaff = new Staff({
      Name,
      Email,
      Password,
      ContactNumber,
      Gender,
      Age,
      Address,
      WorkingArea
    });

    await newStaff.save();

    res.status(201).json({ message: 'Staff registered successfully' });
  } catch (error) {
    console.error('Error registering staff:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
///////////////////////////////////////////////////////////////////////////

/////////////////////////// STAFF
//GET STAFF NAME
app.get('/api/staff/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const staff = await Staff.findOne({ Email: email });
    if (!staff) {
      return res.status(404).json({ error: 'Citizen not found' });
    }
    res.json({
      name: staff.Name,
      contactNumber: staff.ContactNumber,

    });
  } catch (error) {
    console.error('Error fetching citizen details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

////////////////////////////////// WORKER ////////////////////////////////////

//ADD WORKER

app.post('/api/add-workers', async (req, res) => {
  try {
    const { Name, Age, Email, Password, ContactNumber, Address, WorkingArea } = req.body;
    const worker = new Worker({
      Name,
      Age,
      Email,
      Password,
      ContactNumber,
      Address,
      WorkingArea
    });
    await worker.save();
    res.status(201).json({ message: 'Worker added successfully' });
  } catch (error) {
    console.error('Error adding worker:', error);
    res.status(500).json({ error: 'Failed to add worker' });
  }
});
//GET WORKER NAME CN
app.get('/api/worker/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const worker = await Worker.findOne({ Email: email });
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    res.json({
      name: worker.Name,
      contactNumber: worker.ContactNumber,
    });
  } catch (error) {
    console.error('Error fetching citizen details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET REQUEST

app.get('/api/get-requests', async (req, res) => {
  try {
    const requests = await Request.find();
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// ASSIGN WORK

app.post('/api/assign-work', async (req, res) => {
  try {
    const { selectedRequests, selectedWorker } = req.body;
    
    const worker = await Worker.findById(selectedWorker);
    if (!worker) {
      return res.status(400).json({ success: false, message: 'Worker not found' });
    }
    
    const assignedRequests = await Request.find({ _id: { $in: selectedRequests } });
    if (!assignedRequests.length) {
      return res.status(400).json({ success: false, message: 'No requests selected' });
    }
    
    const assignedWorkDocs = assignedRequests.map(request => ({
      workerName: worker.Name,
      workerEmail: worker.Email,
      workerContact: worker.ContactNumber,
      requestId: request._id,
      requestAddress: request.Address,
      requestTime: request.Time,
      requestDate: request.Date,
      assignedStatus: 'Assigned',
      status : 'Not Collected'
    }));
    
    await AssignedWork.insertMany(assignedWorkDocs);

    await Request.updateMany({ _id: { $in: selectedRequests } }, { AssignedStatus: 'Assigned' });
    
    res.status(200).json({ success: true, message: 'Work assigned successfully' });
  } catch (error) {
    console.error('Error assigning work:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET ASSIGNED WORK

app.get('/api/get-assigned-work/:workerEmail', async (req, res) => {
  const { workerEmail } = req.params;

  try {
      const assignedWork = await AssignedWork.find({ workerEmail });

      if (!assignedWork) {
          return res.status(404).json({ message: 'Assigned work not found' });
      }

      res.json(assignedWork);
  } catch (error) {
      console.error('Error fetching assigned work:', error);
      res.status(500).json({ message: 'Error fetching assigned work' });
  }
});
// CHECK COMPLETED WORK
app.post('/api/complete-work', async (req, res) => {
  try {
    const { requestDate, requestTime } = req.body;

    const existingCompletedWork = await CompletedWork.findOne({ requestDate, requestTime });

    if (existingCompletedWork) {
      return res.status(400).json({message: 'Completing the work is not allowed. Another work has already been completed at this date and time.'});
    }

    const completedWork = new CompletedWork(req.body);
    await completedWork.save();
    res.status(201).send(completedWork);
  } catch (error) {
    console.error('Error completing work:', error);
    res.status(500).send('Error completing work');
  }
});

//UPDATE STATUS OF COMPLETED WORK
app.post('/api/update-request-status/:requestTime', async (req, res) => {
  const { requestTime } = req.params;
  const { Status } = req.body;

  try {
    const updatedRequest = await Request.findOneAndUpdate({ Time:requestTime}, { Status }, { new: true });
    const updateassing = await AssignedWork.findOneAndUpdate({requestTime:requestTime}, {status:'Collected'} ,{new:true});

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    return res.status(200).json(updatedRequest);
  } catch (error) {
    console.error('Error updating request status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

//GET WORKERS NAME

app.get('/api/get-workers', async (req, res) => {
  try {
    const workers = await CompletedWork.find({}, 'workerName'); 

    res.json(workers);
  } catch (error) {
    console.error('Error fetching workers:', error);
    res.status(500).json({ error: 'An error occurred while fetching workers' });
  }
});

app.get('/api/get-report', async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const reportData = await CompletedWork.aggregate([
      {
        $match: {
          completedDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: '$workerName',
          totalBioWaste: { $sum: '$bioWasteKg' },
          totalNonBioWaste: { $sum: '$nonBioWasteKg' },
          totalWaste: { $sum: '$totalWasteKg' }
        }
      }
    ]);

    res.json(reportData);
  } catch (error) {
    console.error('Error fetching report data:', error);
    res.status(500).json({ error: 'Error fetching report data' });
  }
});
// Start the server
const PORT = 7014;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
//sheak