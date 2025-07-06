import React from 'react';
import styles from './ExperienceCarousel.module.css';
import { colors, spacing, typography } from './designTokens';

interface CardBodyProps {
  responsibilities: string[];
}

const CardBody: React.FC<CardBodyProps> = ({ responsibilities }) => (
  <ul role="list" className={styles.cardBody}>
    {responsibilities.map((item, idx) => (
      <li key={idx} role="listitem" tabIndex={0} className={styles.listItem}>
        <svg width={24} height={24} fill={colors.bullet} aria-hidden="true" className={styles.bulletIcon}>
          <circle cx={12} cy={12} r={6} />
        </svg>
        <p
          className={styles.itemText}
          style={{
            fontSize: typography.body.fontSize,
            fontWeight: typography.body.fontWeight,
            color: colors.textBody,
            lineHeight: typography.body.lineHeight,
          }}
        >
          {item}
        </p>
      </li>
    ))}
  </ul>
);

export default CardBody;