import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import {
  CheckCircle,
  FileText,
  CreditCard,
  MessageCircle,
  Shield,
  GraduationCap,
} from 'lucide-react';

const AdmissionProcess = () => {
  const steps = [
    {
      icon: FileText,
      title: 'ধাপ ১: আবেদন ফরম পূরণ',
      description:
        'প্রথমে অফিসিয়াল ভর্তি ফরমটি পূরণ করুন। সকল তথ্য সঠিকভাবে এবং স্পষ্টভাবে দিন। ছাত্র/ছাত্রীর নাম, পিতার নাম, মাতার নাম, মোবাইল, ঠিকানা এবং ক্লাস অবশ্যই পূরণ করতে হবে।',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Shield,
      title: 'ধাপ ২: প্রয়োজনীয় নথি জমা দিন',
      description:
        'ভর্তি প্রক্রিয়ার জন্য প্রয়োজনীয় সকল নথি যেমন জন্ম সনদ, অভিভাবকের পরিচয়পত্র, পূর্ববর্তী স্কুলের শিক্ষাগত সনদ জমা দিন।',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: CreditCard,
      title: 'ধাপ ৩: ভর্তি ফি প্রদান',
      description:
        'নির্ধারিত ভর্তি ফি অফিসে বা অনলাইন মাধ্যমে প্রদান করতে হবে। ফি প্রদানের রসিদ সংরক্ষণ করুন।',
      color: 'from-orange-500 to-red-600',
    },
    {
      icon: MessageCircle,
      title: 'ধাপ ৪: সাক্ষাৎকার বা মূল্যায়ন',
      description:
        'কিছু ক্লাসের জন্য ছাত্র/ছাত্রীকে সাক্ষাৎকার বা ছোট একটি মূল্যায়ন পরীক্ষায় অংশগ্রহণ করতে হতে পারে।',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: CheckCircle,
      title: 'ধাপ ৫: চূড়ান্ত ভর্তি নিশ্চিতকরণ',
      description:
        'ফরম, নথি এবং ফি যাচাইয়ের পর স্কুল কর্তৃপক্ষ চূড়ান্তভাবে ভর্তি নিশ্চিত করবে। নিশ্চিতকরণের পর ছাত্র/ছাত্রীর তথ্য ডাটাবেজে সংরক্ষিত হবে।',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: GraduationCap,
      title: 'ধাপ ৬: ক্লাসে অংশগ্রহণ শুরু',
      description:
        'ভর্তি নিশ্চিত হওয়ার পর ছাত্র/ছাত্রীরা নির্ধারিত ক্লাসে যোগদান করতে পারবে এবং শিক্ষাজীবন শুরু করতে পারবে।',
      color: 'from-violet-500 to-purple-600',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100,
        duration: 0.8,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        delay: 1.2,
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      transition: { type: 'spring', damping: 10, stiffness: 400 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <motion.h1
            className="text-4xl md:text-3xl py-2 font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            ভর্তি প্রক্রিয়া
          </motion.h1>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.p
            className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            আমাদের প্রতিষ্ঠানে ভর্তির জন্য নিচের ধাপগুলো অনুসরণ করুন
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                }}
                className="relative"
              >
                <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-3xl p-8 md:p-10 border border-white/20 relative overflow-hidden group">
                  {/* Background gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                  />

                  {/* Step number indicator */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                    <span className="text-gray-600 font-bold text-sm">{index + 1}</span>
                  </div>

                  <div className="flex items-start gap-6">
                    <motion.div
                      className={`p-4 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg flex-shrink-0`}
                      whileHover={{
                        rotate: 5,
                        scale: 1.1,
                      }}
                      transition={{ type: 'spring', damping: 15 }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>

                    <div className="flex-1">
                      <motion.h2
                        className="text-2xl md:text-3xl font-bold text-gray-800 mb-4"
                        layoutId={`title-${index}`}
                      >
                        {step.title}
                      </motion.h2>
                      <motion.p
                        className="text-gray-600 text-base md:text-lg leading-relaxed"
                        initial={{ opacity: 0.8 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {step.description}
                      </motion.p>
                    </div>
                  </div>

                  {/* Progress connector line (except for last item) */}
                  {index < steps.length - 1 && (
                    <motion.div
                      className="absolute -bottom-4 left-1/2 w-0.5 h-8 bg-gradient-to-b from-gray-300 to-transparent transform -translate-x-1/2"
                      initial={{ height: 0 }}
                      animate={{ height: 32 }}
                      transition={{ delay: 0.5 + index * 0.15, duration: 0.3 }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="flex justify-center mt-16"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Link
              to="/admissionform"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
            >
              <FileText className="w-5 h-5" />
              ভর্তি ফরম পূরণ করুন
              <motion.div
                className="w-2 h-2 bg-white rounded-full"
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdmissionProcess;
