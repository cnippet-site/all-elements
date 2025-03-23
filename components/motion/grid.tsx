"use client";
import React from "react";
import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";

interface GridProps {
    children: React.ReactNode;
    className?: string;
}

export const Grid = ({ children, className }: GridProps) => {
    return (
        <div
            className={twMerge(
                "bg-zinc-900 px-4 py-12 text-zinc-50",
                className,
            )}
        >
            <motion.div
                initial="initial"
                animate="animate"
                transition={{ staggerChildren: 0.05 }}
                className="mx-auto grid max-w-4xl grid-flow-dense grid-cols-12 gap-4"
            >
                {children}
            </motion.div>
        </div>
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Block = ({ className, ...rest }: any) => {
    return (
        <motion.div
            variants={{
                initial: { scale: 0.5, y: 50, opacity: 0 },
                animate: { scale: 1, y: 0, opacity: 1 },
            }}
            transition={{
                type: "spring",
                mass: 3,
                stiffness: 400,
                damping: 50,
            }}
            className={twMerge(
                "col-span-4 rounded-lg border border-zinc-700 bg-zinc-800 p-6",
                className,
            )}
            {...rest}
        />
    );
};

// const Logo = () => (
//     <svg
//         width="40"
//         height="auto"
//         viewBox="0 0 50 39"
//         className="mx-auto mb-12 fill-zinc-50"
//     >
//         <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" />
//         <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" />
//     </svg>
// );

// const Footer = () => (
//     <footer className="mt-12">
//         <p className="text-center text-zinc-400">
//             Made with ❤️ by{" "}
//             <a href="#" className="text-red-300 hover:underline">
//                 @cnippetui
//             </a>
//         </p>
//     </footer>
// );
