export interface Consultor {
  id?: string; 
  nome: string; 
  email: string; 
  telefone: string; 
  especialidade?: string; 
  experiencia?: number; 
  ativo?: boolean; 
  dataCadastro?: Date; 
  dataAtualizacao?: Date; 
}
