import { useShallow } from 'zustand/shallow';

import { useDataStore } from '@/stores/data';
import { calculateAzimuth } from '@/utils/math';

export default function useAzimuth(): number {
  const gun = useDataStore(useShallow((s) => s.getGun()));
  const target = useDataStore(useShallow((s) => s.getAim()));

  const azimuth = calculateAzimuth(gun.x, gun.y, target.x, target.y);

  return azimuth;
}
