import { IExampleProgram } from "@/components/example-programs";

const examplePrograms: IExampleProgram[] = [
  {
    name: "List Comprehensions",
    description: "An example demonstrating the use of list comprehensions.",
    code: `from nada_dsl import *

def nada_main():
    party_alice = Party(name="Alice")
    party_bob = Party(name="Bob")
    party_charlie = Party(name="Charlie")
    
    # Inputs from each party
    secret1 = SecretInteger(Input(name="secret1", party=party_alice))
    secret2 = SecretInteger(Input(name="secret2", party=party_bob))
    secret3 = SecretInteger(Input(name="secret3", party=party_charlie))
    
    # List of secrets
    secrets_list = [secret1, secret2, secret3]
    
    # Use List Comprehensions to multiply each secret by multiplier
    multiplier = Integer(2)
    doubled_secrets = [secret * multiplier for secret in secrets_list]
    
    # Return the outputs to party_alice
    return [
        Output(doubled_secrets[i], "doubled_secret_" + str(i + 1), party_alice)
        for i in range(3)
    ]`,
    inputs: [
      { id: "1", name: "secret1", value: "10", type: "SecretInteger" },
      { id: "2", name: "secret2", value: "20", type: "SecretInteger" },
      { id: "3", name: "secret3", value: "30", type: "SecretInteger" },
    ],
  },
  {
    name: "Addition",
    description: "A simple addition example.",
    code: `from nada_dsl import *

def nada_main():
    party_alice = Party(name="Alice")
    party_bob = Party(name="Bob")
    party_charlie = Party(name="Charlie")
    num_1 = SecretInteger(Input(name="num_1", party=party_alice))
    num_2 = SecretInteger(Input(name="num_2", party=party_bob))
    sum = num_1 + num_2
    return [Output(sum, "sum", party_charlie)]`,
    inputs: [
      { id: "1", name: "num_1", value: "10", type: "SecretInteger" },
      { id: "2", name: "num_2", value: "20", type: "SecretInteger" },
    ],
  },
  {
    name: "Ascending List",
    description: "An example demonstrating the creation of an ascending list.",
    code: `from nada_dsl import *

def nada_main():
    party_alice = Party(name="Alice")
    start_int = SecretInteger(Input(name="start", party=party_alice))
    list_length = 3
    
    ascending_list = []
    for i in range(list_length):
        ascending_list.append(start_int + Integer(i))
    
    # Return outputs using a for loop
    outputs = []
    for i in range(len(ascending_list)):
        outputs.append(Output(ascending_list[i], "ascending_list_" + str(i), party_alice))
    
    return outputs`,
    inputs: [{ id: "1", name: "start", value: "5", type: "SecretInteger" }],
  },
];
export default examplePrograms;
