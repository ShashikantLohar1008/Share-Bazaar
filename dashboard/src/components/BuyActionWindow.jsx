import React, { useState,useContext } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

import GeneralContext from "./GeneralContext";

import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);

  const {closeBuyWindow}=useContext(GeneralContext);

 
  const handleCancelClick = () => {
    closeBuyWindow();
  };

  const handleBuyClick = async () => {
    try {
      // First, create a new buy order
      const response = await axios.post("http://localhost:3002/newOrder", {
        name: uid,
        qty: stockQuantity,
        price: stockPrice,
        mode: "BUY",
      });
  
      // Assuming the response contains the average price, net, and day change
      const { avg, net, day } = response.data; // Make sure your backend sends this data
  
      // Fetch current holdings to update quantity
      const holdingsResponse = await axios.get(`http://localhost:3002/allHoldings`);
      
      const currentHolding = holdingsResponse.data.find(holding => holding.name === uid);
  
      if (currentHolding) {
        // Update the quantity for the stock in holdings
        const updatedQty = currentHolding.qty + stockQuantity; // Add new quantity to existing quantity
        
        await axios.put(`http://localhost:3002/updateHolding/${currentHolding._id}`, {
          qty: updatedQty,
          avg, // You may need to adjust how you calculate avg price
          price: stockPrice,
          net,
          day,
        });
      } else {
        // If there's no existing holding, create a new entry in holdings
        await axios.post("http://localhost:3002/newHolding", {
          name: uid,
          qty: stockQuantity,
          avg,
          price: stockPrice,
          net,
          day,
        });
      }
  
      console.log("Buy order and holdings updated successfully");
      // GeneralContext.closeBuyWindow();
    } catch (error) {
      console.error("Error processing buy order:", error);
      // GeneralContext.closeBuyWindow();
    }
    console.log("hello");
    // GeneralContext.closeBuyWindow();
    closeBuyWindow();
    
  };

  
  
  
  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <Link className="btn btn-blue" onClick={handleBuyClick}>
            Buy
          </Link>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;





// const handleBuyClick = () => {
//   axios
//     .post("http://localhost:3002/newOrder", {
//       name: uid,
//       qty: stockQuantity,
//       price: stockPrice,
//       mode: "BUY",
//     })
//     .then(() => {
//       axios.post("http://localhost:3002/newOrder", {
//         name: uid,
//         qty: ,
//         avg: req.body.avg,
//         price: req.body.price,
//         net: req.body.net,
//         day: req.body.day,
//       });
//     });

//   GeneralContext.closeBuyWindow();
// };








