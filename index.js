const express = require('express')
const cors = require("cors")
const app = express()

const { initializeDatabase } = require("./db/db.connect")
initializeDatabase()

const Books = require("./models/books.models")

app.use(express.json())
app.use(cors())


async function createBook(newBook) {
     try {
          const book = new Books(newBook)
          const saveBook = await book.save()
          console.log(saveBook)
          return saveBook
     } catch (error) {
          console.log(error)
     }
}

app.post("/books", async (req, res) => {
     try {
          const savedBook = await createBook(req.body)
          res.status(201).json({
               message: "Book added successfully",
               book: savedBook
          })
     } catch (error) {
          res.status(500).json({error: "Failed to add the book"})
     }
})


//3 read all books
async function readAllBooks() {
     try {
          const books = await Books.find()
          // console.log(books)
          return books
     } catch (error) {
          console.log(error)
     }
}

app.get("/books", async (req, res) => {
     try {
       const books = await readAllBooks()
       if (books.length != 0) {
         res.json(books)
       } else {
         res.status(404).json({ error: "Books not found" })
       }
     } catch (error) {
       res.status(500).json({ error: "Failed to get books" })
     }
})


//4 get book details by its title
async function getBookByTitle(bookTitle) {
     try {
          const bookData = Books.findOne({ title: bookTitle })
          // console.log(bookData)
          return bookData
     } catch (error) {
       console.log(error)
     }
}

app.get("/books/:title", async (req, res) => {
      try {
           const book = await getBookByTitle(req.params.title)
           
           if (book) {
               //  res.status(200).json({
               //       message: "Book fetched successfully.",
               //       book: book
                //  })
                res.json(book)
           } else {
                res.status(404).json({error: "Book not found"})
           }
     } catch (error) {
          res.status(500).json({error: "Failed to add the book"})
     }
})

//5 read books by author
async function getBooksByAuthor(author) {
     try {
          const books =await Books.find({ author: author })
          // console.log(books)
          return books
     } catch (error) {
       console.log(error)
     }
}

app.get("/books/directory/:author", async (req, res) => {
     try {
       const books = await getBooksByAuthor(req.params.author)

       if (books.length !=0) {
        res.json(books)
       } else {
         res.status(404).json({ error: "Books not found" })
       }
     } catch (error) {
       res.status(500).json({ error: "Failed to fetch the books" })
     }
})

//6 read books by genre
async function getBooksByGenre(genre) {
     try {
          const books = await Books.find({ genre: genre })
          // console.log(books)
          return books
     } catch (error) {
       console.log(error)
     }
}

app.get("/books/category/:genre", async (req, res) => {
  try {
    const books = await getBooksByGenre(req.params.genre)

    if (books.length != 0) {
      res.json(books)
    } else {
      res.status(404).json({ error: "Books not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the books" })
  }
})


//7 read books by release Year
async function getBooksByYear(year) {
     try {
          const books = await Books.find({ publishedYear: year })
          console.log(books)
          return books
     } catch (error) {
       console.log(error)
     }
}

app.get("/books/published/:year", async (req, res) => {
  try {
    const books = await getBooksByYear(req.params.year)

    if (books.length != 0) {
      res.json(books)
    } else {
      res.status(404).json({ error: "Books not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the books" })
  }
})


//8 update mongoDb data by id
async function updateBookRating(bookId, dataToUpdate) {
      try {
        const books = await Books.findByIdAndUpdate(bookId, dataToUpdate, {new : true})
        console.log(books)
        return books
      } catch (error) {
        console.log(error)
      }
}

app.post("/books/:bookId", async (req, res) => {
     try {
     const updatedBook = await updateBookRating(req.params.bookId, req.body)
     
          if (updatedBook) {
               res.status(200).json({
                    message: "Book updated successfully.",
                    book: updatedBook
               })
          } else {
               res.status(404).json({ error: "Book not found" })
          }
       
     } catch (error) {
       res.status(500).json({ error: "Failed to update the books" })
     }
})



//9 update book rating mongoDb data by title
async function updateBookRatingByTitle(title, dataToUpdate) {
      try {
        const books = await Books.findOneAndUpdate({title: title}, dataToUpdate, {new : true})
        console.log(books)
        return books
      } catch (error) {
        console.log(error)
      }
}

app.post("/books/titles/:title", async (req, res) => {
     try {
     const updatedBook = await updateBookRatingByTitle(req.params.title,
       req.body
     )
     
          if (updatedBook) {
               res.status(200).json({
                    message: "Book updated successfully.",
                    book: updatedBook
               })
          } else {
               res.status(404).json({ error: "Book not found" })
          }
       
     } catch (error) {
       res.status(500).json({ error: "Failed to update the books" })
     }
})


//10 writing a function to delete a book by id
async function deleteBook(bookId) {
  try {
    const book = await Books.findByIdAndDelete(bookId)
    console.log(book)
    return book
  } catch (error) {
    console.log(error)
  }
}

app.delete("/books/:bookId", async (req, res) => {
      try {
        const deletedBook = await deleteBook(req.params.bookId)
     
        if (deletedBook) {
          res.status(200).json({
            message: "Book deleted successfully.",
            book: deletedBook,
          })
        } else {
          res.status(404).json({ error: "Book not found" })
        }
      } catch (error) {
        res.status(500).json({ error: "Failed to delete the book" })
      }
})


app.get("/", (req, res) => {
     res.send("Hello, Express Server.")
})

const PORT = 3000
app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`)
})
