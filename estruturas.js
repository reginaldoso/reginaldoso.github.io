// importando módulos
import { Cestruturas } from "./funcoes.js";

// instanciando construtor para as Variaveis do sistema
export const CVarSistemas = new Cestruturas("QtdProcessosInseridos, QtdProcessosAtivos, algoritmo, quantum, sobrecarga, paginacao");

// inicializando Variaveis de sistema com valores Default
CVarSistemas.QtdProcessosInseridos = 0;
CVarSistemas.QtdProcessosAtivos = 0;

// instanciando construtor para os Turnarounds
const CTurnarounds = new Cestruturas("IdProcesso, turnarounds");

// instanciando construtor de processos
export const Cprocesso = new Cestruturas("pid, Texecucao, paginas, deadline, Tchegada");

// tabela/lista de processos (process control blocks) a ser mostrada na tela
export const tabela_processos = new Array();

// lista de turnarounds a ser mostrada na tela
export const lista_turnarounds = new Array();

// vetor de alocação da memória secundária a ser mostrada na tela
export const memoria_secundaria = new Array(120);

// vetor de alocação da memória ram a ser mostrada na tela
export const memoria_ram = new Array(50);
