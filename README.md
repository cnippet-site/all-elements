# All Elements UI Components

A collection of reusable UI components and hooks for Next.js projects.

## Setup

1. Clone this repository
2. Copy the `components`, `hooks` and `lib` folders into your project
3. Install the required dependencies:

```bash
pnpm add @radix-ui/react-slot @radix-ui/react-collapsible @radix-ui/react-dropdown-menu @radix-ui/react-scroll-area @radix-ui/react-avatar @radix-ui/react-slot @radix-ui/react-tabs  @radix-ui/react-select @radix-ui/react-dialog @radix-ui/react-slot @radix-ui/react-checkbox motion @radix-ui/react-radio-group @radix-ui/react-toast  @radix-ui/react-popover @radix-ui/react-dialog @radix-ui/react-tooltip @radix-ui/react-context-menu @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-separator @internationalized/date @remixicon/react vaul class-variance-authority react-dropzone cmdk react-aria-components react-dropzone tw-animate-css react-hook-form clsx tailwind-merge lucide-react recharts sonner motion zod @hookform/resolvers react-phone-number-input input-otp next-themes embla-carousel embla-carousel-autoplay embla-carousel-react embla-carousel-class-names react-use-measure @motionone/utils @radix-ui/react-progress next-cloudinary
```

4. Add next-themes

```bash
pnpm add next-themes
```

Add next-themes to your `app/layout.tsx` file:

```tsx
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
```

5. Add the following styles to your `styles/global.css` or `global.css` file:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: 221.2 83.2% 53.3%;
  --chart-2: 212 95% 68%;
  --chart-3: 216 92% 60%;
  --chart-4: 210 98% 78%;
  --chart-5: 212 97% 87%;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.145 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.637 0.237 25.331);
  --border: oklch(0.269 0 0);
  --input: oklch(0.269 0 0);
  --ring: oklch(0.556 0 0);
  --chart-1: 221.2 83.2% 53.3%;
  --chart-2: 212 95% 68%;
  --chart-3: 216 92% 60%;
  --chart-4: 210 98% 78%;
  --chart-5: 212 97% 87%;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
}

/*
  The default border color has changed to `currentColor` in Tailwind CSS v4,
  so we've added these compatibility styles to make sure everything still
  looks the same as it did with Tailwind CSS v3.

  If we ever want to remove these styles, we need to add an explicit border
  color utility to any element that depends on these defaults.
*/
@layer base {
  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    border-color: var(--color-gray-200, currentColor);
  }
}

/*
    Disable scrollbar
*/

@layer base {
  html {
    height: -webkit-stretch;
  }
  body {
    height: -webkit-stretch;
  }
  ::-webkit-scrollbar {
    display: none;
  }
}
```

## Usage

Import and use components from the `components/ui` directory:

```tsx
import { Button } from "@/components/ui/button";

export default function Page() {
  return <Button>Click me</Button>;
}
```

Import and use hooks from the `hooks` directory:

```tsx
import { useYourHook } from "@/hooks/your-hook";
```
