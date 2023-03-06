import { motion, useAnimationControls } from 'framer-motion';
import React, { useEffect } from 'react';

type Props = {
    content: string;
};

const Marquee: React.FC<Props> = ({ content }) => {
    const control = useAnimationControls();
    useEffect(() => {
        const marquee = async () => {
            await control.start({
                x: ['50%', '-100%'],
                transition: {
                    x: {
                        duration: 3,
                        ease: 'linear',
                    },
                },
            });
            await control.start({
                x: ['100%', '50%'],
                transition: {
                    x: {
                        duration: 1,
                        ease: 'linear',
                    },
                },
            });
        };
        let loopResolve: () => void;
        const loop = () => {
            return new Promise<void>(async (resolve) => {
                loopResolve = resolve;
                while (true) {
                    await marquee();
                }
            });
        };
        loop();
        return () => {
            loopResolve();
        };
    }, [control, content]);
    return (
        <div className="w-full max-w-4xl overflow-hidden whitespace-nowrap text-7xl font-bold">
            <motion.div animate={control} className="w-fit">
                {content}
            </motion.div>
        </div>
    );
};

export default Marquee;
