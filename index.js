//oi
// importando estruturas de módulo externo
import {CVarSistemas,Cprocesso,tabela_processos,Time} from "./estruturas.js";


//exemplo de como se criar um processo
//const proc1 = new Cprocesso(1, 'John', 'UK');

// evento para salvar variaveis do sistema
const VariaveisSistemas = document.querySelector("#variaveis-sistemas");
const BotaoEnviar = document.querySelector("#enviar");


BotaoEnviar.addEventListener("click", event => {
    event.preventDefault();
    BotaoEnviar.required = false; // validando envio de Variaveis de ambiente
    CVarSistemas.algoritmo = VariaveisSistemas[0].value;
    CVarSistemas.quantum = parseInt(VariaveisSistemas[1].value);
    CVarSistemas.sobrecarga = parseInt(VariaveisSistemas[2].value);
    CVarSistemas.velocidade = VariaveisSistemas[3].value;
});


// evento inserção de processos  
const caixa_processos = document.querySelector('#processos-inseridos');

const form_processos = document.querySelector('#insercao_processos');

form_processos.addEventListener('submit', event => {
    event.preventDefault();

    tabela_processos.push(new Cprocesso(++CVarSistemas.QtdProcessosInseridos,
    document.querySelector('#tempo').value, document.querySelector('#deadline').value,document.querySelector('#chegada').value));
        
    var BlocoProcesso = document.createElement("div"),
        BlocoBotao = document.createElement("div"),
        BlocoImagem = document.createElement("div"),
        NovoInput = document.createElement("input"),
        NovoLabel = document.createElement("label"),
        NovaImg = document.createElement("img"),
        TextoLabel = document.createTextNode(CVarSistemas.QtdProcessosInseridos.toString());
            
    BlocoProcesso.setAttribute("id",CVarSistemas.QtdProcessosInseridos.toString());    
        
    NovoInput.setAttribute("type","submit");
    NovoInput.setAttribute("id","excluir");
    NovoInput.setAttribute("name",CVarSistemas.QtdProcessosInseridos.toString());
    NovoInput.setAttribute("value","X");
    NovoInput.setAttribute("class","botao-excluir-processo");
                
    NovoLabel.setAttribute("class","id-processo");
    NovoLabel.appendChild(TextoLabel);
        
    NovaImg.setAttribute("src","icone-processo.jpg");
        
    BlocoBotao.setAttribute("id","bloco-botao");
    BlocoBotao.appendChild(NovoInput);
    BlocoBotao.appendChild(NovoLabel);
        
    BlocoImagem.setAttribute("id","bloco-imagem");
    BlocoImagem.appendChild(NovaImg);
        
    BlocoProcesso.appendChild(BlocoBotao);
    BlocoProcesso.appendChild(BlocoImagem);
        
    caixa_processos.appendChild(BlocoProcesso);
    const BotaoExcluir = document.getElementsByClassName('botao-excluir-processo'); // atualiza a lista de botões
    CVarSistemas.QtdProcessosAtivos++; // atualiza o controle de processos ativos
        
    let NomeChildBotao =  BotaoExcluir[CVarSistemas.QtdProcessosAtivos-1].name; 
        // Evento de clique para todos os botões de Excluir Processo (X)
    if(BotaoExcluir.length){
            
        BotaoExcluir[CVarSistemas.QtdProcessosAtivos-1].addEventListener('click', event => {
                    
                
            event.preventDefault(); // desabilita o comportamento default de um click
                
            // Imprime msg de teste em log
            console.log( "Excluindo o processo: " + NomeChildBotao);

            let IndiceExcluido;
            Array.from(BotaoExcluir).forEach( function(value, index){
                if(value.name === NomeChildBotao){
                    IndiceExcluido = index;
                    return;
                }
            })

            // Imprime msg de teste em log
            console.log( "O seu indice no Array 'BotaoExcluir' é o: " + IndiceExcluido);
                
            // removendo div do processo do elemento Pai  caixa_processos
            caixa_processos.removeChild(caixa_processos.children[IndiceExcluido]);

            // removendo da elemento do array de processos
            tabela_processos.forEach( function(value, index){
                if(value === NomeChildBotao){
                    IndiceExcluido = index;
                    return;
                }
            })
                
            tabela_processos.splice(IndiceExcluido,1);

            // atualiza o controle de processos ativos
            if( CVarSistemas.QtdProcessosAtivos > 0){
                CVarSistemas.QtdProcessosAtivos--;
            }
                
            // Imprime msgs de teste em log
            console.log("Percorrendo o vetor de processos após a exclusão:");
                for (const key in tabela_processos) {
                    console.log(tabela_processos[key].pid);
                }
            console.log( "Agora temos: "+CVarSistemas.QtdProcessosInseridos+" processos inseridos, "+CVarSistemas.QtdProcessosAtivos+" processos ativos.");

                
        });

            
    }
        
    //
    if(caixa_processos.childElementCount){
        const IdProcessoClicado = caixa_processos.childNodes[CVarSistemas.QtdProcessosAtivos-1].id;
        caixa_processos.childNodes[CVarSistemas.QtdProcessosAtivos-1].childNodes[1].addEventListener('click', event => {

            event.preventDefault(); // desabilita o comportamento default de um click

            // pegando o indice atualizado do elemento no array de processos
                
            console.log("Id do processo clicado: "+IdProcessoClicado)
                
            let  indiceProcesso = -1;
            for (const key in tabela_processos) {
                if (tabela_processos[key].pid == IdProcessoClicado) {
                    indiceProcesso = key;
                    break                  
                }
            }
                
                
            console.log("Indice retornou: "+indiceProcesso)
            // Montando a mensagem que será mostrada no alert

            if(indiceProcesso > -1){
                let msg = "                             Informações do Processo\nPID: "+tabela_processos[indiceProcesso].pid+"\nTempo: "+tabela_processos[indiceProcesso].Texecucao+"\nDeadline: "+tabela_processos[indiceProcesso].deadline+"\nChegada: "+tabela_processos[indiceProcesso].Tchegada;
                
                alert(msg);
            }
                
                
        });
    }
        
        
    // move a barra de rolagem do SCROLL da div até o último processo inserido. 
    caixa_processos.scrollLeft = caixa_processos.scrollWidth;

        
});

// adicionando evento para executar o algoritmo e exibir o gráfico na tela
const BotaoExecutar = document.querySelector("#executar").addEventListener("click", event => {
    event.preventDefault();
    
    // validando se as Variaveis de Ambiente foram informadas
    if(BotaoEnviar.required){
        alert("Favor enviar Variaveis de Ambiente!");
        return;
    }
    
    // validando se existem processos a serem executados
    if(tabela_processos.length > 0){
        const Grant = document.querySelector("div#area-grafico .grant"),
        qtd_tabelas = Grant.childElementCount;
    
        // limpando a div antes de inserir novo grafico
        if (qtd_tabelas > 0){
            for(let i=1; i <= qtd_tabelas;i++)
            {
                Grant.removeChild(Grant.childNodes[i]);
            }

        }

        // cria tabela que representa o grafico
        var novaTabela =  document.createElement("table");

        novaTabela.setAttribute('border','0');
        novaTabela.style.borderRadius = "4px";
        novaTabela.setAttribute('width','35px');

        // inserindo titulo da primeira coluna da tabela
        var LinhaTitulo = document.createElement("tr");

        var ColunaTitulo = document.createElement("th");
        ColunaTitulo.innerHTML = "&nbsp";

        LinhaTitulo.appendChild(ColunaTitulo);
        novaTabela.appendChild(LinhaTitulo);

        for(let i=0; i<tabela_processos.length;i++)
        {
            var novaLinha = document.createElement("tr");
            var novaColuna = document.createElement("td");
            novaColuna.innerHTML = tabela_processos[i].pid.toString();

            novaLinha.setAttribute('border','3');
            
            novaLinha.appendChild(novaColuna);
            novaTabela.appendChild(novaLinha);
        }

                
        Grant.appendChild(novaTabela);
    
        // adiciona novas informações ao gráfico a cada T(n)
        Time();
        

    }
    else{
        alert("Favor inserir o(s) processo(s) a serem executados!");
        return;
    }
    
   
});
   
const BotaoReiniciar = document.querySelector("#resetar").addEventListener("click", event => {
    event.preventDefault();
    location.reload();//recarreganda a página html por completo
});





