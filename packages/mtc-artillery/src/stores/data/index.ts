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

interface AdjustmentData {
  /** Aim offset from the target carried over from previous rounds */
  offset: Vector;
  /** Where the latest round landed */
  impact: Vector | null;
}

const emptyAdjustment: AdjustmentData = {
  offset: { x: 0, y: 0 },
  impact: null,
};

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

  adjustment: AdjustmentData;
  /** Point to fire at, the target corrected by the observed impacts */
  getAim: () => Vector;
  setImpact: (x: number, y: number) => void;
  /** Keep the current correction and prepare for the next observed impact */
  nextRound: () => void;
  resetAdjustment: () => void;

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
          s.adjustment = emptyAdjustment;
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
          s.adjustment = emptyAdjustment;
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
          s.adjustment = emptyAdjustment;
        });
      },

      adjustment: emptyAdjustment,
      getAim() {
        const target = this.getTarget();
        const { offset, impact } = this.adjustment;

        // aim the opposite way of the miss
        const missX = impact ? impact.x - target.x : 0;
        const missY = impact ? impact.y - target.y : 0;

        return {
          x: target.x + offset.x - missX,
          y: target.y + offset.y - missY,
        };
      },
      setImpact(x, y) {
        set((s) => {
          s.adjustment.impact = { x, y };
        });
      },
      nextRound() {
        set((s) => {
          const aim = s.getAim();
          const target = s.getTarget();

          s.adjustment = {
            offset: { x: aim.x - target.x, y: aim.y - target.y },
            impact: null,
          };
        });
      },
      resetAdjustment() {
        set((s) => {
          s.adjustment = emptyAdjustment;
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
