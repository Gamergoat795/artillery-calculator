import todec from '2dec';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useShallow } from 'zustand/shallow';

import DataContainer from '@/components/atoms/DataContainer';
import useGameMap from '@/hooks/data/useGameMap';
import { useDataStore } from '@/stores/data';
import { calculateMissComponents, studsToMeters } from '@/utils/math';
import RowContainer from '@tauri/atoms/RowContainer';

export default function AdjustFire({
  minimized = false,
}: {
  minimized?: boolean;
}) {
  const t = useTranslations();

  const map = useGameMap();

  const gun = useDataStore(useShallow((s) => s.getGun()));
  const target = useDataStore(useShallow((s) => s.getTarget()));
  const { offset, impact } = useDataStore((s) => s.adjustment);
  const nextRound = useDataStore((s) => s.nextRound);
  const resetAdjustment = useDataStore((s) => s.resetAdjustment);

  const hasOffset = offset.x !== 0 || offset.y !== 0;
  if (!impact && !hasOffset) return null;

  let range = 0;
  let deflection = 0;
  if (impact)
    [range, deflection] = calculateMissComponents(
      gun.x,
      gun.y,
      target.x,
      target.y,
      impact.x,
      impact.y,
    ).map((value) => studsToMeters(value * map.size));

  const buttons = (
    <>
      <Button disabled={!impact} size="sm" variant="soft" onClick={nextRound}>
        {t('typography.adjustFire.nextRound')}
      </Button>

      <Button
        color="neutral"
        size="sm"
        variant="soft"
        onClick={resetAdjustment}
      >
        {t('typography.adjustFire.reset')}
      </Button>
    </>
  );

  const miss = impact ? (
    <>
      <DataContainer>
        <Typography level="title-md">
          {t('typography.adjustFire.range')}
        </Typography>

        <Typography>
          {t('units.meter', { value: todec(Math.abs(range)) })}{' '}
          {t(`typography.adjustFire.${range > 0 ? 'long' : 'short'}`)}
        </Typography>
      </DataContainer>

      <DataContainer>
        <Typography level="title-md">
          {t('typography.adjustFire.deflection')}
        </Typography>

        <Typography>
          {t('units.meter', { value: todec(Math.abs(deflection)) })}{' '}
          {t(`typography.adjustFire.${deflection > 0 ? 'right' : 'left'}`)}
        </Typography>
      </DataContainer>
    </>
  ) : (
    <DataContainer>
      <Typography level="body-sm">
        {t('typography.adjustFire.corrected')}
      </Typography>
    </DataContainer>
  );

  if (minimized)
    return (
      <>
        {impact ? <RowContainer>{miss}</RowContainer> : miss}

        <RowContainer>{buttons}</RowContainer>
      </>
    );

  return (
    <>
      <DataContainer>
        <Typography level="title-md">
          {t('typography.adjustFire.title')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>{buttons}</Box>
      </DataContainer>

      {miss}
    </>
  );
}
