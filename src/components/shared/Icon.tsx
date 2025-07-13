import * as OutlineIcons from "@heroicons/react/24/outline";
import * as SolidIcons from "@heroicons/react/24/solid";
import styled from "styled-components";
import { type ComponentType, type SVGProps } from "react";

type OutlineIconName = keyof typeof OutlineIcons;
type SolidIconName = keyof typeof SolidIcons;
export type IconName = OutlineIconName | SolidIconName;

const iconSizes = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
  "2xl": "w-10 h-10",
} as const;

export type IconSize = keyof typeof iconSizes;

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
  name: IconName;
  variant?: "outline" | "solid";
  size?: IconSize;
  className?: string;
}

const StyledIconWrapper = styled.span.attrs<IconProps>(
  ({ size = "md", className = "" }) => ({
    className: `${iconSizes[size]} ${className}`,
  })
)<IconProps>``;

export function Icon({
  name,
  variant = "outline",
  size = "md",
  className = "",
  ...props
}: IconProps) {
  const IconComponent = (
    variant === "outline"
      ? OutlineIcons[name as OutlineIconName]
      : SolidIcons[name as SolidIconName]
  ) as ComponentType<SVGProps<SVGSVGElement>>;

  if (!IconComponent) {
    return null;
  }

  return (
    <StyledIconWrapper name={name} size={size} className={className}>
      <IconComponent {...props} />
    </StyledIconWrapper>
  );
}
