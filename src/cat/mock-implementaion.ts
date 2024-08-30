import { CatService } from "./cat.service";

export const mockCatsService: Partial<CatService>  = {
  findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Tom' }]), // Example method
  findOne: jest.fn().mockImplementation((id: number) => 
    Promise.resolve({ id, name: 'Tom' })
  ),
  create: jest.fn().mockImplementation((cat) => 
    Promise.resolve({ id: Date.now(), ...cat })
  ),
  // Add other methods as needed
};
