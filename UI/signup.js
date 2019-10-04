const generateForm = document.querySelector('#generate-form');
const generate = document.querySelector('.generate');
const generateBtn = document.querySelector('.generate-btn');
const userWrap = document.querySelector('.userInfo');
const logoutBtn = document.querySelector('.logout');
const viewPlateNumberBtn = document.querySelector('.view-all');
const platenumberWrap = document.querySelector('.platenumbers-wrap');
const wrapper = document.querySelector('.view-platenumbers');
const locationDropDown = document.querySelector('#location');

const cardTemplate = ({ id, name, date, platenumber }) => `
<div id="${id}" class="card">
  <h2>${platenumber}</h2>
  <p class="name"><strong>Name : </strong>${name}</p>
  <p class="date"><strong>Date : </strong> ${moment(date).format('lll')}</p>
</div>`;

const optionTemplate = value => `
  <option value="${value}">
    ${value}
  </option>`;

window.addEventListener('load', async () => {
  if (localStorage.user && localStorage.token) {
    loginUser();
  }
});

const getCodes = async () => {
  const url = 'http://localhost:3000/codes';
  const { responseObj } = await fetchCall({ url, method: 'GET' });
  let templateWrap = `
    <option value="Choose" selected disabled>
      Choose your L.G.A
    </option>
   `;
  responseObj.data.forEach(element => {
    templateWrap = templateWrap + optionTemplate(element);
  });
  locationDropDown.innerHTML = templateWrap;
}

const loginUser = async () => {
  formWrap.style.display = 'none';
  generate.style.display = 'block';
  userWrap.style.display = 'flex';
  const user = JSON.parse(localStorage.user);
  userWrap.querySelector('p').textContent = `${user.first_name} ${user.last_name}`;
  await getCodes();
};

const logout = () => {
  formWrap.style.display = 'flex';
  generate.style.display = 'none';
  userWrap.style.display = 'none';
  localStorage.clear();
};

logoutBtn.addEventListener('click', e => {
  logout();
  window.location.reload();
})

const fetchCall = async ({ url, method, body, token }) => {
  const objData = {
    method,
    headers: new Headers({
      'Content-Type': 'application/json',
      token: localStorage.token || null
    }),
    body: JSON.stringify(body),
  };
  try {
    const response = await fetch(url, objData);
    const statusCode = response.status;
    const responseObj = await response.json();
    return { responseObj, statusCode };
  } catch (err) {
    return { error: err.message };
  }
};

const formWrap = document.querySelector('.form-wrap');

formWrap.addEventListener('submit', async (e) => {
  e.preventDefault();
  const inputs = e.target.querySelectorAll('input');
  let obj = {};
  const message = e.target.querySelector('.message');
  const btn = e.target.querySelector('button');
  const btnText = btn.textContent;
  btn.textContent = 'Loading...';
  inputs.forEach(element => {
    obj = { ...obj, [element.name]: element.value }
  });

  const url = (e.target.id === 'signup-form') ? 'http://localhost:3000/auth/signup' : 'http://localhost:3000/auth/signin'

  const { statusCode, responseObj } = await fetchCall({ url, method: 'POST', body: obj });

  if (statusCode === 200 || statusCode === 201) {
    localStorage.token = responseObj.token;
    localStorage.user = JSON.stringify(responseObj.data);
    await loginUser();
  }
  else {
    message.textContent = responseObj.message;
  }
  btn.textContent = btnText;
})

generateForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  generateBtn.textContent = 'Loading...';
  const inputs = e.target.querySelectorAll('input');
  let obj = {};
  const message = e.target.querySelector('.result');
  inputs.forEach(element => {
    obj = { ...obj, [element.name]: element.value }
  });

  obj = { ...obj, location: locationDropDown.value };

  const url = 'http://localhost:3000/generate';
  const { statusCode, responseObj } = await fetchCall({ url, method: 'POST', body: obj });

  if (statusCode === 200 || statusCode === 201) {
    let templateWrap = '';
    responseObj.data.forEach(({ platenumber, id }) => {
      templateWrap = templateWrap + `<span id="num-${id}">${platenumber}</span>`;
    });
    message.style.display = 'flex';
    message.innerHTML = templateWrap;
    generateBtn.textContent = 'generate';
  }
  else {
    logout();
  }
})

viewPlateNumberBtn.addEventListener('click', async () => {
  const displayType = platenumberWrap.style.display;
  if (displayType === 'block') {
    platenumberWrap.style.display = 'none';
    viewPlateNumberBtn.textContent = 'view plate-numbers';
  }
  else {
    viewPlateNumberBtn.textContent = 'Loading...';
    const url = 'http://localhost:3000/generate';
    const { statusCode, responseObj } = await fetchCall({ url, method: 'GET' });
    if (statusCode === 200) {
      let templateWrap = '';

      responseObj.data.forEach(({ id, owner: { first_name, last_name }, createdAt, platenumber }) => {
        templateWrap = templateWrap + cardTemplate({ id, name: `${first_name} ${last_name}`, date: createdAt, platenumber });
      })
      wrapper.innerHTML = templateWrap;
      platenumberWrap.style.display = 'block';
      viewPlateNumberBtn.textContent = 'hide plate-numbers';
    }
    else {
      logout();
    }
  }

})