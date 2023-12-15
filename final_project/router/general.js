const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
  
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

  //  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    const ISBN = req.params.isbn;
    res.send(books[ISBN].reviews)
  });


// Get the book list available in the shop
public_users.get('/',function (req, res) {

    return new Promise((resolve,reject)=>{
        resolve(books);
      }).then(
      (bk)=>res.send(JSON.stringify(bk, null, 4)),
      (error) => res.send("denied")
    );  
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let book_ = books[isbn];  

    return new Promise((resolve,reject)=>{
        if (book_) {
          resolve(book_);
        }else{
          reject("Unable to find book!");
        }    
      })
      .then(
      (bk)=>res.send(JSON.stringify(bk, null, 4)),
      (error) => res.send(error)
    )
   });
  
 
  // Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let output = [];
    return new Promise((resolve,reject)=>{
      for (var isbn in books) {
        let book_ = books[isbn];
        if (book_.author === author){
          output.push(book_);
        }
      }
      resolve(output);  
    })
    .then(
      result =>res.send(JSON.stringify(result, null, 4))
    );
  });


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const title =req.params.title;
    return new Promise((resolve,reject)=>{
      for(var book in books){ 
        if(books[book].title===title){
           resolve(books[book])
        }
      }
    }).then(result=>res.send(JSON.stringify(result,null,4)));
});


module.exports.general = public_users;
