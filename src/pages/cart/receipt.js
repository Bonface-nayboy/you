import React, { useContext } from 'react';
import { ShopContext } from '../../context/shop-context';
import { Typography, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, Button } from '@mui/material';
import Barcode from 'react-barcode';
import { useReactToPrint } from 'react-to-print';
import "./receipt.css";
import Print from '@mui/icons-material'; // Import the correct icon component
import PrintIcon from '@mui/icons-material/Print';


const Receipt = () => {
  const { cartItems } = useContext(ShopContext);
  const userName = localStorage.getItem('userName');
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const componentRef = React.useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <div className='receipt-container' ref={componentRef}>
        <Typography variant="h5" gutterBottom>
          Receipt 
        </Typography>
        <Typography>Username: {userName}</Typography>
        <Typography variant="subtitle2">
          Date: {currentDate} 
         </Typography>
         <Typography variant="subtitle2">Time: {currentTime}</Typography>

        <Barcode value={123456789} />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Category</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>Ksh {item.price}</TableCell>
                  <TableCell>{item.category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <div className="total-amount">
          <Typography variant="h6">Total Amount: Ksh {totalAmount}</Typography>
        </div>
      </div>

      {/* Print Button - Visible only on screen */}
      <Button variant="contained" className="print-button" onClick={handlePrint} style={{ margin: '0px 150px' }}>Print
        <PrintIcon/>
      </Button>

      {/* Print CSS - Hides the button when printing */}
      <style>
        {`
          @media print {
            .print-button {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Receipt;


