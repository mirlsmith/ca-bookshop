'use strict'

function onInit() {
    renderFilterByQueryStringParams()
    renderBooks()
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        maxPrice: +queryStringParams.get('maxPrice') || 300,
        minRating: +queryStringParams.get('minRating') || 0
    }

    if (!filterBy.maxPrice && !filterBy.minRating) return

    document.querySelector('.filter-price-range').value = filterBy.maxPrice
    document.querySelector('.filter-rating-range').value = filterBy.minRating
    setBookFilter(filterBy)
}

function renderBooks() {
    var books = getBooksForDisplay()

    const bookKeys = (books.length) ? Object.keys(books[0]) : ['n/a']
    var strHTML = '<tr>'
    strHTML += bookKeys.map(key => {
        if (key === 'details' || key === 'rating') return ''
        else return `<th>${key}</th>`
    }).join('')
    strHTML += '<th colspan="3">Actions</th></tr>'
    document.querySelector('thead').innerHTML = strHTML

    strHTML = books.map(book => ` 
    <tr><td>${book.id}</td>
    <td>${book.title}</td>
    <td>&dollar;${book.price}</td>
    <td><button onclick="onDetailsBook('${book.id}')">Details</button> </td>
        <td><button onclick="onUpdateBook('${book.id}')">Update</button></td>
        <td><button onclick="onDeleteBook('${book.id}')">Delete</button></td></tr>`)

    document.querySelector('tbody').innerHTML = strHTML.join('')

    renderPageNav()
}

function renderPageNav(){
    
    var pageIdx = getPageIdx()
    document.querySelector('.prev-page').disabled = (pageIdx === 0)? true: false
    
    // var books = getBooksForDisplay()
    // var maxDisplayIdx = Math.ceil(books.length/PAGE_SIZE)-1 //HOW DO I GET THE BUTTON TO DISABLE WITH THE FILTER??
    var maxPageIdx = getMaxPageIdx()

    document.querySelector('.next-page').disabled = (pageIdx === maxPageIdx)? true: false
    
    document.querySelector('.page-nav span').innerText = pageIdx+1

}

function onDeleteBook(bookId) {
    deleteBook(bookId)
    renderBooks()
}

function onAddBook() {
    const bookTitle = prompt('Book Title?', 'Some Great Book')
    const bookPrice = +prompt('Book Price?', 15)

    if (bookTitle.trim() && bookPrice) {
        addBook(bookTitle, bookPrice)
        renderBooks()
    }
}

function onUpdateBook(bookId) {

    const book = getBookById(bookId)

    const newBookPrice = prompt('New book price?', book.price)

    if (newBookPrice && newBookPrice !== book.price) {
        updateBookPrice(bookId, newBookPrice)
        renderBooks()
    }

}

function onDetailsBook(bookId) {

    const book = getBookById(bookId)
    var elModal = document.querySelector('.modal')

    elModal.querySelector('h3').innerText = book.title
    elModal.querySelector('h4 span').innerText = book.price
    elModal.querySelector('p').innerText = book.details

    elModal.querySelector('.rate').innerHTML = `Rating: 
    <button class="minus-rating" onclick="onUpdateRating('${book.id}',-1)">-</button>
    <span>${book.rating}</span>
    <button class="plus-rating" onclick="onUpdateRating('${book.id}',1)">+</button>`


    elModal.classList.add('open')
}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
}

function onUpdateRating(bookId, diff) {
    const book = getBookById(bookId)

    const newRating = book.rating + diff
    if (newRating > 10 || newRating < 0) return

    updateBookRating(bookId, diff)
    var elSpan = document.querySelector('.modal .rate span')
    elSpan.innerText = newRating

}

function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)
    renderBooks()

    const queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRating=${filterBy.minRating}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

}

function onNextPage() {
    nextPage()
    renderBooks()
}

function onPrevPage(){
    prevPage()
    renderBooks()
}

// function setNextPage(status){
//     document.querySelector('.next-page').disabled = !status
// }

// function setPrevPage(status){
//     document.querySelector('.prev-page').disabled = !status
// }

