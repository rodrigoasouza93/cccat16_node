export interface AccountDAO {
	getAccountByEmail(email: string): Promise<any>;
	getAccountById(accountId: string): Promise<any>;
	saveAccount(account: any): Promise<void>;
}
