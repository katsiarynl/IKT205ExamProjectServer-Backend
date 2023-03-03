//we decided to configure test by following the instructions on  https://docs.expo.dev/guides/testing-with-jest/
//and //https://stackoverflow.com/questions/44294286/jest-test-dev-is-not-defined to configure jest
//the following documentation: https://jestjs.io/docs/expect was also used to create a simple test

describe("<App />", () => {
  test("resolves to lemon", () => {
    // make sure to add a return statement
    return expect(true).toBe(true);
  });
});
