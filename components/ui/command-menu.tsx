"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { type DialogProps } from "@radix-ui/react-dialog";
import { Circle, Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

// import { searchDocs } from "@/config/docs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";

export function CommandMenu({ ...props }: DialogProps) {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const { setTheme } = useTheme();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
                if (
                    (e.target instanceof HTMLElement &&
                        e.target.isContentEditable) ||
                    e.target instanceof HTMLInputElement ||
                    e.target instanceof HTMLTextAreaElement ||
                    e.target instanceof HTMLSelectElement
                ) {
                    return;
                }

                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

    return (
        <>
            <Button
                variant="outline"
                className={cn(
                    "relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64",
                )}
                onClick={() => setOpen(true)}
                {...props}
            >
                <span className="hidden lg:inline-flex">
                    Search documentation...
                </span>
                <span className="inline-flex lg:hidden">Search...</span>
                <kbd className="font-mono pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {/* {searchDocs.map((group, i) => (
                        <CommandGroup
                            key={`${group.name}-${i}`}
                            heading={group.name}
                        >
                            {group.items.map((navItem) => (
                                <CommandItem
                                    key={`${navItem.href}-${navItem.name}`}
                                    value={navItem.name}
                                    onSelect={() => {
                                        runCommand(() =>
                                            router.push(navItem.href),
                                        );
                                    }}
                                >
                                    <div className="mr-2 flex h-4 w-4 items-center justify-center">
                                        <Circle className="h-3 w-3" />
                                    </div>
                                    {navItem.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    ))} */}
                    <CommandSeparator />
                    <CommandGroup heading="Theme">
                        <CommandItem
                            onSelect={() => runCommand(() => setTheme("light"))}
                        >
                            <Sun />
                            Light
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => setTheme("dark"))}
                        >
                            <Moon />
                            Dark
                        </CommandItem>
                        <CommandItem
                            onSelect={() =>
                                runCommand(() => setTheme("system"))
                            }
                        >
                            <Laptop />
                            System
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
