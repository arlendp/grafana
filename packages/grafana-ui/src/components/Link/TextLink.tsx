import { css } from '@emotion/css';
import React, { AnchorHTMLAttributes, forwardRef } from 'react';

import { GrafanaTheme2, locationUtil, textUtil, ThemeTypographyVariantTypes } from '@grafana/data';

import { useTheme2 } from '../../themes';
import { IconName, IconSize } from '../../types';
import { Icon } from '../Icon/Icon';
import { customWeight } from '../Text/utils';

import { Link } from './Link';

interface TextLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'> {
  /** url to which redirect the user, external or internal */
  href: string;
  /** Color to use for text */
  color?: keyof GrafanaTheme2['colors']['text'];
  /** Specify if the link will redirect users to a page in or out Grafana */
  external?: boolean;
  /** True when the link will be displayed inline with surrounding text, false if it will be displayed as a block. Depending on this prop correspondant default styles will be applied */
  inline?: boolean;
  /** The default variant is 'body'. To fit another styles set the correspondent variant as it is necessary also to adjust the icon size */
  variant?: keyof ThemeTypographyVariantTypes;
  /** Override the default weight for the used variant */
  weight?: 'light' | 'regular' | 'medium' | 'bold';
  /** Set the icon to be shown. An external link will show the 'external-link-alt' icon as default.*/
  icon?: IconName;
  children: string;
}

const svgSizes: {
  [key in keyof ThemeTypographyVariantTypes]: IconSize;
} = {
  h1: 'xl',
  h2: 'xl',
  h3: 'lg',
  h4: 'lg',
  h5: 'md',
  h6: 'md',
  body: 'md',
  bodySmall: 'xs',
};

export const TextLink = forwardRef<HTMLAnchorElement, TextLinkProps>(
  (
    { href, color = 'link', external = false, inline = true, variant = 'body', weight, icon, children, ...rest },
    ref
  ) => {
    const validUrl = locationUtil.stripBaseFromUrl(textUtil.sanitizeUrl(href ?? ''));

    const theme = useTheme2();
    const styles = getLinkStyles(theme, inline, variant, weight, color);
    const externalIcon = icon || 'external-link-alt';

    return external ? (
      <a href={validUrl} ref={ref} target="_blank" rel="noreferrer" {...rest} className={styles}>
        {children}
        <Icon size={svgSizes[variant] || 'md'} name={externalIcon} />
      </a>
    ) : (
      <Link ref={ref} href={validUrl} {...rest} className={styles}>
        {children}
        {icon && <Icon name={icon} size={svgSizes[variant] || 'md'} />}
      </Link>
    );
  }
);

TextLink.displayName = 'TextLink';

export const getLinkStyles = (
  theme: GrafanaTheme2,
  inline: boolean,
  variant?: keyof ThemeTypographyVariantTypes,
  weight?: TextLinkProps['weight'],
  color?: TextLinkProps['color']
) => {
  return css([
    variant && {
      ...theme.typography[variant],
    },
    weight && {
      fontWeight: customWeight(weight, theme),
    },
    color && {
      color: theme.colors.text[color],
    },
    {
      alignItems: 'center',
      gap: '0.25em',
      display: 'inline-flex',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
        color: theme.colors.text.link,
      },
    },
    inline && {
      textDecoration: 'underline',
      '&:hover': {
        textDecoration: 'none',
      },
    },
  ]);
};
