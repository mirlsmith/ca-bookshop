'use strict'
const STORAGE_KEY = 'booksDB'
const PAGE_SIZE = 10

var gBooks
var gFilterBy = { maxPrice: 300, minRating: 0 }
var gPageIdx = 0

_createBooks()

function getBooksForDisplay() {

    //filtering
    var books = gBooks.filter(book => book.price <= gFilterBy.maxPrice &&
    book.rating >= gFilterBy.minRating)


    //paging
    const startIdx = gPageIdx * PAGE_SIZE
    books = books.slice(startIdx, startIdx + PAGE_SIZE)

    return books
}


function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)

    if (!books || !books.length) {
        books = []
        for (let i = 0; i < 10; i++) {
            books.push(_createBook())
        }
    }

    gBooks = books
    _saveBooksToStorage()
}


function _createBook(title = 'A Great Book Title', price = 5, rating = 0) {
    return {
        id: makeId(3),
        title,
        price,
        rating,
        details: makeLorem(20)
    }
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function deleteBook(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function addBook(title, price) {
    const newBook = _createBook(title, price)
    gBooks.unshift(newBook)
    _saveBooksToStorage()
    return newBook
}

function getBookById(bookId) {
    const book = gBooks.find(book => bookId === book.id)
    return book
}

function updateBookPrice(id, newPrice) {
    const book = getBookById(id)
    book.price = newPrice
    _saveBooksToStorage()
    return book

}

function updateBookRating(bookId, diff) {
    const book = getBookById(bookId)
    book.rating += diff
    _saveBooksToStorage()
    return book
}

function setBookFilter(filterBy = {}) {
    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
    if (filterBy.minRating !== undefined) gFilterBy.minRating = filterBy.minRating
    return gFilterBy
}

function nextPage() {
    gPageIdx++
    if (gPageIdx >= Math.floor(gBooks.length/PAGE_SIZE)) {
        gPageIdx = Math.floor(gBooks.length/PAGE_SIZE)
    }
    // setNextPage(false)
    // setPrevPage(true)
}

function prevPage() {
    gPageIdx--
    if (gPageIdx <= 0) gPageIdx = 0
    // setPrevPage(false)
    // setNextPage(true)
}

function getPageIdx(){
    return gPageIdx
}

function getMaxPageIdx(){
    return Math.ceil(gBooks.length/PAGE_SIZE)-1
}