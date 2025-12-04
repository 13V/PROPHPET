'use client';
import { WalletConnect } from "@/components/WalletConnect";
import { PredictionCard } from "@/components/PredictionCard";
import { Tokenomics } from "@/components/Tokenomics";
import { Roadmap } from "@/components/Roadmap";
import { HowItWorks } from "@/components/HowItWorks";
import { Stats } from "@/components/Stats";
import { FAQ } from "@/components/FAQ";
import { HowToBuy } from "@/components/HowToBuy";
import { TrustBadges } from "@/components/TrustBadges";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Twitter, Send } from "lucide-react";

import { dailyPredictions } from "@/data/predictions";

const predictions = dailyPredictions;

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-gray-950 to-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-purple-500" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              OMEN
            </h1>
          </div>
          <WalletConnect />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 opacity-20 blur-3xl" />
          <div className="absolute right-1/4 top-1/4 h-[300px] w-[400px] rounded-full bg-gradient-to-t from-cyan-500 via-purple-500 opacity-30 blur-2xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <div className="mb-6 inline-block rounded-full bg-purple-500/10 px-4 py-2 border border-purple-500/20">
            <span className="text-purple-400 font-semibold">🔥 Fair Launch on Pump.fun Soon</span>
          </div>
          <h2 className="mb-6 text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 md:text-7xl">
            PREDICT THE FUTURE.<br />EARN REWARDS.
          </h2>
          <p className="mb-8 text-xl text-gray-400 max-w-2xl mx-auto">
            The only memecoin with real utility. Vote on crypto predictions, prove you&apos;re an oracle, and earn rewards for being right. 🔮
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold text-white hover:scale-105 transition-all flex items-center justify-center gap-2">
              Buy $OMEN
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg font-bold text-white transition-all border border-gray-700">
              Read Whitepaper
            </button>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4">
            <a href="#" className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all border border-gray-700">
              <Twitter className="w-5 h-5 text-gray-400" />
            </a>
            <a href="#" className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all border border-gray-700">
              <Send className="w-5 h-5 text-gray-400" />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <Stats />

      {/* How It Works */}
      <HowItWorks />

      {/* Predictions Grid */}
      <div className="py-20 px-6 bg-gray-950">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Active Predictions
            </h2>
            <p className="text-xl text-gray-400">Vote now and prove you&apos;re an oracle.</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {predictions.map((prediction, index) => (
              <motion.div
                key={prediction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PredictionCard {...prediction} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Tokenomics */}
      <Tokenomics />

      {/* Roadmap */}
      <Roadmap />

      {/* How to Buy */}
      <HowToBuy />

      {/* Trust Badges */}
      <TrustBadges />

      {/* FAQ */}
      <FAQ />

      {/* Footer */}
      <div className="border-t border-gray-800 bg-gray-950 py-12 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="h-6 w-6 text-purple-500" />
            <span className="text-xl font-bold text-white">OMEN</span>
          </div>
          <p className="text-gray-400 mb-6">
            Built for degens, by degens. 🚀
          </p>
          <div className="mb-8 text-xs text-gray-600 max-w-2xl mx-auto">
            <p>
              LEGAL DISCLAIMER: $OMEN is a memecoin with no intrinsic value or expectation of financial return.
              The prediction platform is for entertainment purposes only.
              Nothing on this site constitutes financial advice.
              Cryptocurrency investments are volatile and high-risk.
              Always do your own research (DYOR).
            </p>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-purple-400 transition-colors">Twitter</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Telegram</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Discord</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Whitepaper</a>
          </div>
        </div>
      </div>
    </main >
  );
}
