export interface CompanyPost {
  postId: number;
  companyId: number;
  companyName: string;
  position: string;
  address: string;
  salary: string;
  employmentType: string; 
  experienceYear: number;
  quantity: number;
  jobDescription: string;
  requirementsMandatory: string;
  requirementsPreferred: string;
  benefits: string;
  createAt: Date;
  status: number;
}
