// Company attributes from database (updated schema)
export interface Company {
  id: number;
  createdAt: Date;
  name: string;
}

// Company creation attributes
export interface CompanyCreationAttributes {
  name: string;
}
