const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}


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

// // Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   res.send(JSON.stringify(books,null,4));
// });


////////////////////////// task 10
public_users.get('/', async function (req, res) {
  try {
    // Assuming `books` is an asynchronous operation, you can use await here.
    const books = await fetchBooks(); // Replace fetchBooks with your actual asynchronous operation.
    res.send(JSON.stringify(books, null, 4));
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Example asynchronous function to fetch books
async function fetchBooks() {
  return new Promise((resolve, reject) => {
    // Simulate an asynchronous operation
    setTimeout(() => {
      resolve(books);
    }, 1000);
  });
}

///////////////////////

// // Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   const ISBN = req.params.isbn;
  
//   res.send(books[ISBN])
//  });


///////////////////// task 11

public_users.get('/isbn/:isbn', async (req, res) => {
  const ISBN = req.params.isbn;

  try {
    // Assuming fetching a book by ISBN is an asynchronous operation, use await here.
    const book = await fetchBookByISBN(ISBN); // Replace with your actual asynchronous operation.

    if (book) {
      res.send(JSON.stringify(book, null, 4));
    } else {
      res.status(404).send('Book not found');
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Example asynchronous function to fetch a book by ISBN
async function fetchBookByISBN(ISBN) {
  return new Promise((resolve, reject) => {
    // Simulate an asynchronous operation (replace with your actual database query)
    setTimeout(() => {
      const book = books[ISBN];
      resolve(book);
    }, 1000);
  });
}

///////////////////



  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   let ans = []
//     for(const [key, values] of Object.entries(books)){
//         const book = Object.entries(values);
//         for(let i = 0; i < book.length ; i++){
//             if(book[i][0] == 'author' && book[i][1] == req.params.author){
//                 ans.push(books[key]);
//             }
//         }
//     }
//     if(ans.length == 0){
//         return res.status(300).json({message: "Author not found"});
//     }
//     res.send(ans);
// });



////////////////task 12


public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const matchingBooks = await findBooksByAuthor(author); // Await here (even though it's not truly asynchronous).

    if (matchingBooks.length === 0) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.send(matchingBooks);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Example function to find books by author (assuming books is an in-memory object)
async function findBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    const matchingBooks = [];

    for (const [key, values] of Object.entries(books)) {
      const book = Object.entries(values);
      for (let i = 0; i < book.length; i++) {
        if (book[i][0] === 'author' && book[i][1] === author) {
          matchingBooks.push(books[key]);
        }
      }
    }

    resolve(matchingBooks);
  });
}


/////////////////



// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   let ans = []
//   for(const [key, values] of Object.entries(books)){
//       const book = Object.entries(values);
//       for(let i = 0; i < book.length ; i++){
//           if(book[i][0] == 'title' && book[i][1] == req.params.title){
//               ans.push(books[key]);
//           }
//       }
//   }
//   if(ans.length == 0){
//       return res.status(300).json({message: "Title not found"});
//   }
//   res.send(ans);
// });



///////////////task 13


public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const matchingBooks = await findBooksByTitle(title); // Await here (even though it's not truly asynchronous).

    if (matchingBooks.length === 0) {
      return res.status(404).json({ message: 'Title not found' });
    }

    res.send(matchingBooks);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Example function to find books by title (assuming books is an in-memory object)
async function findBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    const matchingBooks = [];

    for (const [key, values] of Object.entries(books)) {
      const book = Object.entries(values);
      for (let i = 0; i < book.length; i++) {
        if (book[i][0] === 'title' && book[i][1] === title) {
          matchingBooks.push(books[key]);
        }
      }
    }

    resolve(matchingBooks);
  });
}

/////////////////////


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews)
});

// Task 10 
// Add the code for getting the list of books available in the shop (done in Task 1) using Promise callbacks or async-await with Axios

function getBookList(){
  return new Promise((resolve,reject)=>{
    resolve(books);
  })
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  getBookList().then(
    (bk)=>res.send(JSON.stringify(bk, null, 4)),
    (error) => res.send("denied")
  );  
});

// Task 11
// Add the code for getting the book details based on ISBN (done in Task 2) using Promise callbacks or async-await with Axios.

function getFromISBN(isbn){
  let book_ = books[isbn];  
  return new Promise((resolve,reject)=>{
    if (book_) {
      resolve(book_);
    }else{
      reject("Unable to find book!");
    }    
  })
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getFromISBN(isbn).then(
    (bk)=>res.send(JSON.stringify(bk, null, 4)),
    (error) => res.send(error)
  )
 });

// Task 12
// Add the code for getting the book details based on Author (done in Task 3) using Promise callbacks or async-await with Axios.

function getFromAuthor(author){
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
}

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  getFromAuthor(author)
  .then(
    result =>res.send(JSON.stringify(result, null, 4))
  );
});

// Task 13
// Add the code for getting the book details based on Title (done in Task 4) using Promise callbacks or async-await with Axios.


function getFromTitle(title){
  let output = [];
  return new Promise((resolve,reject)=>{
    for (var isbn in books) {
      let book_ = books[isbn];
      if (book_.title === title){
        output.push(book_);
      }
    }
    resolve(output);  
  })
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  getFromTitle(title)
  .then(
    result =>res.send(JSON.stringify(result, null, 4))
  );
});

module.exports.general = public_users;