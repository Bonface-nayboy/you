const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: '',
    database: 'logins'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        process.exit(1); 
    }
    console.log('Connected to database as id ' + db.threadId);
});

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    const values = [name, email, password];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting into database: ' + err.stack);
            return res.status(500).json({ error: 'Error registering user' });
        }
        console.log('Registered user successfully with ID: ' + result.insertId);
        return res.status(200).json({ message: 'Registered Successfully' });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    const values = [email, password];

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error querying database: ' + err.stack);
            return res.status(500).json({ error: 'Error logging in' });
        }
        if (results.length === 0) {
            console.log('User not found or invalid credentials');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('User logged in successfully');
        return res.status(200).json({ message: 'Logged in Successfully', name: results[0].name });
    });
});




app.post('/newItems', (req, res) => {
    const { productName, productImage, price, category } = req.body;
    const SELECT_PRODUCT_QUERY = `SELECT * FROM newitems WHERE productImage = ?`;
    
   
    db.query(SELECT_PRODUCT_QUERY, [productImage], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error checking product existence');
      }
      if (rows.length > 0) {
        return res.status(400).send('Product with this name already exists');
      }
      
    
      const INSERT_PRODUCT_QUERY = `INSERT INTO newitems (productName, productImage, price, category) VALUES (?, ?, ?, ?)`;
      db.query(INSERT_PRODUCT_QUERY, [productName, productImage, price, category], (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error saving the product');
        } else {
          console.log(`Inserted product with ID: ${result.insertId}`);
          res.status(200).send('Product added successfully');
        }
      });
    });
  });
  
 
  app.get('/getItems', (req, res) => {
    const SELECT_ITEMS_QUERY = 'SELECT * FROM newitems';
    

    db.query(SELECT_ITEMS_QUERY, (err, results) => {
      if (err) {
        console.error('Error fetching items:', err);
        return res.status(500).json({ error: 'Error fetching items' });
      }
      
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'No items found' });
      }
      
      res.status(200).json(results);
    });
  });

  


  app.post('/add-update-newcart', (req, res) => {
    const { cartValues } = req.body;
    console.log('cartValues',cartValues)
  
    if (!cartValues || !Array.isArray(cartValues)) {
      return res.status(400).json({ error: 'Invalid cart data' });
    }
  
    let successfulOperations = [];
    let completedOperations = 0;
  
    const sendSuccessResponse = () => {
      completedOperations++;
      if (completedOperations === cartValues.length) {
        res.status(200).json({
          message: successfulOperations.length > 0
            ? 'Items updated successfully'
            : 'Items added successfully',
        });
      }
      else{
        res.status(400).json({
          message: 'Items failed successfully'
        });
      }
    };
  console.log("ytrer",sendSuccessResponse())
    cartValues.forEach(item => {
      const {
        username,
        orderId,
        productId,
        productName,
        productImage,
        productQty,
        price,
        category,
      } = item;
  
      // Check cart for existing entry
      db.query(
        'SELECT * FROM cart WHERE productId = ? AND username = ?',
        [productId, username],
        (err, result) => {
          if (err) {
            console.error('Error checking cart:', err);
            console.log('result',result)
            return res.status(500).json({ error: 'Error checking cart' });
          }
  
          if (result.length > 0) {
            // Update existing entry
            db.query(
              'UPDATE cart SET productQty = ? WHERE productId = ? AND username = ?',
              [productQty, productId, username],
              (err, updateResult) => {
                if (err) {
                  console.error('Error updating cart:', err);
                  return res.status(500).json({ error: 'Error updating cart' });
                }
                successfulOperations.push(`Updated cart for product ID ${productId}`);
                // sendSuccessResponse();
              }
            );
          } else {
            // Insert new entry
            const sql = 'INSERT INTO cart (orderId, username, productId, productName, productImage, productQty, price, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [orderId, username, productId, productName, productImage, productQty, price, category];
            console.log('values',values)
  
            db.query(sql, values, (err, insertResult) => {
              if (err) {
                console.error('Error inserting into cart:', err);
                return res.status(500).json({ error: 'Error inserting into cart' });
              }
              successfulOperations.push(`Added item to cart for product ID ${productId}`);
              // sendSuccessResponse();
            });
          }
        }
      );
    });
  });
  




app.put('/updateItem/:id', (req, res) => {
    const { productName, productImage, price, category } = req.body;
    const { id } = req.params;
    const sql = `
      UPDATE newitems
      SET productName = ?, productImage = ?, price = ?, category = ?
      WHERE id = ?
    `;
    db.query(sql, [productName, productImage, price, category, id], (err, result) => {
      if (err) {
        console.error('Error updating item:', err);
        res.status(500).json({ error: 'Failed to update item.' });
      } else {
        res.status(200).json({ message: 'Item updated successfully.' });
      }
    });
  });
  
  
  app.delete('/deleteItem/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
      DELETE FROM newitems
      WHERE id = ?
    `;
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error('Error deleting item:', err);
        res.status(500).json({ error: 'Failed to delete item.' });
      } else {
        res.status(200).json({ message: 'Item deleted successfully.' });
      }
    });
  });










  app.get('/stock', (req, res) => {
    const sql = 'SELECT * FROM stock_items';
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error retrieving data from database');
        } else {
            res.status(200).json(result);
        }
    });
});

// Add an item
app.post('/stock', (req, res) => {
  const { productName, productImage, price, category, qty } = req.body;
  const total = price * qty; // Calculate total based on price and qty

  const sql = 'INSERT INTO stock_items (productName, productImage, price, category, qty, total) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [productName, productImage, price, category, qty, total], (err, result) => {
      if (err) {
          console.log(err);
          res.status(500).send('Error adding item to database');
      } else {
          res.status(201).send('Item added to database');
      }
  });
});


// Update an item
app.put('/stock/:id', (req, res) => {
    const itemId = req.params.id;
    const { productName, productImage, price, category, qty } = req.body;
    const sql = 'UPDATE stock_items SET productName=?, productImage=?, price=?, category=?, qty=? WHERE id=?';
    db.query(sql, [productName, productImage, price, category, qty, itemId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(`Error updating item with ID ${itemId}`);
        } else {
            res.status(200).send(`Item with ID ${itemId} updated`);
        }
    });
});

// Delete an item
app.delete('/stock/:id', (req, res) => {
    const itemId = req.params.id;
    const sql = 'DELETE FROM stock_items WHERE id=?';
    db.query(sql, [itemId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(`Error deleting item with ID ${itemId}`);
        } else {
            res.status(200).send(`Item with ID ${itemId} deleted`);
        }
    });
});













app.put('/stock/add/:id', (req, res) => {
  const itemId = req.params.id;
  
  // Fetch the current item from database to get existing qty and price
  const fetchItemSql = 'SELECT * FROM stock_items WHERE id = ?';
  db.query(fetchItemSql, [itemId], (err, result) => {
      if (err) {
          console.log(err);
          res.status(500).send(`Error fetching item with ID ${itemId}`);
          return;
      }

      if (result.length === 0) {
          res.status(404).send(`Item with ID ${itemId} not found`);
          return;
      }

      const currentItem = result[0];
      const currentQty = currentItem.qty;
      const price = currentItem.price;

      // Calculate new qty and total
      const newQty = currentQty + 1;
      const total = price * newQty;

      // Update qty and total in database
      const updateSql = 'UPDATE stock_items SET qty = ?, total = ? WHERE id = ?';
      db.query(updateSql, [newQty, total, itemId], (updateErr, updateResult) => {
          if (updateErr) {
              console.log(updateErr);
              res.status(500).send(`Error adding item with ID ${itemId} back to stock`);
          } else {
              res.status(200).send(`Item with ID ${itemId} added back to stock`);
          }
      });
  });
});





const PORT = process.env.PORT || 8084;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
