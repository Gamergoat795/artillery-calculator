import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { guns } from '@/config/guns';
import { defaultMapId } from '@/config/maps';

import type { MobileModes } from '@/components/organisms/configuration/MobileMode';
import type { Vector } from '@/components/templates/Canvas';
import type { MapId } from '@/config/maps';

interface ProjectileData {
  gunKey: string;
  index: number;
}

interface StringVector {
  x: string;
  y: string;
}

interface CorrectionData {
  /** Gun position before the latest correction */
  previousGun: Vector;
  /** Where the latest round landed */
  impact: Vector;
}

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

export interface DataStore {
  mapId: MapId;
  setMapId: (mapId: MapId) => void;

  projectile: ProjectileData;
  setProjectile: (gun: string, index: number) => void;

  target: StringVector;
  getTarget: () => Vector;
  setTarget: (x: number, y: number) => void;

  gun: StringVector;
  getGun: () => Vector;
  setGun: (x: number, y: number) => void;

  correction: CorrectionData | null;
  /**
   * Corrects the gun position using where a round landed,
   * assuming the round was fired with the firing data shown for the current target
   */
  markImpact: (x: number, y: number) => void;
  undoCorrection: () => void;

  mobileMode: MobileModes;
  setMobileMode: (mode: MobileModes) => void;
}

export const useDataStore = create(
  persist(
    immer<DataStore>((set) => ({
      mapId: defaultMapId,
      setMapId(mapId) {
        set((s) => {
          s.mapId = mapId;
          s.correction = null;
        });
      },

      projectile: {
        gunKey: Object.keys(guns)[0],
        index: 0,
      },
      setProjectile(gun, index) {
        set((s) => {
          s.projectile = {
            gunKey: gun,
            index,
          };
        });
      },

      target: { x: '0.75', y: '0.5' },
      getTarget() {
        return {
          x: Number(this.target.x),
          y: Number(this.target.y),
        };
      },
      setTarget(x, y) {
        set((s) => {
          s.target = {
            x: String(x),
            y: String(y),
          };
          s.correction = null;
        });
      },

      gun: { x: '0.25', y: '0.5' },
      getGun() {
        return {
          x: Number(this.gun.x),
          y: Number(this.gun.y),
        };
      },
      setGun(x, y) {
        set((s) => {
          s.gun = {
            x: String(x),
            y: String(y),
          };
          s.correction = null;
        });
      },

      correction: null,
      markImpact(x, y) {
        set((s) => {
          const gun = s.getGun();
          const target = s.getTarget();

          // the round flew the computed distance and direction from where the gun really is,
          // so the gun is off by as much as the round missed the target
          s.gun = {
            x: String(clamp(gun.x + (x - target.x))),
            y: String(clamp(gun.y + (y - target.y))),
          };
          s.correction = {
            previousGun: gun,
            impact: { x, y },
          };
        });
      },
      undoCorrection() {
        set((s) => {
          if (!s.correction) return;

          s.gun = {
            x: String(s.correction.previousGun.x),
            y: String(s.correction.previousGun.y),
          };
          s.correction = null;
        });
      },

      mobileMode: 'gun',
      setMobileMode(mode) {
        set((s) => {
          s.mobileMode = mode;
        });
      },
    })),
    {
      name: 'data',
      version: 2,

      migrate(persistedState, version) {
        if (version === 0) {
          // @ts-expect-error ignore
          persistedState.mapId = defaultMapId;
        }

        if (version === 1) {
          persistedState = {};
        }

        return persistedState;
      },
    },
  ),
);
