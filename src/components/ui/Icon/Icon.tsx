import type { IconComponent } from "./icons";

interface IconProps {
  icon: IconComponent;
  size?: number;
  className?: string;
  title?: string;
}

export function Icon({ icon: Glyph, size, className, title }: IconProps) {
  return (
    <Glyph
      {...(size != null ? { width: size, height: size } : {})}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable={false}
    />
  );
}
