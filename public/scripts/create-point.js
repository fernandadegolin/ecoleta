// ================= CADASTRO DE ESTADO E CIDADE ================= //
function populateUFs() {

    const ufSelect = document.querySelector('select[name=uf]')

    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(resposta => (resposta.json())  //Varias opções que podem ser escritas
            .then(states => {
                for (const state of states) {
                    ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
                }
            }))
}

populateUFs()

function getCities(event) {

    const citySelect = document.querySelector('select[name=city]') // Busquei meu campo CIDADE
    const stateInput = document.querySelector('input[name=state') // Preparar para que o nome do estado seja visto na URL


    const ufValue = event.target.value // Variavel que mostra qual o valor do ESTADO

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text



    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value=>Selecione a Cidade</option>" //Deixar o campo CIDADE limpo para o proximo ESTADO
    citySelect.disabled = true // 

    fetch(url)
        .then(resposta => (resposta.json())

            .then(cities => {

                for (const city of cities) {
                    citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
                }

                citySelect.disabled = false // Habilitar o campo que estava desabilitado no HTML
            }))
}


document
    .querySelector('select[name=uf]')
    .addEventListener('change', getCities)


/*
    //opção 1 de escrita 'inteira'
    .then(function (resp) {
        return resp.json()
    })

    //opção 2 de escrita 'semi-resumida'
    .then((res) => { return res.json() })

    //opção 3 de escrita 'resumida'
    .then(res => (res.json()) */


// ================= ITENS DE COLETA ================= //

const itemsToCollect = document.querySelectorAll('.items-grid li')

for (const item of itemsToCollect) {
    item.addEventListener('click', handleSelectedItem)
}

// Atualizar o campo Hidden no HTML (Passo 1/2)
const collectedItems =  document.querySelector('input[name=items')


let selectedItems = [] //array dos itens (Pertence a logica do algaritmo)

function handleSelectedItem(event) {
    const itemLi = event.target

    //adicionar e remover uma classe com JS
    itemLi.classList.toggle('selected')

    const itemId = itemLi.dataset.id

    //console.log('ITEM ID: ', itemId) USO PARA VER SE ESTA TD FUNCIONANDO//


    // Algoritmo - Logica: 
    // 1) Verificar se existe itens selecionados
        // a) SIM - remover selecao
        // b) NÃO - adicionar selecão

    // 1
    const alreadySelected = selectedItems.findIndex(
        function (item) {
            const itemFound = item == itemId // Vai retornar true or false
            return itemFound
        })

    // 1.a SIM - remover selecao
        if(alreadySelected >= 0){
            const filteredItems = selectedItems.filter(
                function (item) {
                    const itemIsDifferent = item != itemId
                    return itemIsDifferent
                })
            
            selectedItems = filteredItems // Aplicando um novo valor a LET 

    // 1.b - NÃO - adicionar selecão
        } else{
            selectedItems.push(itemId)
        }

        // console.log('selectedItems: ', selectedItems) USO PARA VER SE ESTA TD FUNCIONANDO
        
    // Atualizar o campo Hidden no HTML (Passo 2/2)
        collectedItems.value = selectedItems
}
