import { IExampleProgram } from "@/components/example-programs";

const examplePrograms: IExampleProgram[] = [
  {
    name: "Voting (Imperative Style)",
    description: "A voting program implemented in an imperative style.",
    code: `from nada_audit import *

def nada_main():
    # Create the voter parties and recipient party.
    voters: list[Party] = []
    for v in range(2):
        voters.append(Party("Party" + str(v)))
    outparty = Party(name="OutParty")

    # Gather the inputs (one vote for each candidate from each voter).
    votes_per_candidate: list[list[SecretInteger]] = []
    for c in range(4):
        votes_per_candidate.append([])
        for v in range(2):
            votes_per_candidate[c].append(SecretInteger(
                Input(
                    name="v" + str(v) + "_c" + str(c),
                    party=Party("Party" + str(v))
                )
            ))

    # Calculate the total for each candidate.
    outputs: list[Output] = []
    for c in range(4):
        outputs.append(Output(sum(votes_per_candidate[c]), "c" + str(c), outparty))

    return outputs`,
    inputs: [
      { name: "v0_c0", value: "17", type: "SecretInteger" },
      { name: "v1_c0", value: "103", type: "SecretInteger" },
      { name: "v0_c1", value: "17", type: "SecretInteger" },
      { name: "v1_c1", value: "42", type: "SecretInteger" },
      { name: "v0_c2", value: "168", type: "SecretInteger" },
      { name: "v1_c2", value: "59", type: "SecretInteger" },
      { name: "v0_c3", value: "165", type: "SecretInteger" },
      { name: "v1_c3", value: "191", type: "SecretInteger" },
    ],
  },
  {
    name: "Voting (Functional Style)",
    description: "A voting program implemented in a functional style.",
    code: `from nada_audit import *

def nada_main():
    voters = [Party("Party" + str(v)) for v in range(2)]
    outparty = Party(name="OutParty")

    votes_per_candidate = [
        [
            SecretInteger(
                Input(
                    name="v" + str(v) + "_c" + str(c),
                    party=Party("Party" + str(v))
                )
            )
            for v in range(2)
        ]
        for c in range(4)
    ]

    return [
      Output(sum(votes_per_candidate[c]), "c" + str(c), outparty)
      for c in range(4)
    ]`,
    inputs: [
      { name: "v0_c0", value: "17", type: "SecretInteger" },
      { name: "v1_c0", value: "103", type: "SecretInteger" },
      { name: "v0_c1", value: "17", type: "SecretInteger" },
      { name: "v1_c1", value: "42", type: "SecretInteger" },
      { name: "v0_c2", value: "168", type: "SecretInteger" },
      { name: "v1_c2", value: "59", type: "SecretInteger" },
      { name: "v0_c3", value: "165", type: "SecretInteger" },
      { name: "v1_c3", value: "191", type: "SecretInteger" },
    ],
  },
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
      { name: "secret1", value: "10", type: "SecretInteger" },
      { name: "secret2", value: "20", type: "SecretInteger" },
      { name: "secret3", value: "30", type: "SecretInteger" },
    ],
  },
  {
    name: "Random Number",
    description: "An example demonstrating the use of random numbers.",
    code: `from nada_dsl import *

def nada_main():
    party_alice = Party(name="Alice")
    party_bob = Party(name="Bob")
    party_charlie = Party(name="Charlie")
    num_1 = SecretInteger(Input(name="num_1", party=party_alice))
    num_2 = SecretInteger(Input(name="num_2", party=party_bob))
    
    # Generate a secret integer with the random value in the range of 0 to max
    max = 10
    random_int = SecretInteger.random() % Integer(max+1)

    sum = num_1 + num_2
    check_min = (sum + random_int)  >= (Integer(0) + sum)
    check_max = (sum + random_int)  <= (Integer(max) + sum)
    return [
        Output(check_min, "check_min", party_charlie),
        Output(check_max, "check_max", party_charlie)
    ]`,
    inputs: [
      { name: "num_1", value: "5", type: "SecretInteger" },
      { name: "num_2", value: "7", type: "SecretInteger" },
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
      { name: "num_1", value: "10", type: "SecretInteger" },
      { name: "num_2", value: "20", type: "SecretInteger" },
    ],
  },
];

export default examplePrograms;
