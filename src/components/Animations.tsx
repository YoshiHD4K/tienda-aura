import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ComponentProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    id?: string;
}

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20
    },
    in: {
        opacity: 1,
        y: 0
    },
    out: {
        opacity: 0,
        y: -20
    }
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
} as const;

export const PageTransition = ({ children, className, id }: ComponentProps) => {
    return (
        <motion.div
            id={id}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const FadeIn = ({ children, className, delay = 0, id }: ComponentProps) => {
    return (
        <motion.div
            id={id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
};
