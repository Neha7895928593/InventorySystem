const express = require('express');
require('./models/mongooseconn.js');
const SuperAdminRoutes = require('./routes/SuperAdminRoutes.js');
const dealerRoutes=require('./routes/dealerRoute.js')




const app = express();
require('./models/mongooseconn.js');
const dotenv = require('dotenv');
dotenv.config(); 

const cors = require('cors');


app.use(express.json()); 
app.use(cors());
app.use('/api/var/superAdmin', SuperAdminRoutes);
app.use('/api/var/dealers', dealerRoutes);






app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
});

