import Button from '@mui/joy/Button';
import { useTranslations } from 'next-intl';
import React from 'react';

import { useDataStore } from '@/stores/data';

export type MobileModes = 'gun' | 'target' | 'impact';

const nextMode: Record<MobileModes, MobileModes> = {
  gun: 'target',
  target: 'impact',
  impact: 'gun',
};

export default function MobileMode() {
  const t = useTranslations();

  const mobileMode = useDataStore((s) => s.mobileMode);
  const setMobileMode = useDataStore((s) => s.setMobileMode);

  return (
    <Button
      color="primary"
      size="lg"
      variant="solid"
      onClick={() => {
        setMobileMode(nextMode[mobileMode] ?? 'gun');
      }}
    >
      {t('typography.switchSelectionTo', {
        value: t(`typography.${nextMode[mobileMode] ?? 'gun'}`),
      })}
    </Button>
  );
}
