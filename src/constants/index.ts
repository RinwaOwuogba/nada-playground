const constants = {
  EDITOR_PLACEHOLDER_TEXT: "Start typing code here..",
  SAMPLE_CODE: `\
from nada_dsl import *

def nada_main():
    party_alice = Party(name="Alice")
    party_bob = Party(name="Bob")
    party_charlie = Party(name="Charlie")
    num_1 = SecretInteger(Input(name="num_1", party=party_alice))
    num_2 = SecretInteger(Input(name="num_2", party=party_bob))
    product = num_1 * num_2
    return [Output(product, "product", party_charlie)]
    `,
};

export default constants;
