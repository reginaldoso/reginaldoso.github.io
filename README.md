# Escalonador-SO-2024-1

## Arquivos

### index.html e stylesheet.css
<p>
Contém as estruturas HTML e CSS que compoem o Front And do simulador.
</p>

### index.js

<p>
Contém as variáveis e funções responsáveis por processar os elementos do HTML (Front And) e enviar para as funções que processam em segundo plano (Back And). Em sua maioria, as funções do Back And estão no arquivo estruturas.js.
</p>

### estruturas.js

<p>
Contém as estruturas (variáveis e objetos) que representam os elementos do nosso simulador, incluindo os processos. Nele está toda as lógica e processamentos dos algorítmos de escalonamento.
</p>

### funcoes.js

<p>
Contém as funções auxiliares cujo processamento não dependem diretamente das informações contidas nas estruturas e variáveis do Escalonador; como por exemplo, uma função usada pra teste de código e outra que atualiza o scroll de um DIV do Front And.
</p>

## Estruturas

### CVarSistemas

<p>
É uma estrutura criada para guardar e acoplar as informações usadas tanto para apresentar algumas informações na tela quanto para executar os algorítmos. Seus atributos são:
</p>

<p>
- QtdProcessosInseridos: guarda a quantidade de processos inseridos;
</p>
<p>
- QtdProcessosAtivos: guarda a quantidade de processos que estão ativos;
</p>
<p>
- algoritmo: guarda o algoritmo selecionado;
</p>
<p>
- quantum: guarda o quantum setado no site;
</p>
<p>
- sobrecarga: guarda a sobrecarga enviada pelo site;
</p>
<p>
- velocidade: é a velocidade de reprodução do gráfico na tela;
</p>
<p>
- ContadorTime: valor do time. Aumenta a cada chamada do algoritmo. Ele é usado apenas no front and.
</p>


### Csobrecarga

<p>
A variável Csobrecarga é um objeto sobre o qual os algoritmos controlam as sobrecargas usadas no simulador e, por sua vez, contém os atributos:
</p>

<p>
- IndiceProcessoSobrecarregado: guarda o índice do processo que sofreu sobrecarga;
</p>
<p>
- Contador: tempo decorrido de sobrecarga;
</p>


### CTempoProcesso

<p>
É um objeto que representa o Turnaround de um processo específico e contém os atributos:
</p>
<p>
- IdProcesso: guarda o id do processo ao qual o turnaround pertence;
</p>
<p>
- TempoTotal: guarda o valor numérico do tempo de espera somado ao tempo de execução de cada processo individualmente;
</p>

### Cprocesso

<p>
É um objeto que um processo inserido no sistema e contém os atributos:
</p>
<p>
- pid: identificação do processo; 
</p>
<p>
- Texecucao: valor numérico do tempo de execução;
</p>
<p>
- deadline: valor numérico do deadline;
</p>
<p>
- Tchegada: valor numérico do tempo de chegada.
</p>

### tabela_processos
<p>
É um vetor para guardar objetos do tipo Cprocesso. Ao longo de cada algoritmo de escalonamento, usaremos uma cópia dessa estrutura para acessar/manipular as informações do conjunto de processos inseridos em nosso simulador por que precisamos conservar as informações dos processos originais para outras execuções que vierem a ocorrer posteriormente.
</p>

### FrontAnd

<p>
É um objeto que mantém as informações que são mostradas na tela a cada execução de um algoritmo qualquer ou cada Time; que é o caso do gráfico de grant. Ele tem como atributos:
</p>

<p>
- NovaColunaGrant:  vetor que contém os números que representam as cores que são apresentadas no gráfico de grant a cada chamada de um algoritmo qualquer. A funções atualizarConteudo e SelecionarCor, explicita e implicitamente, apresentam as cores na tela a depender da sequência de números que é insirida nesse vetor.
</p>
<p>
- Turnaround: É um vetor para guardar objetos do tipo CTempoProcesso. A cada execução de um algoritmo, a função Time sobrescreve esse vetor com novas informações. Ao final da execução do algoritmo o valores são montados numa única string e mostrados na tela.
</p>


## Funções

### Time
<p>
Localizada no arquivo estruturas.js, essa função é responsável por integrar funções que trabalham no Front And com o Back And; ou seja, cuida da sincronização que ocorre entre o processamento das informações do algorítmos com o que é apresentando a tela a cada execução e atualização do gráfico de grant.
</p>

### FIFO
<p>
Localizada no arquivo estruturas.js, essa função é responsável pelo processamento e retornos do algorítmo de escalonamento FIFO. A função espera que seja passada uma cópia do Array de processos como parâmetro.
</p>

### SJF
<p>
Localizada no arquivo estruturas.js, essa função é responsável pelo processamento e retornos do algorítmo de escalonamento SJF. A função espera que seja passada uma cópia do Array de processos como parâmetro.
</p>

### RR
<p>
Localizada no arquivo estruturas.js, essa função é responsável pelo processamento e retornos do algorítmo de escalonamento Round Robin (RR). A função espera que seja passada uma cópia do Array de processos como parâmetro.
</p>

### EDF
<p>
Localizada no arquivo estruturas.js, essa função é responsável pelo processamento e retornos do algorítmo de escalonamento EDF. A função espera que seja passada uma cópia do Array de processos como parâmetro.
</p>

### atualizarConteudo
<p>
Localizada no arquivo estruturas.js, essa função exibe as colunas do gráfico de grant após cada chamada do escalonador por parte da função Time.
</p>

### Cestruturas
<p>
Localizada no arquivo funcoes.js, essa função auxiliar é um construtor de objetos que consegue criar essa estrutura quando sua chamada é realizada passando uma string no formato "atributo1, atributo2,...tributoN" como parâmetro.
</p>

### CopyArray
<p>
Localizada no arquivo funcoes.js, essa função auxiliar é faz com que, ao ser chamada passando um certo vetor V de objetos como parâmetro, retorna a referência para uma cópia exata de V respeitando suas particularidades e propriedades.
</p>

### delay
<p>
Localizada no arquivo funcoes.js, essa função auxiliar é responsável por gerar o delay que precisa haver na hora de atualizar as informações no gráfico de grant.
</p>


### UpdateScrollGrafico
<p>
Localizada no arquivo funcoes.js, essa função auxiliar é responsável por atualizar o scroll da DIV onde fica o gráfico de grant a cada chamada do algoritmo escalonador.
</p>

### SelecionarCor
<p>
Também localizada no arquivo funcoes.js, essa função auxiliar, ao ser chamada pela função atualizarConteudo passando-se um valor númerico como parâmetro, retorna uma string com o valor hexadecimal de uma cor pré definida.
</p>


### Teste
<p>
Localizada no arquivo funcoes.js, essa função auxiliar pode ser usada para testar internamente a exibição do gráfico de grant na tela.
</p>

### rand
<p>
Localizada no arquivo funcoes.js, essa função auxiliar é usada junto a função Teste para retornar strings de acordo com valores randômicos passados como parâmetro.
</p>

## Referências:

### 1 Trabalhando com javascript em varios arquivos
Disponível em: https://cursos.alura.com.br/forum/topico-trabalhando-com-javascript-em-varios-arquivos-153689

### 2 Formulário HTML: criando forms HTML e enviando dados
Disponível em: https://www.homehost.com.br/blog/tutoriais/formulario-html/

