const BASE_URL = 'http://localhost:8000'
window.onload = async () => {
    await loadData()
}

const loadData = async () => {
    const response = await axios.get(`${BASE_URL}/users`)
    console.log(response.data)

    const userDom = document.getElementById('user')

    let htmlData = `
    <table class="user-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>`;

    response.data.forEach(users => {
        htmlData += `
            <tr>
                <td>${users.id}</td>
                <td>${users.firstname}</td>
                <td>${users.lastname}</td>
                <td>
                    <a href='index.html?id=${users.id}' style='text-decoration: none; '>
                        <button class='button edit' data-id='${users.id}'>Edit</button>
                    </a>
                    <button class='button delete' data-id='${users.id}'>Delete</button>
                </td>
            </tr>`;
    });

    htmlData += `</tbody></table>`;
    
    userDom.innerHTML = htmlData
    
    let deleteDOM = document.getElementsByClassName('delete');

    [...deleteDOM].forEach((element) => {
        element.addEventListener('click', async (event) => {
            let id = event.target.dataset.id;

            try {
                await axios.delete(`${BASE_URL}/users/${id}`);
                loadData();  // Reload data after deletion
            } catch (error) {
                console.log('error', error);
            }
        });
    });

}