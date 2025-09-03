// Seleciona os elementos do formulário
const form = document.querySelector('form')
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

//seleciona os elementos da lista 
const expenseList = document.querySelector("ul");
const expenseQuantity = document.querySelector('aside header p span')
const expenseTotal = document.querySelector('aside header h2')
// criado objeto
const data = []
//Seleciona somente o valor numérico
amount.oninput = () => {
  let value = amount.value.replace(/\D/g, "");
  //Transforma o valor em centavos
  value = Number(value / 100)
  amount.value = formatCurrencyBRL(value);
}
// Formata o valor no padrão BRL (Real Brasileiro)
function formatCurrencyBRL(value) {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return value;
}

form.onsubmit = (event) => {
  event.preventDefault();
  const newExpense = {
    id: Date.now(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date()
  };
  expenseAdd(newExpense);
};
// Adiciona um novo item na lista 
function expenseAdd(newExpense) {
  try {
    // Cria o elemento para adicionar na lista
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    // Cria o icone da categoria 
    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", "Ícone de tipo da despesa");

    // Cria expense info
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");
    const strongInfo = document.createElement("strong");
    const spanInfo = document.createElement("span");

    //adiconado informaçoes 
    strongInfo.innerHTML = `${newExpense.expense}`;
    spanInfo.innerHTML = `${newExpense.category_name}`;
    expenseInfo.append(strongInfo, spanInfo);

    // amount 
    const amountInfo = document.createElement('span')
    amountInfo.classList.add('expense-amount')
    amountInfo.innerHTML = `<small>R$</small> ${newExpense.amount.toUpperCase().replace("R$", "")}`

    // Icon de remove 
    const removeIcon = document.createElement("img");
    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "remover");
    removeIcon.classList.add("remove-icon");

    // Adiciona as informações do item 
    expenseItem.append(expenseIcon, expenseInfo, amountInfo, removeIcon);
    // Adicionando na lista
    expenseList.append(expenseItem);
    // atualiza os totais 
    updateTotals();
  } catch (error) {
    alert("Não foi possivel atualizar a lista de despensas")
    console.log(error)
  }
}
// Atualiza os totais 
function updateTotals() {
  try {
    // Recupera todos os itens (li) na lista 
    const items = expenseList.children
    expenseQuantity.textContent = `${items.length} ${items.length === 1 ? "despesa" : "despesas"}`

    //variável para incrmentar o total 
    let total = 0
    ///percorre cada item (li) da lista 
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount")
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")
      // converter para float 
      value = parseFloat(value)
      //verificar se é um número válido

      console.log(typeof (value))
      if (isNaN(value)) {
        return alert("Não foi possível calcular o total")
      }
      total += Number(value)
    }
    // criar a span para adicionar o R$ formatado 

    const symbolBRL = document.createElement('small')

    symbolBRL.textContent = "R$"

    total = formatCurrencyBRL(total).toUpperCase().replace('R$', "")
    expenseTotal.innerHTML = ""
    expenseTotal.append(symbolBRL, total)
    formClear()
  } catch (error) {
    alert("Não foi possivel atualizar os totais")
    console.log(error)
  }
}
// Evento que captura o clique nos itens da lista

expenseList.addEventListener("click", (event) => {
  //verificar se é o item de remove 
  if (event.target.classList.contains("remove-icon")) {
    /// obeter a li pai do elemnto clicado 
    const item = event.target.closest(".expense");
    item.remove();
  }
  updateTotals();
})

function formClear() {
  expense.value = "";
  category.value = "";
  amount.value = "";
}