// 기본 상태 변수
let history = [];
let currentInput = "";
let firstNumber = null;
let operator = null;

const VALID_OPERATORS = ["+", "-", "*", "/"];

// 숫자 추가 (화살표 함수)
const appendNumber = (number) => {
  try {
    if (!/^[0-9]$/.test(number)) throw new Error("유효한 숫자를 입력하세요.");
    currentInput += number;
    const display = document.getElementById("display");
    if (!display) throw new Error("디스플레이 요소를 찾을 수 없습니다.");
    display.textContent = currentInput;
    hideError();
  } catch (error) {
    showError(error.message);
  }
};

// 연산자 설정 (화살표 함수)
const setOperator = (op) => {
  try {
    if (!VALID_OPERATORS.includes(op))
      throw new Error("유효한 연산자를 선택하세요.");
    if (currentInput === "") throw new Error("숫자를 먼저 입력하세요.");
    firstNumber = parseFloat(currentInput);
    operator = op;
    currentInput = "";
    const opSymbol = { "+": "+", "-": "−", "*": "×", "/": "÷" };
    const display = document.getElementById("display");
    if (display) display.textContent = firstNumber + " " + opSymbol[op];
    hideError();
  } catch (error) {
    showError(error.message);
  }
};

// 계산 실행 (화살표 함수)
const calculate = () => {
  try {
    if (firstNumber === null) throw new Error("첫 번째 숫자를 입력하세요.");
    if (operator === null) throw new Error("연산자를 선택하세요.");
    if (currentInput === "") throw new Error("두 번째 숫자를 입력하세요.");
    const secondNumber = parseFloat(currentInput);
    if (operator === "/" && secondNumber === 0)
      throw new Error("0으로 나눌 수 없습니다.");
    let result;
    switch (operator) {
      case "+":
        result = firstNumber + secondNumber;
        break;
      case "-":
        result = firstNumber - secondNumber;
        break;
      case "*":
        result = firstNumber * secondNumber;
        break;
      case "/":
        result = firstNumber / secondNumber;
        break;
    }
    result = parseFloat(result.toFixed(10));
    const opSymbol = { "+": "+", "-": "−", "*": "×", "/": "÷" };
    history.push(
      `${firstNumber} ${opSymbol[operator]} ${secondNumber} = ${result}`
    );
    renderHistory();
    const display = document.getElementById("display");
    if (display) display.textContent = result;
    currentInput = String(result);
    firstNumber = null;
    operator = null;
    hideError();
  } catch (error) {
    showError(error.message);
  }
};

// 전체 초기화 (함수 선언문)
function clearAll() {
  currentInput = "";
  firstNumber = null;
  operator = null;
  const display = document.getElementById("display");
  if (display) display.textContent = "0";
  hideError();
}

// 에러 표시 (화살표 함수)
const showError = (message) => {
  const el = document.getElementById("result");
  if (!el) return;
  el.classList.remove("d-none", "alert-info");
  el.classList.add("alert-danger");
  el.textContent = `에러: ${message}`;
};

// 에러 숨기기 (화살표 함수)
const hideError = () => {
  const el = document.getElementById("result");
  if (!el) return;
  el.classList.add("d-none");
  el.classList.remove("alert-danger", "alert-info");
};

// 계산 기록 렌더링 (함수 선언문)
function renderHistory() {
  const list = document.getElementById("history-list");
  if (!list) return;
  list.innerHTML = "";
  for (let i = history.length - 1; i >= 0; i--) {
    const li = document.createElement("li");
    li.textContent = history[i];
    list.appendChild(li);
  }
}

// 기록 삭제 (함수 표현식)
const clearHistory = function () {
  history = [];
  renderHistory();
};

// [추가 기능 1] 소수점 입력 (화살표 함수)
const appendDot = () => {
  if (currentInput.includes(".")) return;
  if (currentInput === "") currentInput = "0";
  currentInput += ".";
  const display = document.getElementById("display");
  if (display) display.textContent = currentInput;
};

// [추가 기능 2] 백스페이스 (화살표 함수)
const backspace = () => {
  if (currentInput.length === 0) return;
  currentInput = currentInput.slice(0, -1);
  const display = document.getElementById("display");
  if (display) display.textContent = currentInput === "" ? "0" : currentInput;
};

// [추가 기능 3] 제곱근 (함수 선언문)
function squareRoot() {
  try {
    if (currentInput === "") throw new Error("숫자를 먼저 입력하세요.");
    const num = parseFloat(currentInput);
    if (num < 0) throw new Error("음수는 제곱근을 구할 수 없습니다.");
    const result = parseFloat(Math.sqrt(num).toFixed(10));
    history.push(`√${num} = ${result}`);
    renderHistory();
    currentInput = String(result);
    const display = document.getElementById("display");
    if (display) display.textContent = result;
  } catch (error) {
    showError(error.message);
  }
}

// [추가 기능 4] 제곱 (함수 선언문)
function square() {
  try {
    if (currentInput === "") throw new Error("숫자를 먼저 입력하세요.");
    const num = parseFloat(currentInput);
    const result = parseFloat((num * num).toFixed(10));
    history.push(`${num}² = ${result}`);
    renderHistory();
    currentInput = String(result);
    const display = document.getElementById("display");
    if (display) display.textContent = result;
  } catch (error) {
    showError(error.message);
  }
}

// [추가 기능 5] 키보드 입력 지원 (화살표 함수)
document.addEventListener("keydown", (event) => {
  const key = event.key;
  if (/^[0-9]$/.test(key)) appendNumber(key);
  else if (VALID_OPERATORS.includes(key)) setOperator(key);
  else if (key === "Enter" || key === "=") calculate();
  else if (key === "Backspace") backspace();
  else if (key === "Escape") clearAll();
  else if (key === ".") appendDot();
});
