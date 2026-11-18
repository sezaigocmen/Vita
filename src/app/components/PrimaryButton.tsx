/** Figma: Component/Next – 50px yüksek, 19px köşe, hafif gölgeli ana buton */
import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: 'brand' | 'mint'
  size?: 'xl' | 'lg'
}

export function PrimaryButton({ tone = 'brand', size = 'xl', className = '', children, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`pressable flex h-[50px] w-full items-center justify-center rounded-[19px] font-semibold text-white shadow-btn ${
        tone === 'brand' ? 'bg-brand' : 'bg-mint'
      } ${size === 'xl' ? 'text-[30px] leading-[36px]' : 'text-[20px] leading-[24px]'} ${className}`}
    >
      {children}
    </button>
  )
}
