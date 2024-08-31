import { act, renderHook } from "@testing-library/react";
import { useManualNadaInput } from "./useManualNadaInput";

describe("useManualNadaInput", () => {
  it("should initialize with a default input", () => {
    const { result } = renderHook(() => useManualNadaInput());
    expect(result.current.inputs).toHaveLength(1);
    expect(result.current.inputs[0]).toHaveProperty("id");
    expect(result.current.inputs[0].name).toBe("");
    expect(result.current.inputs[0].type).toBe("");
    expect(result.current.inputs[0].value).toBe("");
  });

  it("should add a new input when addInput is called", () => {
    const { result } = renderHook(() => useManualNadaInput());
    act(() => {
      result.current.addInput();
    });
    expect(result.current.inputs).toHaveLength(2);
    expect(result.current.inputs[1]).toHaveProperty("id");
    expect(result.current.inputs[1].name).toBe("");
    expect(result.current.inputs[1].type).toBe("");
    expect(result.current.inputs[1].value).toBe("");
  });

  it("should add multiple inputs", () => {
    const { result } = renderHook(() => useManualNadaInput());
    act(() => {
      result.current.addInput();
      result.current.addInput();
    });
    expect(result.current.inputs).toHaveLength(3);
  });

  it("should set input property correctly", () => {
    const { result } = renderHook(() => useManualNadaInput());
    const inputId = result.current.inputs[0].id;
    act(() => {
      result.current.setInputProperty("value", inputId as string, "test value");
    });
    expect(result.current.inputs[0].value).toBe("test value");
  });

  it("should only update the specified input's property", () => {
    const { result } = renderHook(() => useManualNadaInput());
    act(() => {
      result.current.addInput();
    });
    const firstInputId = result.current.inputs[0].id;
    act(() => {
      result.current.setInputProperty(
        "value",
        firstInputId as string,
        "first value"
      );
    });
    expect(result.current.inputs[0].value).toBe("first value");
    expect(result.current.inputs[1].value).toBe("");
  });

  it("should not modify inputs when setting property for non-existent id", () => {
    const { result } = renderHook(() => useManualNadaInput());
    const initialInputs = [...result.current.inputs];
    act(() => {
      result.current.setInputProperty("value", "non-existent-id", "test value");
    });
    expect(result.current.inputs).toEqual(initialInputs);
  });

  it("should generate unique ids for each input", () => {
    const { result } = renderHook(() => useManualNadaInput());
    act(() => {
      result.current.addInput();
      result.current.addInput();
    });
    const ids = result.current.inputs.map((input) => input.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(3);
  });

  it("should preserve existing inputs when adding a new one", () => {
    const { result } = renderHook(() => useManualNadaInput());
    const firstInputId = result.current.inputs[0].id;
    act(() => {
      result.current.setInputProperty(
        "value",
        firstInputId as string,
        "first value"
      );
    });
    act(() => {
      result.current.addInput();
    });
    expect(result.current.inputs).toHaveLength(2);
    expect(result.current.inputs[0].value).toBe("first value");
    expect(result.current.inputs[1].value).toBe("");
  });

  it("should handle setting values for multiple inputs", () => {
    const { result } = renderHook(() => useManualNadaInput());
    act(() => {
      result.current.addInput();
      result.current.addInput();
    });
    const [id1, id2, id3] = result.current.inputs.map((input) => input.id);
    act(() => {
      result.current.setInputProperty("value", id1 as string, "value 1");
      result.current.setInputProperty("value", id2 as string, "value 2");
      result.current.setInputProperty("value", id3 as string, "value 3");
    });
    expect(result.current.inputs[0].value).toBe("value 1");
    expect(result.current.inputs[1].value).toBe("value 2");
    expect(result.current.inputs[2].value).toBe("value 3");
  });
});
