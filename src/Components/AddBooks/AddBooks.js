import React, { useContext, useState } from 'react';
import './AddBooks.css';
import '../Admin/Admin.css';
import { userContext } from '../../App';
const axios = require('axios');
const AddBooks = () => {
    const [loggedInUser, setLoggedInUser] = useContext(userContext);
    const [isAdded, setIsAdded] = useState(false);
    const [bookDetails, setBookDetails] = useState({
        bookName: '',
        authorName: '',
        price: '',
        cover: ''
    });
    const clearaInput = (id) => {
        document.getElementById(id).value = '';
    }
    const clearInputs = () => {
        clearaInput('book-name');
        clearaInput('book-price');
        clearaInput('author-name');
        clearaInput('book-cover');
    }
    // getting image link using imgbb
    const getImageLink = (event) => {
        const filesLength = event.target.files.length;
        console.log(filesLength);
        console.log(event.target.files[filesLength - 1]);
        //we got an array containing image detials here
        const imageData = new FormData();
        imageData.set('key', '9e69bb4baf891a02c697a436af99df57')
        imageData.append('image', event.target.files[filesLength - 1]);

        axios.post('https://api.imgbb.com/1/upload', imageData)
            .then(function (response) {
                // returns the image link
                const newBookDetails = { ...bookDetails };
                newBookDetails.cover = response?.data?.data?.display_url;
                setBookDetails(newBookDetails);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const handleChange = (event) => {
        const newBookDetails = { ...bookDetails };
        if (event.target.name == 'bookName') {
            newBookDetails.bookName = event.target.value;
        }
        else if (event.target.name == 'authorName') {
            newBookDetails.authorName = event.target.value;
        }
        else if (event.target.name == 'bookPrice') {
            newBookDetails.price = event.target.value;
        }
        setBookDetails(newBookDetails);
    }
    const handleAddBook = (event) => {
        event.preventDefault();
        // performing post request to the server
        const newBook = { ...loggedInUser, ...bookDetails };
        fetch('https://bookscape-server.herokuapp.com/addbook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBook)
        })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setIsAdded(true);
                    clearInputs();
                    setTimeout(() => {
                        setIsAdded(false);
                    }, 3000);
                }
            })
    }
    return (
        <div className="addbooks-container">
            <form className="addbooks-form" action="">
                <div className="form-book-input">
                    <div>
                        <h3>Book Name</h3>
                        <input onChange={handleChange} type="text" placeholder="Enter Name" name="bookName" id="book-name" />
                    </div>
                </div>
                <div className="form-book-input">
                    <div>
                        <h3>Author Name</h3>
                        <input onChange={handleChange} type="text" placeholder="Enter Name" name="authorName" id="author-name" />
                    </div>
                </div>
                <div className="form-book-input">
                    <div>
                        <h3>Price</h3>
                        <input onChange={handleChange} type="text" placeholder="Enter Price" id="book-price" name="bookPrice" />
                    </div>
                </div>
                <div className="form-book-input">
                    <div>
                        <h3>Add Book Cover Photo</h3>
                        <input onChange={getImageLink} className="custom-upload" type="file" name="bookCover" id="book-cover" />
                    </div>
                </div>
                <div className="form-book-input submit">
                    <div>
                        <button onClick={handleAddBook} className="submit-input">Save</button>
                    </div>
                </div>
            </form>
            {
                isAdded &&
                <div className="addStatus">
                    One book added successfully!
                </div>
            }
        </div>
    );
};

export default AddBooks;