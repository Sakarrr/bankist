'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Sakar Shrestha',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2024-06-01T17:01:17.194Z',
    '2024-06-04T23:36:17.929Z',
    '2024-06-06T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Prajwol Shakya',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

// const account3 = {
//   owner: 'Mridula Sthapit',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Suraj Lohani',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelSumInterestRate = document.querySelector(
  '.summary__value--interest-rate'
);
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Functions

const formatMovement = function (date) {
  const calcdaysPassed = (date1, date2) =>
    Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));
  const daysPassed = calcdaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();

  return `${day},${month}, ${year}`;
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ''; // Clear div for any hard coded datas.

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovement(date);

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type.toUpperCase()} </div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">Rs. ${mov.toFixed(2)}</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// console.log(containerMovements.innerHTML); // Read HTML contents.

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `Rs. ${acc.balance.toFixed(2)}`;
};

const calcDisplaySummary = function (movements, interestRate) {
  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);

  labelSumIn.textContent = `Rs. ${incomes.toFixed(2)}`;

  const outgoings = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `Rs. ${Math.abs(outgoings).toFixed(2)}`;

  const interest = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int);
  labelSumInterest.textContent = `Rs. ${interest.toFixed(2)}`;
  labelSumInterestRate.textContent = `${interestRate}%`;
};

const createUserNames = function (accs) {
  accs.forEach(function (accs) {
    accs.username = accs.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserNames(accounts);

const updateUI = function (acc) {
  // Display movements.
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc.movements, acc.interestRate);
};

// Event Handlers
let currentAccount = '';

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent form from submitting

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    console.log('Login');
    // Display UI and Message.
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hours = `${now.getHours()}`.padStart(2, 0);
    const mins = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hours}:${mins}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const reciever = accounts.find(acc => acc.username === inputTransferTo.value);

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    reciever &&
    currentAccount.balance >= amount &&
    reciever?.username !== currentAccount.username
  ) {
    console.log('Transfer Valid');

    // Doing the transfer
    currentAccount.movements.push(-amount);
    reciever.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    reciever.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());

    console.log(accounts);

    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    inputCloseUsername.value = inputClosePin.value = '';

    // Delete User
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
