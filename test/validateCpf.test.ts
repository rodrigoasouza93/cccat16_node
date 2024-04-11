import { validate } from "../src/application/validateCpf";

test.each([
  "97456321558",
  "71428793860",
  "87748248800"
])("should test a valid cpf: %s", function (cpf: any) {
  expect(validate(cpf)).toBe(true);
});

test.each([
  undefined,
  null,
  "11111111111",
  "123",
  "1234567891234567"
])("should test a invalid cpf: %s", function (cpf: any) {
  expect(validate(cpf)).toBe(false);
});
