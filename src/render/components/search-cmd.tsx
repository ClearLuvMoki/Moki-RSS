import { Command } from "cmdk";
import { useGlobalStore } from "../store";

export function SearchCmd() {
  const { searchCmdVisible, setSearchCmdVisible } = useGlobalStore();

  return (
    <Command.Dialog open={searchCmdVisible} onOpenChange={setSearchCmdVisible}>
      <Command.Input />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        <Command.Group heading="Letters">
          <Command.Item>a</Command.Item>
          <Command.Item>b</Command.Item>
          <Command.Separator />
          <Command.Item>c</Command.Item>
        </Command.Group>

        <Command.Item>Apple</Command.Item>
      </Command.List>
    </Command.Dialog>
  );
}
