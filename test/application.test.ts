import sinon from "sinon";

import { GetAccount } from "../src/application/GetAccount";
import { Signup } from "../src/application/Signup";
import { AccountDAODatabase } from "../src/resource/AccountDAODatabase";
import { AccountDAOMemory } from "../src/resource/AccountDAOMemory";
import { MailerGatewayMemory } from "../src/resource/MailerGateway";

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
	const accountDAO = new AccountDAOMemory();
	const mailerGateway = new MailerGatewayMemory();
	signup = new Signup(accountDAO, mailerGateway);
	getAccount = new GetAccount(accountDAO);
})

test("Deve criar uma conta para o passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
});

test("Deve criar uma conta para o motorista", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		carPlate: "ABC1234",
		isPassenger: false,
		isDriver: true
	};
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
});

test("não deve criar uma conta para o passageiro se o nome for inválido", async function () {
	const input = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	await expect(signup.execute(input)).rejects.toThrow(new Error("Invalid name"));
});

test("não deve criar uma conta para o passageiro se o email for inválido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}`,
		cpf: "87748248800",
		isPassenger: true
	};
	await expect(signup.execute(input)).rejects.toThrow(new Error("Invalid email"));
});

test("não deve criar uma conta para o passageiro se o cpf for inválido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "8774824",
		isPassenger: true
	};
	await expect(signup.execute(input)).rejects.toThrow(new Error("Invalid cpf"));
});

test("não deve criar uma conta para o passageiro se a conta já existe", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	await signup.execute(input)
	await expect(signup.execute(input)).rejects.toThrow(new Error("Account already exists"));
});

test("não deve criar uma conta para o passageiro se a placa do carro for inválida", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		carPlate: "ABCD123",
		isPassenger: false,
		isDriver: true,
	};
	await expect(signup.execute(input)).rejects.toThrow(new Error("Invalid car plate"));
});

test("Deve criar uma conta para o passageiro com stub", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const saveAccountStub = sinon.stub(AccountDAODatabase.prototype, "saveAccount").resolves();
	const getAccountByEmailStub = sinon.stub(AccountDAODatabase.prototype, "getAccountByEmail").resolves(null);
	const getAccountByIdStub = sinon.stub(AccountDAODatabase.prototype, "getAccountById").resolves(input);
	const accountDAO = new AccountDAODatabase();
	const mailerGateway = new MailerGatewayMemory();
	const signup = new Signup(accountDAO, mailerGateway);
	const getAccount = new GetAccount(accountDAO);
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	saveAccountStub.restore();
	getAccountByEmailStub.restore();
	getAccountByIdStub.restore();
});

test("Deve criar uma conta para o passageiro com spy", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const sendSpy = sinon.spy(MailerGatewayMemory.prototype, "send")
	const accountDAO = new AccountDAODatabase();
	const mailerGateway = new MailerGatewayMemory();
	const signup = new Signup(accountDAO, mailerGateway);
	const getAccount = new GetAccount(accountDAO);
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(sendSpy.calledOnce).toBe(true);
	expect(sendSpy.calledWith(input.email, "Welcome", "Welcome to our platform")).toBe(true);
});

// test("Deve criar uma conta para o passageiro com mock", async function () {
// 	const input = {
// 		name: "John Doe",
// 		email: `john.doe${Math.random()}@gmail.com`,
// 		cpf: "87748248800",
// 		isPassenger: true
// 	};
// 	const sendMock = sinon.mock(MailerGatewayMemory.prototype);
// 	sendMock.expects("send").withArgs(input.email, "Welcome", "Welcome to our platform").once().callsFake(async function () {
// 		console.log("abc");
// 	});
// 	const accountDAO = new AccountDAODatabase();
// 	const mailerGateway = new MailerGatewayMemory();
// 	const signup = new Signup(accountDAO, mailerGateway);
// 	const getAccount = new GetAccount(accountDAO);
// 	const outputSignup = await signup.execute(input);
// 	expect(outputSignup.accountId).toBeDefined();
// 	const outputGetAccount = await getAccount.execute(outputSignup);
// 	expect(outputGetAccount.name).toBe(input.name);
// 	expect(outputGetAccount.email).toBe(input.email);
// 	expect(outputGetAccount.cpf).toBe(input.cpf);
// 	sendMock.verify();
// 	sendMock.restore();
// });