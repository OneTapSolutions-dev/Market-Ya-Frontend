import { Component, computed, input } from '@angular/core';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Átomo: Avatar (`ui-avatar`).
 * - Mapea a clases daisyUI (`avatar`, `avatar-placeholder`, etc.).
 */
@Component({
  selector: 'ui-avatar',
  templateUrl: './avatar.html',
})
export class Avatar {
  readonly src = input<string>();
  readonly alt = input('Avatar');
  readonly initials = input<string>();
  readonly size = input<AvatarSize>('md');
  readonly bordered = input(true);
  readonly customClass = input('', { alias: 'class' });

  readonly sizeClass = computed(() => {
    const sizes: Record<AvatarSize, string> = {
      xs: 'w-6 h-6 text-[9px]',
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-14 h-14 text-base',
    };
    return sizes[this.size()];
  });
}
