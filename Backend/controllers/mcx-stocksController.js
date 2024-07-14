
// const MCX = require('../models/MCX.js');
// const Stock = require('../models/Stock.js');


// const addMCX = async (req, res) => {
//   try {
//     const { symbol } = req.body;
//     const newMCX = new MCX({ symbol });
//     await newMCX.save();
//     return res.status(201).json({ success: true, message: 'MCX item added successfully', newMCX });
//   } catch (error) {
//     console.error('Error adding MCX item:', error);
//     return res.status(500).json({ success: false, message: 'An error occurred' });
//   }
// };


// const addStock = async (req, res) => {
//   try {
//     const { symbol, company_name } = req.body;
//     const newStock = new Stock({ symbol, company_name });
//     await newStock.save();
//     return res.status(201).json({ success: true, message: 'Stock item added successfully', newStock });
//   } catch (error) {
//     console.error('Error adding Stock item:', error);
//     return res.status(500).json({ success: false, message: 'An error occurred' });
//   }
// };


// const getAllMCX = async (req, res) => {
//   try {
//     const mcxItems = await MCX.find({}, 'symbol');
//     return res.status(200).json({ success: true, mcxItems });
//   } catch (error) {
//     console.error('Error fetching MCX items:', error);
//     return res.status(500).json({ success: false, message: 'An error occurred' });
//   }
// };

// const getAllStocks = async (req, res) => {
//   try {
//     const stocks = await Stock.find({}, 'symbol company_name');
//     return res.status(200).json({ success: true, stocks });
//   } catch (error) {
//     console.error('Error fetching stocks:', error);
//     return res.status(500).json({ success: false, message: 'An error occurred' });
//   }
// };




// module.exports = { addMCX, addStock ,getAllMCX, getAllStocks};
