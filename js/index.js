const SaveBtn = document.getElementById("SaveBtn");
const bookTitle = document.getElementById("bookTitle");
const author = document.getElementById("author");
const category = document.getElementById("category");
const price = document.getElementById("price");
const date_publish = document.getElementById("date_publish");
const raiting = document.getElementById("raiting");
const image = document.getElementById("image");
let modalForm = document.getElementById("modalForm");
const AddBook = document.getElementById("AddBook");
let addBookModal = document.querySelector(".addBookModal");
let CloseBtn = document.getElementById("CloseBtn");
let globalImageUrl;
// edit
let SaveBtnEdit = document.getElementById("SaveBtnEdit");
let CloseBtnEdit = document.getElementById("CloseBtnEdit");
const editbookTitle = document.getElementById("editbookTitle");
const editauthor = document.getElementById("editauthor");
const editcategory = document.getElementById("editcategory");
const editprice = document.getElementById("editprice");
const editdate_publish = document.getElementById("editdate_publish");
const editraiting = document.getElementById("editraiting");
const editimage = document.getElementById("editimage");
let editmodalForm = document.getElementById("editmodalForm");
let editBtn = document.getElementById("editBtn");

let booksArr = [];

AddBook.onclick = function () {
  addBookModal.style.display = "block";
};

function saveBookData(e) {
  e.preventDefault();
  const bookObj = {
    bookTitle: bookTitle.value,
    author: author.value,
    category: category.value,
    price: price.value,
    date_publish: date_publish.value,
    raiting: raiting.value,
    image: globalImageUrl,
  };

  let arr = Object.keys(bookObj).filter((key) => !bookObj[key]);

  if (arr.length) {
    arr.filter((item) => {
      document.getElementById(`${item}`).classList.add("error_input");
    });
    return;
  }

  showBtnLoading(true);

  fetch("https://book-shelter-60a65-default-rtdb.firebaseio.com/books.json", {
    method: "POST",
    body: JSON.stringify(bookObj),
  })
    .then((res) => {
      if (!res.ok) throw new Error("nimadir xato");
      return res.json();
    })
    .then((res) => {
      modalForm.reset();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      showBtnLoading(false);
      getAllBooks();
    });

  addBookModal.style.display = "none";
}

SaveBtn.addEventListener("click", saveBookData);

function showBtnLoading(show) {
  if (show) {
    SaveBtn.value = `
    <div class="spinner-border text-light" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
    `;
  } else {
    SaveBtn.value = "Save";
  }
}

Array.from(modalForm).forEach((item) => {
  item.addEventListener("change", (e) => {
    if (e.target.value) {
      e.target.classList.remove("error_input");
    } else {
      e.target.classList.add("error_input");
    }
  });
});

CloseBtn.onclick = function () {
  addBookModal.style.display = "none";
};

function getAllBooks() {
  loaderForBooks(true);
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
      renderHtmlBook();
      // renderHtmlBookUser();
    })
    .catch((err) => {})
    .finally(() => {
      loaderForBooks(false);
    });
}

function renderHtmlBook() {
  let result = booksArr
    .map((item, index) => {
      let starElement = "";
      if (item.raiting > 5) {
        item.raiting = 5;
        for (let i = 0; i < item.raiting; i++) {
          starElement += `<img src="img/star.svg" alt="" />`;
        }
      } else if (item.raiting < 1) {
        item.raiting = 1;
        for (let i = 0; i < item.raiting; i++) {
          starElement += `<img src="img/star.svg" alt="" />`;
        }
      } else {
        for (let i = 0; i < item.raiting; i++) {
          starElement += `<img src="img/star.svg" alt="" />`;
        }
      }

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
    <li>
    <div class="card1">
      <div class="book_img">
        <img src=${item.image} />
      </div>
      <div class="book_desc">
        <div>
          <h2>
           ${item.bookTitle}
          </h2>
          <p class="autor">
            by <span>${item.author}</span> et al. |
            ${datestring}
          </p>
          <div class="raiting">
           ${starElement}
          </div>
          <p class="cost">Price: <span>${item.price.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            " "
          )} so'm</span></p>
        </div>
        <div class="book_desc_btnShow">
          <button id="editBtn" onclick="editBookItem(${index})">Edit</button>
          <button id="deleteBtn" onclick="deleteBookItem(${index})">Delete</button>
        </div>
      </div>
    </div>
  </li>
    `;
      return result;
    })
    .join(" ");
  document.getElementById("listBlock").innerHTML = result;
}

getAllBooks();

function loaderForBooks(show) {
  if (show) {
    document.getElementById("loading").classList.add("d-flex");
  } else {
    document.getElementById("loading").classList.remove("d-flex");
    document.getElementById("loading").classList.add("d-none");
  }
}

function deleteBookItem(id) {
  let findedElement = booksArr.find((item, index) => {
    return index == id;
  });

  fetch(
    `https://book-shelter-60a65-default-rtdb.firebaseio.com/books/${findedElement.id}.json`,
    {
      method: "DELETE",
    }
  )
    .then((res) => {
      if (!res.ok) throw new Error("nimadir xato");
      return res.json();
    })
    .then((res) => {
      getAllBooks();
    })
    .catch((err) => {})
    .finally(() => {});
}

// function editBookItem(id) {
//   let findedElement = booksArr.find((item, index) => {
//     return index == id;
//   });

//   fetch(
//     `https://book-shelter-60a65-default-rtdb.firebaseio.com/books/${findedElement.id}.json`,
//     {
//       method: "PUT",
//     }
//   )
//     .then((res) => {
//       if (!res.ok) throw new Error("nimadir xato");
//       return res.json();
//     })
//     .then((res) => {
//       getAllBooks();
//     })
//     .catch((err) => {})
//     .finally(() => {});
// }

// ===============================================================

function filefunc(e) {
  const formData = new FormData();

  Promise.all(
    // [...e.target.files].map((item) => {
    //   formData.append("formFile", item);
    //   return axios.post("https://api.oqot.uz/api/1.0/file/upload", formData);
    // })

    [...e.target.files].map((item) => {
      formData.append("formFile", item);
      return fetch("https://api.oqot.uz/api/1.0/file/upload", {
        method: "POST",
        body: formData,
      }).then((res) => {
        return res.json();
      });
    })
  ).then((res) => {
    globalImageUrl = res
      .map((item) => {
        return `https://api.oqot.uz/api/1.0/file/download/${item}`;
      })
      .join(" ");
  });

  const file1 = e.target.files[0];
  document
    .getElementById("imgExam")
    .setAttribute("src", URL.createObjectURL(file1));
}

image.addEventListener("change", filefunc);
