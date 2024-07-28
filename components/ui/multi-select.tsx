import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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

export type OptionType = {
  label: string;
  value: string;
};

function MultiSelect({
  options,
  selected,
  onChange,
  displayLabel,
  onValueChange,
  className,
  placeholder = "Select...",
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item: string) => {
    const newSelected = selected.filter((i) => i !== item);
    if (onChange) onChange(newSelected);
    if (onValueChange) onValueChange(newSelected);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            className,
            selected.length > 1 ? "h-auto" : "h-10"
          )}
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-wrap gap-1">
            {!selected ||
              (selected.length === 0 && (
                <span className="text-body font-normal">{placeholder}</span>
              ))}
            {selected.map((item) => (
              <Badge key={item} className="flex gap-1.5">
                {displayLabel
                  ? options?.find((option) => option.value === item)?.label
                  : item}
                <X
                  className="h-4 w-4 hover:text-destructive"
                  onClick={() => handleUnselect(item)}
                />
              </Badge>
            ))}
          </div>
          <ChevronsUpDown className="text-strokedark h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="z-[999999] w-full p-0">
        <Command>
          <CommandInput placeholder="Search ..." />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    const newSelected = selected.includes(option.value)
                      ? selected.filter((item) => item !== option.value)
                      : [...selected, option.value];
                    if (onChange) onChange(newSelected);
                    if (onValueChange) onValueChange(newSelected);
                    setOpen(true);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export interface MultiSelectProps {
  options: OptionType[];
  selected: string[];
  displayLabel?: boolean;
  onChange?: React.Dispatch<React.SetStateAction<string[]>>;
  onValueChange?: (value: Array<string>) => void;
  className?: string;
  placeholder?: string;
}

export { MultiSelect };
