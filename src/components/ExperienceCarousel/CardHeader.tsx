import React from 'react';
import styles from './ExperienceCarousel.module.css';
import { colors, typography, radii, spacing } from './designTokens';

interface CardHeaderProps {
  companyLogo: string;
  alt: string;
  companyName: string;
  position: string;
  dateRange: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  companyLogo,
  alt,
  companyName,
  position,
  dateRange,
}) => (
    <div className={styles.cardHeader} tabIndex={0}>
    <img
      src={companyLogo}
      alt={alt}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: radii.sm,
        marginRight: spacing.md,
      }}
    />
    <div className={styles.headerTopRow}>
      <div className={styles.titleGroup}>
        <h3
          style={{
            fontFamily: typography.header.fontFamily,
            fontSize: typography.header.fontSize,
            fontWeight: typography.header.fontWeight,
            color: colors.textPrimary,
            lineHeight: typography.header.lineHeight,
            margin: 0,
          }}
        >
          {companyName}
        </h3>
        <p className={styles.position} style={{
          fontSize: typography.subheader.fontSize,
          fontWeight: typography.subheader.fontWeight,
          color: colors.textSecondary,
          margin: 0,
          marginTop: '4px',
        }}>
          {position}
        </p>
      </div>
      <div className={styles.dateChip}>
        <i className="fas fa-calendar-alt" aria-hidden="true" />
        <span>{dateRange}</span>
      </div>
    </div>
  </div>
);

export default CardHeader;