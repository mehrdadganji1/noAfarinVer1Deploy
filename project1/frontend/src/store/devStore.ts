import { create } from 'zustand'
import { UserRole } from '@/types/roles'

interface DevState {
  overrideRole: UserRole | null
  setOverrideRole: (role: UserRole | null) => void
  clearOverride: () => void
}

/**
 * Dev Store - فقط برای توسعه
 * این store اجازه میده Admin نقش موقت انتخاب کنه
 */
export const useDevStore = create<DevState>((set) => ({
  overrideRole: null,
  setOverrideRole: (role) => set({ overrideRole: role }),
  clearOverride: () => set({ overrideRole: null }),
}))
