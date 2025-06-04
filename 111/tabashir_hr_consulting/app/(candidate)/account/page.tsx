"use client"

import { useState, useEffect } from "react"
import { Pencil, Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getUserProfile, updateUserProfile } from "./actions"
import { toast } from "sonner"

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
]

const EXPERIENCE_OPTIONS = [
  { value: "0-1", label: "0-1 years" },
  { value: "1-3", label: "1-3 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "5-10", label: "5-10 years" },
  { value: "10+", label: "10+ years" },
]

const EDUCATION_OPTIONS = [
  { value: "high_school", label: "High School" },
  { value: "bachelors", label: "Bachelor's Degree" },
  { value: "masters", label: "Master's Degree" },
  { value: "phd", label: "PhD" },
  { value: "other", label: "Other" },
]

export default function AccountPage() {
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserProfile()
        setUserData(data)
        setSkills(data.candidate?.profile?.skills || [])
      } catch (error) {
        console.error('Error fetching user data:', error)
        toast.error("Failed to load user data")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const startEditing = (field: string, value: string) => {
    setEditingField(field)
    setEditValue(value)
  }

  const cancelEditing = () => {
    setEditingField(null)
    setEditValue("")
  }

  const saveEdit = async (field: string) => {
    try {
      const updateData: any = {}
      updateData[field] = editValue

      await updateUserProfile(updateData)

      // Update local state
      if (field === 'name' || field === 'image') {
        setUserData((prev: any) => ({
          ...prev,
          [field]: editValue
        }))
      } else {
        setUserData((prev: any) => ({
          ...prev,
          candidate: {
            ...prev.candidate,
            profile: {
              ...prev.candidate?.profile,
              [field]: editValue
            }
          }
        }))
      }

      toast.success("Profile updated successfully")
      setEditingField(null)
      setEditValue("")
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error("Failed to update profile")
    }
  }

  const handleSelectChange = async (field: string, value: string) => {
    try {
      const updateData: any = {}
      updateData[field] = value

      await updateUserProfile(updateData)

      setUserData((prev: any) => ({
        ...prev,
        candidate: {
          ...prev.candidate,
          profile: {
            ...prev.candidate?.profile,
            [field]: value
          }
        }
      }))

      toast.success("Profile updated successfully")
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error("Failed to update profile")
    }
  }

  const addSkill = async () => {
    if (newSkill.trim() !== "" && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()]
      try {
        await updateUserProfile({ skills: updatedSkills })
        setSkills(updatedSkills)
        setNewSkill("")
        toast.success("Skill added successfully")
      } catch (error) {
        console.error('Error adding skill:', error)
        toast.error("Failed to add skill")
      }
    }
  }

  const removeSkill = async (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove)
    try {
      await updateUserProfile({ skills: updatedSkills })
      setSkills(updatedSkills)
      toast.success("Skill removed successfully")
    } catch (error) {
      console.error('Error removing skill:', error)
      toast.error("Failed to remove skill")
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (!userData) {
    return <div className="p-6">User data not found</div>
  }

  const renderEditableField = (field: string, value: string, label: string) => (
    <div className="grid grid-cols-1 gap-4 items-center">
      <label className="text-black font-medium">{label}</label>
      <div className="col-span-3">
        {editingField === field ? (
          <div className="flex items-center gap-2">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1"
            />
            <button
              onClick={() => saveEdit(field)}
              className="text-green-600 hover:text-green-700"
            >
              <Check size={16} />
            </button>
            <button
              onClick={cancelEditing}
              className="text-red-600 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center border rounded-md p-2">
            <span className="flex-1 text-gray-900">{value || 'Not set'}</span>
            <button
              onClick={() => startEditing(field, value)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Pencil size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )

  const renderSelectField = (field: string, value: string, label: string, options: { value: string; label: string }[]) => (
    <div className="grid grid-cols-1 gap-4 items-center">
      <label className="text-black font-medium">{label}</label>
      <div className="col-span-3">
        <Select
          value={value || ""}
          onValueChange={(value) => handleSelectChange(field, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  return (
    <div className="flex-1 p-6 text-gray-900 max-h-[calc(100vh-35px)] rounded-lg overflow-y-scroll">
      <div className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Personal Information</h2>
          </CardHeader>
          <CardContent className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {renderEditableField('name', userData.name, 'Username')}
              {renderSelectField('gender', userData.candidate?.profile?.gender, 'Gender', GENDER_OPTIONS)}

              <div className="grid grid-cols-1 gap-4 items-center">
                <label className="text-black font-medium">Profile Picture</label>
                <div className="col-span-3">
                  <div className="flex items-center border rounded-md p-2">
                    <span className="flex-1 text-gray-900">Profile Picture</span>
                    {userData.image ? (
                      <img src={userData.image} alt="Profile" className="h-6 w-6 rounded-full object-cover" />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-gray-300"></div>
                    )}
                    <button
                      onClick={() => startEditing('image', userData.image || '')}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Account Information</h2>
          </CardHeader>
          <CardContent className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {renderEditableField('email', userData.email, 'Email')}
              {renderEditableField('phone', userData.candidate?.profile?.phone, 'Phone')}
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Professional Information</h2>
          </CardHeader>
          <CardContent className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {renderEditableField('jobType', userData.candidate?.profile?.jobType, 'Title')}

              <div className="grid grid-cols-1 gap-4 items-start">
                <label className="text-gray-700 pt-2">Your top skills and tools</label>
                <div className="col-span-3">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <Badge
                          key={index}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md py-1 px-3 cursor-pointer"
                          onClick={() => removeSkill(skill)}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add new skill"
                        className="w-40"
                      />
                      <button
                        onClick={addSkill}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {renderSelectField('experience', userData.candidate?.profile?.experience, 'How much work experience do you have?', EXPERIENCE_OPTIONS)}
              {renderSelectField('education', userData.candidate?.profile?.education, 'Education', EDUCATION_OPTIONS)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
