
  
 export interface IQuestions {
    id?: string;
    testType: string;          
    title: string;       
    story: string;       
    questions: {
      questionText: string;            
      options: string[];    
      correctAnswer: number; 
    }[];
    createdAt?: string;    
    updatedAt?: string;    
  }
  