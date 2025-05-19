import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ResumeSection =
  | "personal-details"
  | "professional-summary"
  | "employment-history"
  | "education"
  | "skills"
  | "languages"

interface ResumeStore {
  resumeId: string | null
  completedForms: Record<ResumeSection, boolean>
  isResumeGenerated: boolean
  isPaymentCompleted: boolean
  isSidebarVisible: boolean

  setResumeId: (id: string) => void
  setFormCompleted: (section: ResumeSection) => void
  resetForms: () => void
  isFormCompleted: (section: ResumeSection) => boolean
  areAllFormsCompleted: () => boolean
  setResumeGenerated: (status: boolean) => void
  setPaymentCompleted: (status: boolean) => void
  getResumeScore: () => number
  setSidebarVisibility: (isVisible: boolean) => void
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resumeId: null,
      completedForms: {
        "personal-details": false,
        "professional-summary": false,
        "employment-history": false,
        education: false,
        skills: false,
        languages: false,
      },
      isResumeGenerated: false,
      isPaymentCompleted: false,
      isSidebarVisible: true,

      setResumeId: (id) => set({ resumeId: id }),

      setFormCompleted: (section) =>
        set((state) => ({
          completedForms: {
            ...state.completedForms,
            [section]: true,
          },
        })),

      resetForms: () =>
        set({
          completedForms: {
            "personal-details": false,
            "professional-summary": false,
            "employment-history": false,
            education: false,
            skills: false,
            languages: false,
          },
          isResumeGenerated: false,
          isPaymentCompleted: false,
        }),

      isFormCompleted: (section) => get().completedForms[section],

      areAllFormsCompleted: () => {
        const { completedForms } = get()
        return Object.values(completedForms).every(Boolean)
      },

      setResumeGenerated: (status) => set({ isResumeGenerated: status }),

      setPaymentCompleted: (status) => set({ isPaymentCompleted: status }),

      getResumeScore: () => {
        const { completedForms, isResumeGenerated, isPaymentCompleted } = get()

        // Calculate form completion percentage (worth 60% of total score)
        const totalSections = Object.keys(completedForms).length
        const completedSections = Object.values(completedForms).filter(Boolean).length
        const formCompletionPercentage = totalSections > 0 ? (completedSections / totalSections) * 60 : 0

        // Add 20% if resume is generated
        const generationScore = isResumeGenerated ? 20 : 0

        // Add 20% if payment is completed
        const paymentScore = isPaymentCompleted ? 20 : 0

        // Calculate total score
        return Math.round(formCompletionPercentage + generationScore + paymentScore)
      },

      setSidebarVisibility: (isVisible) => set({ isSidebarVisible: isVisible }),
    }),
    {
      name: "resume-store",
    },
  ),
)
