import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { LanguageToggle } from '@/components/language-toggle'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type TopBarProps = {
  userName?: string
  avatarUrl?: string
}

export function TopBar({ userName, avatarUrl }: TopBarProps) {
  const { t } = useTranslation()
  const initials = userName
    ?.split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="mb-[30px] flex items-center justify-between gap-2">
      <Link
        to="/"
        aria-label={t('common.homeLink')}
        className="rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Logo className="size-[34px]" />
      </Link>

      <div className="flex items-center gap-1.5">
        <LanguageToggle />
        <ThemeToggle />
        <Link to="/account" aria-label={t('common.account')}>
          <Avatar className="size-[30px] border-[0.5px] border-input bg-secondary">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
            <AvatarFallback className="bg-transparent text-[11px] font-semibold text-muted-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  )
}
