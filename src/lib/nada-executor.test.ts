import executeNadaCode from "./nada-executor";

test("executes nada code", async () => {
  const nadaCode = `from nada_audit import *

def nada_main():
    party1 = Party(name="Party1")
    my_int1 = PublicInteger(4)
    my_int2 = SecretInteger(3)

    new_int = my_int1 * my_int2

    return [Output(new_int, "my_output", party1)]
`;

  const result = await executeNadaCode(nadaCode);
  console.log("🚀 ~ test ~ result:", result);
  expect(result).toBe([`["my_output", "SecretInteger(NadaInt(7))"]`]);
});
