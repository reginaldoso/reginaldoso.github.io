// importando módulos
import { Cestruturas,CopyArray,rand,delay,UpdateScrollGrafico,SelecionarCor,ordenarPorAtributo, ordenarPorAtributoForte} from "./funcoes.js";

// instanciando construtor para as Variaveis do sistema
export const CVarSistemas = new Cestruturas("QtdProcessosInseridos, QtdProcessosAtivos, algoritmo, quantum, sobrecarga,velocidade,ContadorTime");

// inicializando Variaveis de sistema com valores Default
CVarSistemas.QtdProcessosInseridos = 0;
CVarSistemas.QtdProcessosAtivos = 0;


// instanciando construtor para os Tempos (inclui espera+execução) de cada processo individualmente
const CTempoProcesso = new Cestruturas("IdProcesso, TempoTotal");

// instanciando construtor do objeto que representa os processos em nosso simulador
export const Cprocesso = new Cestruturas("pid, Texecucao, deadline, Tchegada");

// tabela/lista de processos (process control blocks) a ser mostrada na tela
export const tabela_processos = new Array();

const fila = new Array();

// vetor onde constam as informações mostradas no front and
export const FrontAnd = new Cestruturas("NovaColunaGrant, TemposProcessos");


// variavel que usada para ativar ou não a sobrecarga usada nos algoritmos (FIFO, SJF, etc..)
var SobrecargaAtivada = false;

var contadorSobrecarga = 0; // contador pra limitar o tempo de sobrecarga
    
var ContadorCPU = 0; // conta o tempo de processador. Utilizamos esse contador junto com o quantum para distribuir o tempo de CPU uniformemente entre os processos nos algoritmos preemptivos
    
// adiciona novas informações ao front and (gráfico+Turnarounds)
export async function Time(){
       
    // criando uma copia do vetor de processos -> os escalonadores vao usar a cópia
    const tabela_processos_copy = CopyArray(tabela_processos);

    FrontAnd.NovaColunaGrant = Array(CVarSistemas.QtdProcessosAtivos); //inicializando vetores
    FrontAnd.TemposProcessos  = Array(CVarSistemas.QtdProcessosAtivos); //inicializando vetores
    
    // inicializando algumas variveis com valore default
    CVarSistemas.ContadorTime = 0;
    const ContadorCPU = 0;
    SobrecargaAtivada = false;

    // alocando Turnarounds para os processos ativos
    for (let key = 0; key < CVarSistemas.QtdProcessosAtivos; key++) {
        FrontAnd.TemposProcessos[key] = new CTempoProcesso(tabela_processos[key].pid, 0);
    }
    
    // pegando a referência do gráfico para a função Time
    const Grant = document.querySelector("div#area-grafico .grant").childNodes[1];
    
    
    switch(CVarSistemas.algoritmo) {
                
        case "fifo":
             
            while ( FIFO(tabela_processos_copy) ) {
                atualizarConteudo(Grant);
                UpdateTurnarounds();
                await delay(CVarSistemas.velocidade*1000); // Aguarda 2 segundos antes da próxima iteração
            }
        break;
            
        case "sjf":
             
            while ( SJF(tabela_processos_copy) ) {
                atualizarConteudo(Grant);
                UpdateTurnarounds();
                await delay(CVarSistemas.velocidade*1000); // Aguarda x segundos antes da próxima iteração
            }
        break;

        case "rr":

            // ordena a lista de processos
            ordenarPorAtributo(tabela_processos_copy, 'Tchegada');
             
            while ( RR(tabela_processos_copy) ) {
                atualizarConteudo(Grant);
                UpdateTurnarounds();
                await delay(CVarSistemas.velocidade*1000); // Aguarda x segundos antes da próxima iteração
            }
        break;

        case "edf":
            
            // ordena a lista de processos
            ordenarPorAtributoForte(tabela_processos_copy, 'Tchegada', 'deadline');

            while ( EDF(tabela_processos_copy) ) {
                atualizarConteudo(Grant);
                UpdateTurnarounds();
                await delay(CVarSistemas.velocidade*1000); // Aguarda x segundos antes da próxima iteração
            }
        break;

        default:
            alert("Variaveis de Sistema não informadas!");
    }
    
    ExibirTurnarounds();
          
}


// algoritmo fifo
function FIFO(tabela_processos_copy){
    
    // verificando se existe processo demandando tempo de execução
    var existe = false;

    for (const i in tabela_processos_copy) {
        if (tabela_processos_copy[i].Texecucao > 0) {
            existe = true;
        }
    }
 
    if(!existe){// aqui não há processo pra executar
        return false; // condição de parada pro algoritmo
    }

    else{

        // verificando se tem processo na lista de pronto
        existe = false;

        for (const i in tabela_processos_copy) {
            if ((tabela_processos_copy[i].Tchegada <= 0) && (tabela_processos_copy[i].Texecucao > 0)) {
                existe = true;
            }
        }

        if(!existe){// aqui não há processo pra escalonar
            for(let i = 0;i < FrontAnd.NovaColunaGrant.length; i++){
                FrontAnd.NovaColunaGrant[i] = 0;// seta o valor da cor
                (tabela_processos_copy[i].Tchegada)--;// decrementa o tempo de chegada
            }
            return true;
        }

        else{// aqui há o que escalonar
            
            // o processo a ser executado é o que tem menor tempo de chegada
            var indice = -1,
                tempoChegada = Number.POSITIVE_INFINITY;// Number.POSITIVE_INFINITY representa um numero positivo infinito em javascript

            for(let i = 0;i < FrontAnd.NovaColunaGrant.length; i++){

                if ((tabela_processos_copy[i].Texecucao) > 0){
                    
                    // avalia se o processo já chegou e se é o que chegou primeiro
                    if((tabela_processos_copy[i].Tchegada <= 0) && (tabela_processos_copy[i].Tchegada < tempoChegada)){
                        indice = i;
                        tempoChegada = tabela_processos_copy[i].Tchegada;
                    }
                }
            }
            
            for (const i in tabela_processos_copy) {
                
                if(i == indice){
                    (tabela_processos_copy[i].Texecucao)--;// decrementa o tempo de execução
                    FrontAnd.NovaColunaGrant[i] = 1;
                }
                else{
                    if ((tabela_processos_copy[i].Tchegada <= 0) && (tabela_processos_copy[i].Texecucao > 0)) {//aqui o processo está em espera
                        FrontAnd.NovaColunaGrant[i] = 2;
                    }
                    else{// aqui o processo ainda não chegou
                        FrontAnd.NovaColunaGrant[i] = 0;
                    }
                }
           
            }

            // decrementando o tempo de chegada de todos os processos
            for (const i in tabela_processos_copy) {
                (tabela_processos_copy[i].Tchegada)--;// decrementa os tempos de chegada para i >=1
            }

            return true;
        }
    }
    
}

// algoritmo sjf
function SJF(tabela_processos_copy){

        
    // verificando se existe processo demandando tempo de execução
    var existe = false;

    for (const i in tabela_processos_copy) {
        if (tabela_processos_copy[i].Texecucao > 0) {
            existe = true;
        }
    }
 
    if(!existe){// aqui não há processo pra executar
        return false; // condição de parada pro algoritmo
    }

    else{

        // verificando se tem processo na lista de pronto
        existe = false;

        for (const i in tabela_processos_copy) {
            if ((tabela_processos_copy[i].Tchegada <= 0) && (tabela_processos_copy[i].Texecucao > 0)) {
                existe = true;
            }
        }

        if(!existe){// aqui não há processo pra escalonar
            for(let i = 0;i < FrontAnd.NovaColunaGrant.length; i++){
                FrontAnd.NovaColunaGrant[i] = 0;// seta o valor da cor
                (tabela_processos_copy[i].Tchegada)--;// decrementa o tempo de chegada
            }
            return true;
        }

        else{// aqui há o que escalonar
            
            // o processo a ser executado é o que tem menor tempo de execução
            var indice = -1,
                MenorTempoChegada = Number.POSITIVE_INFINITY,
                MenorTempoExecucao = Number.POSITIVE_INFINITY;// Number.POSITIVE_INFINITY representa um numero positivo infinito em javascript

            for(let i = 0;i < FrontAnd.NovaColunaGrant.length; i++){

                if ((tabela_processos_copy[i].Texecucao) > 0){
                    
                    // avalia se o processo já chegou e se é o que chegou primeiro
                    if((tabela_processos_copy[i].Tchegada <= 0) && (tabela_processos_copy[i].Tchegada < MenorTempoChegada) && (tabela_processos_copy[i].Texecucao < MenorTempoExecucao)){
                        indice = i;
                        MenorTempoChegada = tabela_processos_copy[i].Tchegada;
                        MenorTempoExecucao = tabela_processos_copy[i].Texecucao;
                    } 
                }
            }
            
            for (const i in tabela_processos_copy) {
                
                if(i == indice){
                    (tabela_processos_copy[i].Texecucao)--;// decrementa o tempo de execução
                    FrontAnd.NovaColunaGrant[i] = 1;
                }
                else{
                    if ((tabela_processos_copy[i].Tchegada <= 0) && (tabela_processos_copy[i].Texecucao > 0)) {//aqui o processo está em espera
                        FrontAnd.NovaColunaGrant[i] = 2;
                    }
                    else{// aqui o processo ainda não chegou
                        FrontAnd.NovaColunaGrant[i] = 0;
                    }
                }
           
            }

            // decrementando o tempo de chegada de todos os processos
            for (const i in tabela_processos_copy) {
                (tabela_processos_copy[i].Tchegada)--;// decrementa os tempos de chegada para i >=1
            }

            return true;
        }
    }


}

// algoritmo Round Robin
function RR(tabela_processos_copy){
    
    // caso base
    if( (fila.length < 1) && (tabela_processos_copy.length < 1) ){
        return false;
    }

    else{
        var PrimeiroElementoFila = null,
            ElementoRetiradoLista = null,
            PidProcessoExecutado = -1;
            

        
        // preenche a nova coluna do front and com zero
        for ( let u = 0; u < FrontAnd.NovaColunaGrant.length; u++) {
            FrontAnd.NovaColunaGrant[u] = 0;
        }

        if(SobrecargaAtivada){// aqui sobrecarga tá ativa
            
            //teste
            console.log("sobrecarga ativou")
            // atualizando informações para o processo executado
            var IndiceProcessoExecutado = (fila[0].pid-1),
                IndiceProcessoPronto = -1;
            (fila[0].Tchegada)--;
            (fila[0].deadline)--;

            FrontAnd.NovaColunaGrant[IndiceProcessoExecutado] = 3;
            
            // atualizando informações dos demais processos na fila
            for(let u = 1; u < fila.length; u++){
                (fila[u].Tchegada)--;
                (fila[u].deadline)--;
                IndiceProcessoPronto = (fila[u].pid-1);
                FrontAnd.NovaColunaGrant[IndiceProcessoPronto] = 2;
            }

            // atualizando as informações dos processos na lista
            for (const element of tabela_processos_copy) {
                (element.Tchegada)--;
            }

            // adiciona os processos da lista que já chegaram na fila
            for (let index = 0; index < tabela_processos_copy.length; index++) {
                if(tabela_processos_copy[index].Tchegada < 1){
                    ElementoRetiradoLista = tabela_processos_copy.splice(index, 1)[0];

                    // retirando processo da lista e inserindo na fila
                    if( (ElementoRetiradoLista != null) && (ElementoRetiradoLista != "undefined") ){
                        fila.push(ElementoRetiradoLista);
                    }
                    
                }
            }

            contadorSobrecarga++;

            if( contadorSobrecarga == CVarSistemas.sobrecarga){
                contadorSobrecarga = 0;
                SobrecargaAtivada = false;

                // retira o processo do topo da fila
                PrimeiroElementoFila = fila.shift();

                // o processo é mandado pro final da fila se ainda não foi executado por completo
                if( PrimeiroElementoFila.Texecucao > 0){
                    fila.push(PrimeiroElementoFila);
                }
                else{
                    console.log("push nao executado")
                    PrimeiroElementoFila = null;// apaga a referência para o objeto
                }
            }

            return true;
        }

        else{// aqui sobrecarga não está ativa
            
            if(fila.length > 0){
                
                // atualizando informações para o processo executado
                var IndiceProcessoExecutado = fila[0].pid-1;
                var PidProcessoExecutado = fila[0].pid;
                var IndiceProcessoPronto = -1;

                // atualizando tempo de execução, chegada e deadline
                (fila[0].Texecucao--);
                (fila[0].Tchegada)--;
                (fila[0].deadline)--;

                FrontAnd.NovaColunaGrant[IndiceProcessoExecutado] = 1;
                
                // atualizando informações dos demais processos na fila
                for(let u = 1; u < fila.length; u++){
                    (fila[u].Tchegada)--;
                    (fila[u].deadline)--;
                    IndiceProcessoPronto = (fila[u].pid-1);
                    FrontAnd.NovaColunaGrant[IndiceProcessoPronto] = 2;
                }

                // atualizando as informações dos processos na lista
                for (const element of tabela_processos_copy) {
                    (element.Tchegada)--;
                }

                if( (fila[0].Texecucao < 1)){
                    ContadorCPU = 0;
                    
                    // retira o processo do topo da fila
                    PrimeiroElementoFila = fila.shift();
                    PrimeiroElementoFila = null;// apaga a referência para o objeto

                    return true;
                }

                ContadorCPU++; //atualiza o contador de Tempo de CPU
    
                // haver sobrecarga na próxima chamada se ContadorCPUatingiu o quatum
                var condicao = (ContadorCPU == CVarSistemas.quantum);// verifica se atingiu o quatum
                    
        
                // verifica se na chamada T(n+1) haverá sobrecarga
                if (condicao){
                    SobrecargaAtivada = true;
                    contadorSobrecarga = 0;
                    ContadorCPU = 0;
                    return true;
                }
                return true;

            }
            else{
                // verifica se já chegou 
                //retira o elemento que lista e adiciona na fila
                for (let index = 0; index < tabela_processos_copy.length; index++) {
                    if(tabela_processos_copy[index].Tchegada < 1){
                        ElementoRetiradoLista = tabela_processos_copy.splice(index, 1)[0];

                        // retirando processo da lista e inserindo na fila
                        if( (ElementoRetiradoLista != null) && (ElementoRetiradoLista != "undefined") ){
                            fila.push(ElementoRetiradoLista);
                        }
                        
                    }
                }
            }
    
            
            if(fila.length < 1){// se fila ainda continua vazia
                return true;
            }
            
            
            else{// se fila já não está mais vazia
                    
                // executa o processo do topo e atualiza todas as informações necessárias
            
                var IndiceProcessoExecutado = (fila[0].pid-1),
                    PidProcessoExecutado = fila[0].pid;
                    IndiceProcessoPronto = -1;

                // atualizando tempo de execução, chegada e deadline
                (fila[0].Texecucao--);
                (fila[0].Tchegada)--;
                (fila[0].deadline)--;

                FrontAnd.NovaColunaGrant[IndiceProcessoExecutado] = 1;
                
                // atualizando informações dos demais processos na fila
                for(let u = 1; u < fila.length; u++){
                    (fila[u].Tchegada)--;
                    (fila[u].deadline)--;
                    IndiceProcessoPronto = (fila[u].pid-1);
                    FrontAnd.NovaColunaGrant[IndiceProcessoPronto] = 2;
                }

                // atualizando as informações dos processos na lista
                for (const element of tabela_processos_copy) {
                    (element.Tchegada)--;
                }

                if( (fila[0].Texecucao < 1)){
                    ContadorCPU = 0;
                    
                    // retira o processo do topo da fila
                    PrimeiroElementoFila = fila.shift();
                    PrimeiroElementoFila = null;// apaga a referência para o objeto

                    return true;
                }

                ContadorCPU++; //atualiza o contador de Tempo de CPU
    
                // haver sobrecarga na próxima chamada se ContadorCPUatingiu o quatum
                var condicao = (ContadorCPU == CVarSistemas.quantum);// verifica se atingiu o quatum
                    
        
                // verifica se na chamada T(n+1) haverá sobrecarga
                if (condicao){
                    SobrecargaAtivada = true;
                    contadorSobrecarga = 0;
                    ContadorCPU = 0;
                    return true;
                }

                return true;
                
            }
 
        }

    }

}// fim da função RR

// algoritmo EDF
function EDF(tabela_processos_copy){

    // caso base
    if( (fila.length < 1) && (tabela_processos_copy.length < 1) ){
        return false;
    }

    else{
        
        // preenche a nova coluna do front and com zero
        for ( let u = 0; u < FrontAnd.NovaColunaGrant.length; u++) {
            FrontAnd.NovaColunaGrant[u] = 0;
        }

        if(SobrecargaAtivada){// aqui sobrecarga tá ativa
            
            //teste
            console.log("sobrecarga ativou")
            // atualizando informações para o processo executado
            var IndiceProcessoExecutado = (fila[0].pid-1),
                IndiceProcessoPronto = -1;
            (fila[0].Tchegada)--;
            (fila[0].deadline)--;
            

            FrontAnd.NovaColunaGrant[IndiceProcessoExecutado] = 3;
            
            // atualizando informações dos demais processos na fila
            for(let u = 1; u < fila.length; u++){
                (fila[u].Tchegada)--;
                (fila[u].deadline)--;
                IndiceProcessoPronto = (fila[u].pid-1);
                FrontAnd.NovaColunaGrant[IndiceProcessoPronto] = 2;
            }

            // atualizando as informações dos processos na lista
            for (const element of tabela_processos_copy) {
                (element.Tchegada)--;
            }

            // adiciona os processos da lista que já chegaram na fila
            AddProcFila(tabela_processos_copy, fila );

            contadorSobrecarga++;

            if( contadorSobrecarga == CVarSistemas.sobrecarga){
                contadorSobrecarga = 0;
                SobrecargaAtivada = false;

                // verifica se tem algum processo na fila com deadline menor que o dele
                AvaliarDeadline(fila);
                return true;
            }  

            // processo conclui antes de terminar a sobrecarga
            if( fila[0].Texecucao < 1){// saiu da fila
                fila.splice(0, 1)[0];
                contadorSobrecarga = 0;
                SobrecargaAtivada = false;
                AddProcFila(tabela_processos_copy, fila );
                AvaliarDeadline(fila);
                return true;
            }

            return true;
        }

        else{// aqui sobrecarga não está ativa
            
            if(fila.length > 0){
                
                // atualizando informações para o processo executado
                var IndiceProcessoExecutado = fila[0].pid-1;
                var PidProcessoExecutado = fila[0].pid;
                var IndiceProcessoPronto = -1;

                // atualizando tempo de execução, chegada e deadline
                (fila[0].Texecucao--);
                (fila[0].Tchegada)--;
                (fila[0].deadline)--;

                FrontAnd.NovaColunaGrant[IndiceProcessoExecutado] = 1;
                
                // atualizando informações dos demais processos na fila
                for(let u = 1; u < fila.length; u++){
                    (fila[u].Tchegada)--;
                    (fila[u].deadline)--;
                    IndiceProcessoPronto = (fila[u].pid-1);
                    FrontAnd.NovaColunaGrant[IndiceProcessoPronto] = 2;
                }

                // atualizando as informações dos processos na lista
                for (const element of tabela_processos_copy) {
                    (element.Tchegada)--;
                }

                // verifica se tem algum processo na fila com deadline menor que o dele
                AddProcFila(tabela_processos_copy, fila );
                AvaliarDeadline(fila);
                
                // aqui o processo conclui antes de terminar o quantum
                if( fila[0].Texecucao < 1){// saiu da fila
                    fila.splice(0, 1)[0];
                    ContadorCPU = 0;
                    AddProcFila(tabela_processos_copy, fila );
                    AvaliarDeadline(fila);

                    return true;
                }

                ContadorCPU++; //atualiza o contador de Tempo de CPU
    
                // haver sobrecarga na próxima chamada se ContadorCPUatingiu o quatum
                var condicao = (ContadorCPU == CVarSistemas.quantum);// verifica se atingiu o quatum

                // verifica se na chamada T(n+1) haverá sobrecarga
                if (condicao){
                    SobrecargaAtivada = true;
                    contadorSobrecarga = 0;
                    ContadorCPU = 0;
                    return true;
                }
                return true;

            }
            else{
                //retira o elemento que lista e adiciona na fila
                AddProcFila(tabela_processos_copy, fila );
                AvaliarDeadline(fila);
            }

            if(fila.length < 1){// se fila ainda continua vazia
                return true;
            }

            else{// se fila já não está mais vazia
                    
                // executa o processo do topo e atualiza todas as informações necessárias
            
                var IndiceProcessoExecutado = (fila[0].pid-1),
                    PidProcessoExecutado = fila[0].pid;
                    IndiceProcessoPronto = -1;

                // atualizando tempo de execução, chegada e deadline
                (fila[0].Texecucao--);
                (fila[0].Tchegada)--;
                (fila[0].deadline)--;

                FrontAnd.NovaColunaGrant[IndiceProcessoExecutado] = 1;
                
                // atualizando informações dos demais processos na fila
                for(let u = 1; u < fila.length; u++){
                    (fila[u].Tchegada)--;
                    (fila[u].deadline)--;
                    IndiceProcessoPronto = (fila[u].pid-1);
                    FrontAnd.NovaColunaGrant[IndiceProcessoPronto] = 2;
                }

                // atualizando as informações dos processos na lista
                for (const element of tabela_processos_copy) {
                    (element.Tchegada)--;
                }

                // verifica se tem algum processo na fila com deadline menor que o dele
                //AddProcFila(tabela_processos_copy, fila );
                AvaliarDeadline(fila);

                // aqui o processo conclui antes de terminar o quantum
                if( fila[0].Texecucao < 1){// saiu da fila
                    fila.splice(0, 1)[0];
                    ContadorCPU = 0;
                    AddProcFila(tabela_processos_copy, fila );
                    AvaliarDeadline(fila);
                    return true;
                }

                ContadorCPU++; //atualiza o contador de Tempo de CPU
    
                // haver sobrecarga na próxima chamada se ContadorCPUatingiu o quatum
                var condicao = (ContadorCPU == CVarSistemas.quantum);// verifica se atingiu o quatum
                    
        
                // verifica se na chamada T(n+1) haverá sobrecarga
                if (condicao){
                    SobrecargaAtivada = true;
                    contadorSobrecarga = 0;
                    ContadorCPU = 0;
                    return true;
                }

                return true;
                
            }
 
        }

    }

}


// avalia fila de acordo com deadline
function AvaliarDeadline(fila){
    
    if( fila.length > 0){
        // inicializando variaveis
        let ElementoFila = null,
        indiceTopo = 0,
        MenorDeadline = fila[0].deadline;

        // verifica se tem algum processo na fila com deadline menor que o dele

        for(let i = 1; i < fila.length; i++){
            if(fila[i].deadline < MenorDeadline){
                MenorDeadline = fila[i].deadline;
                indiceTopo = i;
            }
        }

        // se tiver tras o processo pro topo da fila

        if(indiceTopo > 0){

            if( fila[0].Texecucao > 0){// o processo do topo não executou por completo
                ElementoFila = fila.splice(indiceTopo, 1)[0];
                fila.unshift(ElementoFila);
            }
            else{ // o processo saiu da fila
                ElementoFila = fila.splice(indiceTopo, 1)[0];
                fila.splice(0, 1)[0];
                fila.unshift(ElementoFila);
            }

        }
    }

    return;
}

// varre a lista e adiciona os processos na fila
function AddProcFila(tabela_processos_copy, fila ){
    let ElementoRetiradoLista = null;

    if( tabela_processos_copy.length > 0 ){
        for (let index = 0; index < tabela_processos_copy.length; index++) {
            if(tabela_processos_copy[index].Tchegada < 1){
                ElementoRetiradoLista = tabela_processos_copy.splice(index, 1)[0];
    
                // retirando processo da lista e inserindo na fila
                if( (ElementoRetiradoLista != null) && (ElementoRetiradoLista != "undefined") ){
                    fila.push(ElementoRetiradoLista);
                }
                
            }
        }
    }

    return;
    
}


// algoritmo para teste de código com valores randomicos
function TESTE(){

    if(CVarSistemas.ContadorTime < 3){
        for(let i = 0;i < FrontAnd.NovaColunaGrant.length; i++){
            FrontAnd.NovaColunaGrant[i] = rand();
        }
        
        return true;
    }
    else{
        for (const key in FrontAnd.NovaColunaGrant) {
            FrontAnd.NovaColunaGrant.splice(key,1);
        }
        FrontAnd.NovaColunaGrant = {};
        return false;
    }
    
}

// exibe as colunas do gráfico de grant a cada time T(n)
function atualizarConteudo(Grant) {
    
    // inserindo título da coluna tn da tabela dinâmica
    var ColunaTitulo = document.createElement("th");
    ColunaTitulo.innerHTML = (CVarSistemas.ContadorTime+1).toString();
    Grant.childNodes[0].appendChild(ColunaTitulo);


    for(let i = 0; i < FrontAnd.NovaColunaGrant.length; i++){
        let novaColuna = document.createElement("td");
        novaColuna.style.backgroundColor = SelecionarCor(FrontAnd.NovaColunaGrant[i]);
        Grant.childNodes[i+1].appendChild(novaColuna);
    }
    CVarSistemas.ContadorTime++;
   
    // atualizando scroll da area do gráfico
    //teste
    console.log("Time: "+(CVarSistemas.ContadorTime-1))

    for (const element of FrontAnd.NovaColunaGrant) {
        console.log(element) 
    }
    
    UpdateScrollGrafico();
    
}

// exibe os Turnarounds individuais e médio na tela a cada execução do algorítmo
function ExibirTurnarounds(){
    
    if(FrontAnd.TemposProcessos.length > 0){
        
        // guardando referência para a div que possui o scroll
        const DivScroll = document.querySelector("div#info-turnarounds");
        
        // pegando a referência para a área dos turnarounds no DOM
        const AreaTurnarounds = document.querySelector("div#info-turnarounds .turnarounds");
    

        // criando Turnerouds
        var msg = "<h2>Turnaround times</h2><br>",
            media = 0;
      
        
        for (let key = 0; key < FrontAnd.TemposProcessos.length;key++) {
            msg = msg + "Processo "+FrontAnd.TemposProcessos[key].IdProcesso+": "+" "+FrontAnd.TemposProcessos[key].TempoTotal+";<br>";
            media = media + FrontAnd.TemposProcessos[key].TempoTotal;
        }
        
        media = media / (FrontAnd.TemposProcessos.length);
        msg += "<strong>Média:<strong> "+media+"\n";

        // adiciona os Turnarounds na tela
        AreaTurnarounds.innerHTML=msg;
        
        // movendo o scroll para o topo da div
        DivScroll.scrollTo(0,0);
        return;
    }
 
}

function UpdateTurnarounds(){
    for (let i = 0; i < FrontAnd.NovaColunaGrant.length; i++) {
        if( (FrontAnd.NovaColunaGrant[i] == 1) || (FrontAnd.NovaColunaGrant[i] == 2) || (FrontAnd.NovaColunaGrant[i] == 3) ){
            (FrontAnd.TemposProcessos[i].TempoTotal)++;
        }
    }
}




