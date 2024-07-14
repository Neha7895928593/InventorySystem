const express = require('express');
require('./models/mongooseconn.js');
const SuperAdminRoutes = require('./routes/SuperAdminRoutes.js');
const MasterAdminRoutes = require('./routes/masterAdminRoutes.js'); 
const ClientRoutes = require('./routes/ClientRoutes.js'); 
const wishlistRoutes=require('./routes/wishlistRoutes.js')
const TradeRoutes =require('./routes/tradeRoutes.js')
const bidRoutes=require('./routes/bidRoutes.js')
const stoploosRoutes=require('./routes/stoploosRoutes.js')




const app = express();
require('./models/mongooseconn.js');
const dotenv = require('dotenv');
dotenv.config(); 

const cors = require('cors');


app.use(express.json()); 
app.use(cors());
app.use('/api/var/superAdmin', SuperAdminRoutes);
app.use('/api/var/masterAdmin', MasterAdminRoutes); 
app.use('/api/var/client',ClientRoutes); 
app.use('/api/var/wishlist', wishlistRoutes);
app.use('/api/var/trade',TradeRoutes)
app.use('/api/var/bid',bidRoutes)
app.use('/api/var/stoploos',stoploosRoutes)








app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
});

