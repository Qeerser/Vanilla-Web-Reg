const BASE_URL = 'http://localhost:8000'
// default mode ของหน้านี้คือ mode สร้าง
let mode = 'CREATE'
let selectedId = -1

window.onload = async () => {
 
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')
  
  if (id) {
    mode = 'EDIT'
    selectedId = id
    document.getElementsByClassName('header')[0].innerText = 'Edit Form'
    document.getElementsByClassName('button')[0].innerText = 'Edit'
    document.getElementsByClassName('reg')[0].style.display = ''
  

  try {
    const response = await axios.get(`${BASE_URL}/users/${id}`)
    const user = response.data
    let firstnameDom = document.querySelector('input[name=firstname]')
    let lastnameDom = document.querySelector('input[name=lastname]')
    let ageDom = document.querySelector('input[name=age]')
    let descriptionDom = document.querySelector('textarea[name=description]')


    let genderDom = document.querySelectorAll('input[name=gender]')
    let interestDom = document.querySelectorAll('input[name=interested]')

    firstnameDom.value = user.firstname
    lastnameDom.value = user.lastname
    ageDom.value = user.age
    descriptionDom.value= user.description

    Array.from(genderDom).forEach(element => {
      element.checked = element.value == user.gender
    });

    Array.from(interestDom).forEach(element => {
      element.checked = user.interests.includes(element.value)
    });
    

  } catch (error) {
    console.log(error.message)
  }
  }
}

const validateData = (userData) => {
    let errors = []
    if (!userData.firstname) {
      errors.push('กรุณาใส่ชื่อจริง')
    }
    if (!userData.lastname) {
      errors.push('กรุณาใส่นามสกุล')
    }
    if (!userData.age) {
      errors.push('กรุณาใส่อายุ')
    }
    if (!userData.description) {
      errors.push('กรุณาใส่คำอธิบาย')
    }
    if (!userData.interests) {
      errors.push('กรุณาเลือกความสนใจอย่างน้อย 1 อย่าง')
    }
    return errors
  }

const submitData = async () => {
    console.log("submit")

    let firstnameDom = document.querySelector('input[name=firstname]')
    let lastnameDom = document.querySelector('input[name=lastname]')
    let ageDom = document.querySelector('input[name=age]')
    let genderDom = document.querySelector('input[name=gender]:checked')
    let interestDom = document.querySelectorAll('input[name=interested]:checked')
    let descriptionDom = document.querySelector('textarea[name=description]')

    let messageDom = document.getElementById('message')

    let interest  = ''
    for (let i = 0 ; i < interestDom.length ;i++){
        interest += interestDom[i].value
        if (i != interestDom.length - 1){
            interest += ', '
        }
    }
    
    try {
        let userData = {
        firstname : firstnameDom.value,
        lastname : lastnameDom.value,
        age : ageDom.value,
        gender : genderDom.value,
        interests : interest,
        description : descriptionDom.value
        }
        console.log(userData)

        const errors = validateData(userData)
        if(errors.length > 0){
            throw{
                message:"Incomplete information",
                errors : errors
            }
        }

        if (mode == 'CREATE'){
          const response = await axios.post(`${BASE_URL}/users`,userData)
          messageDom.innerText = "Data Saved"
        }
        else{
          console.log(selectedId)
          const response = await axios.put(`${BASE_URL}/users/${selectedId}`,userData)
          messageDom.innerText = "Data Edited"
        }
        messageDom.className = "center message success"

    } catch (error) {
        let messageDOM = 'มีปัญหาเกิดขึ้น'
        if (error.errors && error.errors.length > 0) {
        messageDOM = '<div>'
        messageDOM += `<div class ="center head">${error.message}</div>`
        messageDOM += '<ul>'
        for (let i = 0; i < error.errors.length; i++) {
            messageDOM += `<li>${error.errors[i]}</li>`
        }
        messageDOM += '</ul>'
        messageDOM += '</div>'
        }
        messageDom.innerHTML = messageDOM
        messageDom.className = "message danger"
            
        }
        
    
}