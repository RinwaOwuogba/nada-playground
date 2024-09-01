import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import axios from "axios";
import GitHubImporter from "./index";
import { INadaInput } from "../../hooks/useNadaInput";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const sampleProgramContent = `
from nada_dsl import *

def nada_main():
    party_alice = Party(name="Alice")
    party_bob = Party(name="Bob")
    party_charlie = Party(name="Charlie")
    num_1 = SecretInteger(Input(name="num_1", party=party_alice))
    num_2 = SecretInteger(Input(name="num_2", party=party_bob))
    sum = num_1 + num_2
    return [Output(sum, "sum", party_charlie)]
`;

const sampleInputContent = `
---
program: addition
inputs:
  num_1: 30
  num_2: 10
expected_outputs:
  sum: 40
`;

const expectedParsedInput: INadaInput[] = [
  { name: "num_1", type: "", value: "30" },
  { name: "num_2", type: "", value: "10" },
];

describe("GitHubImporter", () => {
  let isOpen = true;
  const onClose = () => {
    isOpen = false;
  };
  const mockLoadProgram = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    isOpen = true;
  });

  it("updates inputs when typed in", async () => {
    render(
      <GitHubImporter
        isOpen={isOpen}
        onClose={onClose}
        loadProgram={mockLoadProgram}
      />
    );

    const programInput = screen.getByPlaceholderText(/addition.py/);
    const inputInput = screen.getByPlaceholderText(/addition_input.yaml/);

    await userEvent.type(programInput, "https://example.com/program.py");
    await userEvent.type(inputInput, "https://example.com/input.yaml");

    expect(programInput).toHaveValue("https://example.com/program.py");
    expect(inputInput).toHaveValue("https://example.com/input.yaml");
  });

  it("does not update inputs during import", async () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <GitHubImporter
        isDisabled={true}
        isOpen={isOpen}
        onClose={onClose}
        loadProgram={mockLoadProgram}
      />
    );

    const programInput = screen.getByPlaceholderText(/addition.py/);
    const inputInput = screen.getByPlaceholderText(/addition_input.yaml/);
    const loadButton = screen.getByText("Load Program");

    await userEvent.type(programInput, "https://example.com/program.py");
    await userEvent.type(inputInput, "https://example.com/input.yaml");
    await userEvent.click(loadButton);

    await waitFor(() => {
      expect(loadButton).toBeDisabled();
    });

    await userEvent.type(programInput, "https://example.com/new.py");
    await userEvent.type(inputInput, "https://example.com/new.yaml");

    expect(programInput).toHaveValue("https://example.com/program.py");
    expect(inputInput).toHaveValue("https://example.com/input.yaml");
  });

  it("parses program and input files correctly", async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes("program")) {
        return Promise.resolve({ data: sampleProgramContent });
      } else if (url.includes("input")) {
        return Promise.resolve({ data: sampleInputContent });
      }
      return Promise.reject(new Error("Invalid URL"));
    });

    render(
      <GitHubImporter
        isOpen={isOpen}
        onClose={onClose}
        loadProgram={mockLoadProgram}
      />
    );

    const programInput = screen.getByPlaceholderText(/addition.py/);
    const inputInput = screen.getByPlaceholderText(/addition_input.yaml/);
    const loadButton = screen.getByText("Load Program");

    await userEvent.type(programInput, "https://example.com/program.py");
    await userEvent.type(inputInput, "https://example.com/input.yaml");
    await userEvent.click(loadButton);

    await waitFor(() => {
      expect(mockLoadProgram).toHaveBeenCalledWith(
        sampleProgramContent,
        expect.arrayContaining(
          expectedParsedInput.map((input) =>
            expect.objectContaining({
              ...input,
              id: expect.any(String),
            })
          )
        )
      );
    });
  });

  it("disables load button when input and program URLs are not supplied", async () => {
    render(
      <GitHubImporter
        isOpen={isOpen}
        onClose={onClose}
        loadProgram={mockLoadProgram}
      />
    );

    const loadButton = screen.getByText("Load Program");
    expect(loadButton).toBeDisabled();

    const programInput = screen.getByPlaceholderText(/addition.py/);
    const inputInput = screen.getByPlaceholderText(/addition_input.yaml/);

    await userEvent.type(programInput, "https://example.com/program.py");
    expect(loadButton).toBeDisabled();

    await userEvent.type(inputInput, "https://example.com/input.yaml");
    expect(loadButton).toBeEnabled();

    await userEvent.clear(programInput);
    expect(loadButton).toBeDisabled();
  });

  it("cannot be closed during import", async () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <GitHubImporter
        isOpen={isOpen}
        onClose={onClose}
        loadProgram={mockLoadProgram}
      />
    );

    const loadButton = screen.getByText("Load Program");
    const cancelButton = screen.getByText("Cancel");
    const programInput = screen.getByPlaceholderText(/addition.py/);
    const inputInput = screen.getByPlaceholderText(/addition_input.yaml/);

    await userEvent.type(programInput, "https://example.com/program.py");
    await userEvent.type(inputInput, "https://example.com/input.yaml");
    await userEvent.click(loadButton);
    await userEvent.click(cancelButton);

    expect(isOpen).toBe(true);
  });

  it("closes after successful import", async () => {
    const GitHubImporterWrapper = () => {
      const [isOpen, setIsOpen] = useState(true);

      const handleClose = () => setIsOpen(false);

      return (
        <GitHubImporter
          isOpen={isOpen}
          onClose={handleClose}
          loadProgram={mockLoadProgram}
        />
      );
    };

    // Mock axios responses
    mockedAxios.get.mockResolvedValueOnce({ data: sampleProgramContent });
    mockedAxios.get.mockResolvedValueOnce({ data: sampleInputContent });

    render(<GitHubImporterWrapper />);

    const programInput = screen.getByPlaceholderText(/addition.py/);
    const inputInput = screen.getByPlaceholderText(/addition_input.yaml/);
    const loadButton = screen.getByText("Load Program");

    await userEvent.type(programInput, "https://example.com/program.py");
    await userEvent.type(inputInput, "https://example.com/input.yaml");
    await userEvent.click(loadButton);

    await waitFor(() => {
      expect(mockLoadProgram).toHaveBeenCalledWith(
        sampleProgramContent,
        expect.arrayContaining(
          expectedParsedInput.map((input) =>
            expect.objectContaining({
              ...input,
              id: expect.any(String),
            })
          )
        )
      );
    });

    // Wait for the onClose function to be called and the component to re-render with isOpen = false
    await waitFor(() => {
      expect(
        screen.queryByText("Import program from github")
      ).not.toBeInTheDocument();
    });
  });

  it("can be closed outside an import", async () => {
    render(
      <GitHubImporter
        isOpen={isOpen}
        onClose={onClose}
        loadProgram={mockLoadProgram}
      />
    );

    const cancelButton = screen.getByText("Cancel");

    await userEvent.click(cancelButton);

    expect(isOpen).toBe(false);
  });

  it("clears input after successful import", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: sampleProgramContent });
    mockedAxios.get.mockResolvedValueOnce({ data: sampleInputContent });

    render(
      <GitHubImporter
        isOpen={true}
        onClose={onClose}
        loadProgram={mockLoadProgram}
      />
    );

    const programInput = screen.getByPlaceholderText(/addition.py/);
    const inputInput = screen.getByPlaceholderText(/addition_input.yaml/);
    const loadButton = screen.getByText("Load Program");

    await userEvent.type(programInput, "https://example.com/program.py");
    await userEvent.type(inputInput, "https://example.com/input.yaml");
    await userEvent.click(loadButton);

    await waitFor(() => {
      expect(mockLoadProgram).toHaveBeenCalled();
    });

    expect(programInput).toHaveValue("");
    expect(inputInput).toHaveValue("");
  });

  it("loads program when pressing enter", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: sampleProgramContent });
    mockedAxios.get.mockResolvedValueOnce({ data: sampleInputContent });

    render(
      <GitHubImporter
        isOpen={true}
        onClose={onClose}
        loadProgram={mockLoadProgram}
      />
    );

    const programInput = screen.getByPlaceholderText(/addition.py/);
    const inputInput = screen.getByPlaceholderText(/addition_input.yaml/);

    await userEvent.type(programInput, "https://example.com/program.py");
    await userEvent.type(inputInput, "https://example.com/input.yaml{enter}");

    await waitFor(() => {
      expect(mockLoadProgram).toHaveBeenCalled();
    });
  });
});
