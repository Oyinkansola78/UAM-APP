import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, catchError } from 'rxjs';
import { AuditLog } from '../models/audit-log.model';
import { environment } from '../../../environments/environment';

export interface UAMUser {
  id?: string;
  name: string;
  email: string;
  role: string;
  password: string;
  department: string;
  status: string;
  lastActive?: string;
  applications?: any[];
  authorizedApps?: string[];
  photo?: string;
  employeeId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private apiUrl = `${environment.apiUrl}/uam-users`;
  
  constructor(private http: HttpClient) {}
  
  // Get all UAM users
  getUsers(): Observable<UAMUser[]> {
    console.log('Fetching users from:', this.apiUrl);
    
    return this.http.get<UAMUser[]>(`${this.apiUrl}`).pipe(
      tap(users => console.log('Users from API:', users)),
      catchError(error => {
        console.error('Error fetching users:', error);
        // Return mock data if API fails
        const mockUsers = this.getMockUsers();
        console.log('Using mock users:', mockUsers);
        return of(mockUsers);
      })
    );
  }
  
  // Get a specific UAM user by ID
  getUserById(id: string): Observable<UAMUser> {
    return this.http.get<UAMUser>(`${this.apiUrl}/${id}`);
  }
  
  // Alias for getUserById to maintain compatibility with existing code
  getUser(id: string): Observable<UAMUser> {
    console.log(`Fetching user with ID: ${id} from ${this.apiUrl}/${id}`);
    return this.http.get<UAMUser>(`${this.apiUrl}/${id}`).pipe(
      tap(user => console.log('User data received:', user)),
      catchError((error: unknown) => {
        console.error(`Error fetching user with ID ${id}:`, error);
        // Return mock data if API fails
        return of(this.getMockUser(id));
      })
    );
  }

  // Add a method to create mock user data
  private getMockUser(id: string): UAMUser {
    return {
      id: id,
      name: 'Mock User',
      email: 'mock@example.com',
      password: 'password123',
      role: 'Officer',
      department: 'Security',
      status: 'Active',
      lastActive: new Date().toISOString()
    };
  }
  
  // Add a new UAM user
  addUser(user: UAMUser): Observable<UAMUser> {
    return this.http.post<UAMUser>(this.apiUrl, user);
  }
  
  // Update a UAM user
  updateUser(id: string, user: UAMUser): Observable<UAMUser> {
    return this.http.put<UAMUser>(`${this.apiUrl}/${id}`, user);
  }
  
  // Delete a UAM user
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  // Get audit logs for a specific user
  getUserAuditLogs(userId: string): Observable<AuditLog[]> {
    // This would be replaced with a real API call
    return of(this.getMockAuditLogs().filter(log => log.employeeId === userId));
  }
  
  // Mock data for audit logs
  private getMockAuditLogs(): AuditLog[] {
    return [
      {
        date: new Date().toISOString(),
        employee: 'John Doe',
        employeeId: '1001',
        application: 'Email System',
        actionType: 'Temporary',
        duration: '30 days',
        reason: 'Security policy violation',
        officer: 'Admin User'
      },
      {
        date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        employee: 'Jane Smith',
        employeeId: '1002',
        application: 'CRM System',
        actionType: 'Permanent',
        reason: 'Employment termination',
        officer: 'Admin User'
      }
    ];
  }

  // Mock data for testing
  private getMockUsers(): UAMUser[] {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 7);
    const lastMonth = new Date(now);
    lastMonth.setMonth(now.getMonth() - 1);
    
    return [
      // {
      //   id: 'user-1',
      //   name: 'Adebayo Okafor',
      //   email: 'adebayo.okafor@gtbank.com',
      //   role: 'Supervisor',
      //   department: 'IT',
      //   status: 'Active',
      //   lastActive: now.toISOString()
      // },
      // {
      //   id: 'user-2',
      //   name: 'Chioma Adeyemi',
      //   email: 'chioma.adeyemi@gtbank.com',
      //   role: 'Officer',
      //   department: 'Security',
      //   status: 'Active',
      //   lastActive: yesterday.toISOString()
      // },
      // {
      //   id: 'user-3',
      //   name: 'Oluwaseun Nwachukwu',
      //   email: 'oluwaseun.nwachukwu@gtbank.com',
      //   role: 'Officer',
      //   department: 'Operations',
      //   status: 'Inactive',
      //   lastActive: lastWeek.toISOString()
      // },
      // {
      //   id: 'user-4',
      //   name: 'Ngozi Ojo',
      //   email: 'ngozi.ojo@gtbank.com',
      //   role: 'Supervisor',
      //   department: 'Finance',
      //   status: 'Active',
      //   lastActive: lastMonth.toISOString()
      // },
      // {
      //   id: 'user-5',
      //   name: 'Emeka Okonkwo',
      //   email: 'emeka.okonkwo@gtbank.com',
      //   role: 'Officer',
      //   department: 'Security',
      //   status: 'Active',
      //   lastActive: now.toISOString()
      // }
    ];
  }
}
