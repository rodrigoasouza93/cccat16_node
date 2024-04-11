import { AccountDAO } from "./AccountDAO";

export class AccountDAOMemory implements AccountDAO {
	accounts: any[];

	constructor() {
		this.accounts = [];
	}

	async getAccountByEmail(email: string): Promise<any> {
		return this.accounts.find(account => account.email === email);
	}

	async getAccountById(accountId: string): Promise<any> {
		return this.accounts.find(account => account.accountId === accountId);
	}

	async saveAccount(account: any): Promise<void> {
		this.accounts.push(account);
	}
}
