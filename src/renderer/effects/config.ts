import { useState } from "react"
import { default as api } from "@renderer/services/api"

type HookType = [
  string | undefined, 
  () => void, 
  (value: string) => void];

export const useConfig = (key: string): HookType => {
  const [value, setValue] = useState<string>();

  const readValue = async () => {
    const updatedValue = await api.getConfig(key);
    setValue(updatedValue);
  }

  const writeValue = async (value: string) => {
    const success = await api.setConfig(key, value);
    
    if (success) {
      setValue(value);
    }
  }

  return [value, readValue, writeValue];
}