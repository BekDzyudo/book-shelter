let booksArr = [];
let bookmark = [];
let bookmark2 = [];
let searchArr = [];
let resultSoni = document.getElementById("resultSoni");
let bookmarkShow = document.querySelector(".bookmarkShow");

document.getElementById("logout").onclick = function () {
  window.location.replace("../login.html");
};

function getAllBooks() {
  fetch("https://book-shelter-60a65-default-rtdb.firebaseio.com/books.json")
    .then((res) => {
      if (!res.ok) throw new Error("nimadir xato");
      return res.json();
    })
    .then((res) => {
      booksArr = Object.keys(res || {}).map((item) => {
        return {
          ...res[item],
          id: item,
        };
      });
      renderHtmlBookUser();
    })
    .catch((err) => {})
    .finally(() => {
      resultSoni.value = booksArr.length;
    });
}
getAllBooks();

let booksBlock = document.querySelector(".booksBlock");

function renderHtmlBookUser() {
  let result = booksArr
    .map((item, index) => {
      let d = new Date(item.date_publish);
      let datestring =
        d.getDate() +
        "." +
        (d.getMonth() + 1) +
        "." +
        d.getFullYear() +
        " " +
        d.getHours() +
        ":" +
        d.getMinutes();

      let result = `
      <div class="bookCard">
      <div class="bookImage">
        <img src=${item.image} alt="" />
      </div>
      <h3>${item.bookTitle}</h3>
      <p>${item.author}</p>
      <p>${datestring}</p>
      <div class="btntwo">
        <button id="bookmarkBtn" onclick="bookmarkFunc(${index})">Bookmark</button>
        <button>More Info</button>
      </div>
      <button class="readbtn">Read</button>
    </div>
    `;
      return result;
    })
    .join(" ");
  booksBlock.innerHTML = result;
}

function bookmarkFunc(index) {
  let findedElement = booksArr.find((item, index1) => {
    return index == index1;
  });

  let bookmarkObj = {
    bookmarkName: findedElement.bookTitle,
    bookmarkAuthor: findedElement.author,
  };
  if (bookmark.includes(bookmarkObj.bookmarkName)) {
  } else {
    bookmark.push(bookmarkObj.bookmarkName);
    bookmark2.push(bookmarkObj);
  }
  bookmarkFunc2();
}

function bookmarkFunc2() {
  let element = bookmark2
    .map((item, index) => {
      let result = `
        <div class="bookmarkCard">
        <div class="desc">
        <h3>${item.bookmarkName}</h3>
        <p>${item.bookmarkAuthor}</p>
      </div>
      <div class="bookmarkbtnshow">
        <img src="img/book_open.png" alt="" />
        <img src="img/delete_icon.png" onclick="delBookmark(${index})" alt="" />
      </div>
      </div>
        `;
      return result;
    })
    .join(" ");

  bookmarkShow.innerHTML = element;
}
// delete bookmark
function delBookmark(index) {
  bookmark2 = bookmark2.filter((item, index1) => {
    return index !== index1;
  });
  bookmarkFunc2();
}

// search bookmark

function renderSearch() {
  let result = searchArr
    .map((item, index) => {
      let d = new Date(item.date_publish);
      let datestring =
        d.getDate() +
        "." +
        (d.getMonth() + 1) +
        "." +
        d.getFullYear() +
        " " +
        d.getHours() +
        ":" +
        d.getMinutes();

      let result = `
        <div class="bookCard">
        <div class="bookImage">
          <img src=${item.image} alt="" />
        </div>
        <h3>${item.bookTitle}</h3>
        <p>${item.author}</p>
        <p>${datestring}</p>
        <div class="btntwo">
          <button id="bookmarkBtn" onclick="bookmarkFunc(${index})">Bookmark</button>
          <button>More Info</button>
        </div>
        <button class="readbtn">Read</button>
      </div>
      `;
      return result;
    })
    .join(" ");
  booksBlock.innerHTML = result;
}

document.getElementById("searchBook").addEventListener("input", (e) => {
  if (e.target.value === "") {
    searchArr = booksArr;
  } else if (e.target.value) {
    searchArr = booksArr.filter((item) => {
      return item.bookTitle
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
  }
  renderSearch();
});
