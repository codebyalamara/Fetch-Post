const cl = console.log;

const BASE_URL = `https://jsonplaceholder.typicode.com`

const POST_URL = `${BASE_URL}/posts`

const postForm = document.getElementById('postForm')
const titleControl = document.getElementById('title')
const bodyControl = document.getElementById('body')
const userIdControl = document.getElementById('userId')
const addPostBtn = document.getElementById('addPostBtn')
const updatePostBtn = document.getElementById('updatePostBtn')
const spinner = document.getElementById('spinner')

let postsArr = []

function snackbar (msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000
    })
}

function createPostCards(arr) {
    const postContainer = document.getElementById('postContainer')
    let result = ''
    arr.forEach(post => {
        result += `
            <div class="col-md-3 mb-3" id="${post.id}">

                <div class="card post-card h-100">

                    <div class="card-header">
                        <h3>
                           ${post.title}
                        </h3>
                    </div>

                    <div class="card-body">
                        <p>
                            ${post.body}
                        </p>
                    </div>

                    <div class="card-footer d-flex justify-content-between">

                        <button
                            onclick="onEdit(this)"
                            class="btn btn-sm btn-outline-info"
                        >
                            Edit
                        </button>

                        <button
                            onclick="onRemove(this)"
                            class="btn btn-sm btn-outline-danger"
                        >
                            Remove
                        </button>

                    </div>

                </div>

            </div>
        `
    })

    postContainer.innerHTML = result
}


function createSingleCard (obj) {
    let col = document.createElement('div')
    col.className = `col-md-3 mb-3`
    col.id = obj.id

    col.innerHTML = `
        <div class="card post-card h-100">

            <div class="card-header">
                <h3>
                    ${obj.title}
                </h3>
            </div>

            <div class="card-body">
                <p>
                    ${obj.body}
                </p>
            </div>

            <div class="card-footer d-flex justify-content-between">

                <button
                    onclick="onEdit(this)"
                    class="btn btn-sm btn-outline-info"
                >
                    Edit
                </button>

                <button
                    onclick="onRemove(this)"
                    class="btn btn-sm btn-outline-danger"
                >
                    Remove
                </button>

            </div>

        </div>
    `

    const postContainer = document.getElementById('postContainer')
    postContainer.prepend(col)

    snackbar(
        `New Card with id ${obj.id} created successfully !!!`,
        'success'
    )
}

function fetchPosts () {

    spinner.classList.remove('d-none')
    fetch(POST_URL, {
        method: 'GET',
        body: null,
        headers: {
            'Content-type': 'application/json',
            Auth: 'TOKEN LS'
        }
    })
    .then(res => {
        return res.json()
    })
    .then(data => {
        for (const key in data) {
            postsArr.unshift({
                ...data[key],
                id: key
            })
        }
        createPostCards(postsArr)
    })
    .catch(err => {
        snackbar(err, 'error')
    })
    .finally(() => {
        spinner.classList.add('d-none')
    })
}

fetchPosts()


function onPostAdd (eve) {
    eve.preventDefault()

    if(
    !titleControl.value.trim() ||
    !bodyControl.value.trim() ||
    !userIdControl.value
    ){
    Swal.fire({
        title: 'All Fields Are Required',
        icon: 'warning'
    })
    return
}

    spinner.classList.remove('d-none')

    let POST_OBJ = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
    }

    fetch(POST_URL, {
        method: 'POST',
        body: JSON.stringify(POST_OBJ),
        headers: {
            'Content-type': 'application/json',
            Auth: 'TOKEN LS'
        }
    })

    .then(res => {
        return res.json()
    })

    .then(data => {

        cl(data) // {name : 'wqebofquihr23r8'}

        POST_OBJ.id = data.id

        createSingleCard(POST_OBJ)

        postForm.reset()

    })

    .catch(err => {
        snackbar(err, 'error')
    })

    .finally(() => {
        spinner.classList.add('d-none')
    })
}

function onRemove (ele) {
    let REMOVE_ID = ele.closest('.col-md-3').id
    let REMOVE_URL = `${BASE_URL}/posts/${REMOVE_ID}.json`

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Remove it!'
    })

    .then(result => {
        if (result.isConfirmed) {
            spinner.classList.remove('d-none')
            fetch(REMOVE_URL, {
                method: 'DELETE',
                body: null
            })

            .then(res => {
                return res.json()
            })

            .then(data => {
                cl(data)
                 document.getElementById(REMOVE_ID).remove()
                snackbar(
                    `The post with id ${REMOVE_ID} is removed successfully !!!`,
                    'success'
                )
            })

            .catch(err => {
                snackbar(err, 'error')
            })

            .finally(() => {
                spinner.classList.add('d-none')
            })
        }
    })
}

function onEdit (ele) {
    spinner.classList.remove('d-none')

    let EDIT_ID = ele.closest('.col-md-3').id

    localStorage.setItem('EDIT_ID', EDIT_ID)

    let EDIT_URL = `${BASE_URL}/posts/${EDIT_ID}`

    fetch(EDIT_URL, {
        method: 'GET',
        body: null,
        headers: {
            'Content-type': 'application/json',
            Auth: 'TOKEN LS'
        }
    })
    .then(res => res.json())
    .then(data => {
        cl(data)

        titleControl.value = data.title
        bodyControl.value = data.body
        userIdControl.value = data.userId

        addPostBtn.classList.add('d-none')
        updatePostBtn.classList.remove('d-none')
    })
    .catch(err => {
        snackbar(err, 'error')
    })
    .finally(() => {
        spinner.classList.add('d-none')
    })
}

function onPostUpdate () {

    if(
        !titleControl.value.trim() ||
        !bodyControl.value.trim() ||
        !userIdControl.value
    ){
        Swal.fire({
            title: 'All Fields Are Required',
            icon: 'warning'
        })
        return
    }
    spinner.classList.remove('d-none')

    let UPDATE_ID = localStorage.getItem('EDIT_ID')

    let UPDATE_URL = `${BASE_URL}/posts/${UPDATE_ID}`

    let UPDATE_OBJ = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
    }

    fetch(UPDATE_URL, {
        method: 'PATCH',
        body: JSON.stringify(UPDATE_OBJ),
        headers: {
            'Content-type': 'application/json',
            Auth: 'TOKEN LS'
        }
    })
    .then(res => res.json())
    .then(data => {
        cl(data)

        let card = document.getElementById(UPDATE_ID)

        card.querySelector('.card-header h3').innerHTML = UPDATE_OBJ.title
        card.querySelector('.card-body p').innerHTML = UPDATE_OBJ.body

        postForm.reset()

        addPostBtn.classList.remove('d-none')
        updatePostBtn.classList.add('d-none')

        localStorage.removeItem('EDIT_ID')

        snackbar(`Post with id ${UPDATE_ID} updated successfully !!!`, 'success')
    })
    .catch(err => {
        snackbar(err, 'error')
    })
    .finally(() => {
        spinner.classList.add('d-none')
    })
}

updatePostBtn.addEventListener('click', onPostUpdate)
postForm.addEventListener('submit', onPostAdd)
//updatePostBtn.addEventListener('click', onUpdate)