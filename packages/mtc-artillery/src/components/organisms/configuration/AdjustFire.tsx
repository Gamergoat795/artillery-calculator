import todec from '2dec';
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

  const target = useDataStore(useShallow((s) => s.getTarget()));
  const correction = useDataStore((s) => s.correction);
  const undoCorrection = useDataStore((s) => s.undoCorrection);

  if (!correction) return null;

  const { previousGun, impact } = correction;

  // the round was fired along the line from where the gun was placed
  const [range, deflection] = calculateMissComponents(
    previousGun.x,
    previousGun.y,
    target.x,
    target.y,
    impact.x,
    impact.y,
  ).map((value) => studsToMeters(value * map.size));

  const undoButton = (
    <Button color="neutral" size="sm" variant="soft" onClick={undoCorrection}>
      {t('typography.adjustFire.undo')}
    </Button>
  );

  const miss = (
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
  );

  if (minimized)
    return (
      <>
        <RowContainer>{miss}</RowContainer>

        <RowContainer>
          <Typography level="body-sm">
            {t('typography.adjustFire.corrected')}
          </Typography>

          {undoButton}
        </RowContainer>
      </>
    );

  return (
    <>
      <DataContainer>
        <Typography level="title-md">
          {t('typography.adjustFire.title')}
        </Typography>

        {undoButton}
      </DataContainer>

      {miss}

      <DataContainer>
        <Typography level="body-sm">
          {t('typography.adjustFire.corrected')}
        </Typography>
      </DataContainer>
    </>
  );
}
