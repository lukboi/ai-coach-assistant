'use client'
import { AnimatePresence, motion } from "framer-motion";
import { Dumbbell, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const header = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
     <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Dumbbell className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold">PeriodicGym</span>
          </Link>

          <nav className="hidden font-light md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm hover:text-primary transition-colors"
            >
              Funcionalidades
            </a>
            <a
              href="#pricing"
              className="text-sm hover:text-primary transition-colors"
            >
              Preços
            </a>
            <a
              href="#pricing"
              className="text-sm hover:text-primary transition-colors"
            >
              Sobre
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button
              className="bg-brand-dark border-2 border-primary text-primary"
              variant="outline"
              asChild
            >
              <Link href="/">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/">Começar Grátis</Link>
            </Button>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={isMenuOpen ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            >
              <nav className="flex flex-col items-center gap-4 py-4">
                <a
                  href="#features"
                  className="text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Funcionalidades
                </a>
                <a
                  href="#pricing"
                  className="text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Preços
                </a>
                <a
                  href="#about"
                  className="text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sobre
                </a>
              </nav>
              <div className="flex flex-col gap-3 px-4 pb-4">
                <Button
                  className="bg-brand-dark border-2 border-primary text-primary w-full"
                  variant="outline"
                  asChild
                >
                  <Link href="/">Entrar</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/">Começar Grátis</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
  )
}

export default header
