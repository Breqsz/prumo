import type { ElementType, ComponentPropsWithoutRef } from "react";

type LiquidGlassOwnProps<E extends ElementType> = {
  as?: E;
  className?: string;
  children?: React.ReactNode;
};

type LiquidGlassProps<E extends ElementType> = LiquidGlassOwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof LiquidGlassOwnProps<E>>;

export function LiquidGlass<E extends ElementType = "div">({
  as,
  className = "",
  children,
  ...rest
}: LiquidGlassProps<E>) {
  const Component = (as ?? "div") as ElementType;
  return (
    <Component className={`liquid-glass ${className}`.trim()} {...rest}>
      {children}
    </Component>
  );
}
