import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <motion.div
            className="relative h-screen bg-cover bg-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}>
            <div className="absolute inset-0 bg-gradient-to-r from-light/50 to-skyblue/20"></div>

            <div className="absolute inset-0 flex items-center justify-center gap-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <DotLottieReact
                        src="https://lottie.host/1b90af72-5f0c-4105-883a-df7d1185fa2a/ejfEvQOEe1.lottie"
                        loop
                        autoplay
                        className='w-xl'
                    />
                    <h1 className="text-3xl md:6xl text-oxfordblue font-bold font-body leading-loose mb-7">Page not found</h1>

                    <Link to='/' className='mt-8 btn-pry'>
                        Let's get you back home
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default NotFound