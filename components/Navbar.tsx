'use client'

import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

type NavbarProps = {
  locale: string
}

export default function Navbar({ locale }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signInWithGoogle, signOut } = useAuth()
  const tCommon = useTranslations('common')

  return (
    <nav className="mb-6 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between py-3">
        {/* Logo/Brand */}
        <Link href={`/${locale}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl">🍼</span>
          <span className="font-bold text-lg hidden sm:inline">Baby Bet</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher currentLocale={locale} />
          
          {user ? (
            <>
              <Link
                href={`/${locale}/profile`}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {tCommon('myGuesses')}
              </Link>
              
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                {user.user_metadata?.avatar_url && (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt={user.user_metadata?.full_name || user.email || 'User'}
                    className="w-8 h-8 rounded-full border-2 border-gray-200"
                  />
                )}
                <button
                  onClick={signOut}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  {tCommon('signOut')}
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {tCommon('signIn')}
            </button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg 
            className="w-6 h-6 text-gray-700" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 py-3 space-y-3">
          {/* Language Switcher */}
          <div className="px-2">
            <LanguageSwitcher currentLocale={locale} />
          </div>

          {user ? (
            <>
              {/* Profile Link */}
              <Link
                href={`/${locale}/profile`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {tCommon('myGuesses')}
              </Link>

              {/* User Info */}
              <div className="flex items-center gap-3 px-3 py-2 border-t border-gray-200">
                {user.user_metadata?.avatar_url && (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt={user.user_metadata?.full_name || user.email || 'User'}
                    className="w-10 h-10 rounded-full border-2 border-gray-200"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.user_metadata?.full_name || user.email}
                  </p>
                  <p className="text-xs text-gray-500">{tCommon('signedInAs')}</p>
                </div>
              </div>

              {/* Sign Out */}
              <button
                onClick={() => {
                  signOut()
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {tCommon('signOut')}
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                signInWithGoogle()
                setIsOpen(false)
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {tCommon('signIn')}
            </button>
          )}
        </div>
      )}
    </nav>
  )
}

