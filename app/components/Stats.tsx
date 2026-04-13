'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import CountUp from 'react-countup'
import { CheckCircle, Users, Award, Clock } from 'lucide-react'

interface StatProps {
  number: number
  label: string
  suffix?: string
  icon: React.ReactNode
}

function StatCounter({ number, label, suffix = '', icon }: StatProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' })
  const [startCounter, setStartCounter] = useState(false)
  
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isInView) {
      timer = setTimeout(() => setStartCounter(true), 300)
    }
    return () => clearTimeout(timer)
  }, [isInView])
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col items-center p-6 bg-white/80 backdrop-blur-xl rounded-2xl border border-blue-100/50 hover:border-blue-200/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.02] overflow-hidden"
    >
      {/* Decorative gradient blur */}
      <div 
        className="absolute -inset-[200%] bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-1000 opacity-0 group-hover:opacity-100" 
        aria-hidden="true"
      />
      
      {/* Icon with floating animation */}
      <motion.div
        className="relative mb-4 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-600 transition-colors duration-300 group-hover:text-blue-700"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        {icon}
      </motion.div>

      {/* Counter with gradient text */}
      <div className="relative text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
        {startCounter && (
          <div className="flex items-center gap-1" aria-label={`${number}${suffix || ''}`}>
            <span className="tabular-nums">
              <CountUp
                start={0}
                end={number}
                aria-hidden="true"
              />
            </span>
            {suffix && <span className="text-blue-600">{suffix}</span>}
          </div>
        )}
      </div>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative mt-3 text-sm font-medium text-gray-600 text-center group-hover:text-gray-800 transition-colors duration-300"
      >
        {label}
      </motion.p>

      {/* Hover indicator */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 transition-all duration-300"
        initial={{ width: '0%' }}
        whileHover={{ width: '100%' }}
        aria-hidden="true"
      />
    </motion.div>
  )
}

const backgroundAnimations = {
  top: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 1 }
  },
  bottom: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 1, delay: 0.5 }
  }
} as const

export default function Stats() {
  const stats = [
    { number: 150, label: 'Projects Completed', suffix: '+', icon: <CheckCircle size={24} strokeWidth={2} aria-hidden="true" /> },
    { number: 95, label: 'Happy Clients', suffix: '%', icon: <Users size={24} strokeWidth={2} aria-hidden="true" /> },
    { number: 10, label: 'Years Experience', suffix: '+', icon: <Award size={24} strokeWidth={2} aria-hidden="true" /> },
    { number: 24, label: 'Support Hours', suffix: '/7', icon: <Clock size={24} strokeWidth={2} aria-hidden="true" /> },
  ] as const
  
  return (
    <section 
      className="relative py-16 md:py-24 px-4 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50"
      aria-labelledby="achievements-heading"
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_50%)] pointer-events-none"
          initial={backgroundAnimations.top.initial}
          animate={backgroundAnimations.top.animate}
          transition={backgroundAnimations.top.transition}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,rgba(147,51,234,0.1),transparent_50%)] pointer-events-none"
          initial={backgroundAnimations.bottom.initial}
          animate={backgroundAnimations.bottom.animate}
          transition={backgroundAnimations.bottom.transition}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -50px 0px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 
            id="achievements-heading"
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 bg-clip-text text-transparent"
          >
            Our Achievements
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Delivering excellence through innovation and dedication
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -50px 0px' }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {stats.map((stat, index) => (
            <StatCounter
              key={`stat-${index}`}
              number={stat.number}
              label={stat.label}
              suffix={stat.suffix}
              icon={stat.icon}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}