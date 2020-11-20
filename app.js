 //Creating the UI variables
const bookForm = document.querySelector('#book-form');
const bookList = document.querySelector('#book-list');

// Event listeners
eventReady();
function eventReady(){   
    //form events
    bookForm.addEventListener('submit', submitForm);
    //delete book event
    bookList.addEventListener('click', deleteBook);
  
}

//delete book function
function deleteBook(e){
    e.preventDefault();

    //check if delete was clicked
    if( e.target.classList.contains('delete-book') ){
        e.target.parentElement.parentElement.remove();
        //deleting based on ISBN number
        Store.deletebookfromStore(e.target.parentElement.previousElementSibling.textContent);
    }
    UI.showAlert('Book removed !','success');
}
//form submition method
function submitForm(e){

    e.preventDefault();

    //run time creation - getting all form fields
    const title = document.querySelector('#title');
    const author = document.querySelector('#author');
    const isbn = document.querySelector('#isbn');

    //checking if fields are empty
    if(title.value === '' | author.value === '' | isbn.value === ''){

        //if they are empty throw alert
        UI.showAlert('No books added !','danger');

    }else{

        //else continue
        //creating a new book
        const newBook = new Book(title.value,author.value,isbn.value);

        //adding book to local storage
        Store.addbooktoStorage(newBook);
        UI.showAlert('Success !','success');

        //clearing the fields
        title.value = ""; author.value = ""; isbn.value = "";

    }

    location.reload();

}

//UI class
class UI{
    
    //add new book to list
    static showAddedBooks(){
        //displaying books in store
        let books = Store.getBooks();
        console.log(books.length);
        books.forEach(function(book){
            //adding to UI
            const row = document.createElement('tr');
            //add data
            row.classList.add('text-warning');
            row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href='#' class='btn btn-danger delete-book'>X</a></td>
            `;
            bookList.appendChild(row);
        });

    }

    static showAlert(alert,type){
        //creating element
        const card = document.querySelector('.card');
        const div = document.createElement('div');
        div.className = `alert alert-${type} focus`;
        const message = document.createTextNode(alert);
        
        //appending elements
        div.appendChild(message);
        card.insertBefore(div,bookForm);
        
        //time out after alert
        setTimeout(function(){
            div.remove();
        },1500);
    }
}

//Book constructor
class Book{
    constructor(title,author,isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//Local Storage
class Store {
    
    //get books from local storage
    static getBooks(){
        let books;
        if( localStorage.getItem('books') === null ){
            //initialize the books array
            books = [];
        }else{
            //store in storage
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    //add a book
    static addbooktoStorage(book){
        //getting books
        console.log('xx');
        const books = this.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    //delete book from storage
    static deletebookfromStore(isbn){
        //get books and delete the matching one
        let books = this.getBooks();
        books.forEach(function(book,index){
            if( book.isbn === isbn ){
                books.splice(index,1);
            }
        });
        //store the updated list
        localStorage.setItem('books', JSON.stringify(books));
        
    }
}

//Default DOM event listeners
document.addEventListener('DOMContentLoaded', UI.showAddedBooks);