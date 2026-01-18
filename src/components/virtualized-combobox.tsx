import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { type JSX, useRef } from "react";

import { useVirtualizer } from "@tanstack/react-virtual";

export type ComboboxItem = {
  value: string;
  label: string;
  icon?: JSX.Element;
};

type ComboboxProps = {
  value?: string;
  items: ComboboxItem[];
  placeholder: string;
  onChange: (value: string) => void;
};

export function VirtualizedCombobox(props: ComboboxProps) {
  const { value, items, placeholder, onChange } = props;

  const [open, setOpen] = React.useState(false);

  const current = items.find((item) => item.value == value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-60 justify-between"
        >
          {value ? (
            <span className="flex items-center truncate">
              {current?.icon && <span className="mr-2">{current?.icon}</span>}{" "}
              {current?.label}
            </span>
          ) : (
            <span className="text-secondary">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0">
        <CommandContent
          value={value}
          items={items}
          placeholder={placeholder}
          onChange={(value) => {
            onChange(value);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

type CommandContentProps = {
  value?: string;
  items: ComboboxItem[];
  placeholder: string;
  onChange: (value: string) => void;
};

function CommandContent(props: CommandContentProps) {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const { value, items, placeholder, onChange } = props;

  const [search, setSearh] = React.useState("");

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => item.label.includes(search));
  }, [search, items]);

  const rowVirtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  const handleInput = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearh(event.target.value);
    },
    [],
  );

  return (
    <Command>
      <CommandInput onInput={handleInput} placeholder={placeholder} />
      <CommandList
        ref={parentRef}
        style={{
          height: "200px",
          width: "100%",
          overflow: "auto",
        }}
      >
        <CommandEmpty>No results</CommandEmpty>
        <CommandGroup>
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => (
              <CommandItem
                key={filteredItems[virtualItem.index]!.value}
                value={filteredItems[virtualItem.index]!.value}
                keywords={[filteredItems[virtualItem.index]!.label]}
                onSelect={(currentValue) => {
                  onChange(currentValue);
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                {filteredItems[virtualItem.index]!.icon}
                {filteredItems[virtualItem.index]!.label}
                <Check
                  className={cn(
                    "ml-2 h-4 w-4",
                    value === filteredItems[virtualItem.index]!.value
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
