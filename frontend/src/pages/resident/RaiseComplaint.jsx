import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, PlusCircle, Pin, Upload, X } from 'lucide-react'
import DashboardShell from '../../components/DashboardShell'
import { FormField, TextInput, TextArea, SelectInput, PrimaryButton } from '../../components/FormElements'
import { complaintApi } from '../../api/resources'

const navItems = [
  { to: '/resident', label: 'My Complaints', icon: Home, end: true },
  { to: '/resident/raise', label: 'Raise Complaint', icon: PlusCircle },
  { to: '/resident/notices', label: 'Notice Board', icon: Pin },
]

const CATEGORIES = ['Plumbing', 'Electrical', 'Lift', 'Cleanliness', 'Security', 'Parking', 'Other']

export default function RaiseComplaint() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({ title: '', description: '', category: CATEGORIES[0] })
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handlePhotoSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  function clearPhoto() {
    setPhoto(null)
    setPhotoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('category', form.category)
      if (photo) fd.append('photo', photo)

      const res = await complaintApi.create(fd)
      navigate(`/resident/complaints/${res.data.complaint.id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong raising the complaint')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardShell navItems={navItems}>
      <span className="stamp text-rust text-xs tracking-[0.2em] uppercase">New complaint</span>
      <h1 className="font-display text-[32px] text-verandah mt-1 mb-8">Raise a complaint</h1>

      <form onSubmit={handleSubmit} className="max-w-xl">
        <FormField label="Category">
          <SelectInput value={form.category} onChange={(e) => update('category', e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </SelectInput>
        </FormField>

        <FormField label="Title">
          <TextInput
            required
            placeholder="e.g. Lift B making grinding noise"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
          />
        </FormField>

        <FormField label="Description">
          <TextArea
            required
            rows={5}
            placeholder="Describe the issue in a bit more detail — when it started, how often it happens, anything that would help the admin understand it."
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </FormField>

        <FormField label="Photo (optional)">
          {!photoPreview ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border border-dashed border-ink/25 py-8 flex flex-col items-center gap-2 text-ink-soft hover:border-rust hover:text-rust transition-colors duration-200"
            >
              <Upload size={20} />
              <span className="text-[14px]">Click to attach a photo</span>
              <span className="text-[12px] text-ink-soft/60">JPG, PNG, or WEBP — up to 5MB</span>
            </button>
          ) : (
            <div className="relative inline-block">
              <img src={photoPreview} alt="Preview" className="w-40 h-40 object-cover border border-ink/15" />
              <button
                type="button"
                onClick={clearPhoto}
                className="absolute -top-2 -right-2 bg-rust text-paper rounded-full p-1 hover:bg-rust-dark transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoSelect}
            className="hidden"
          />
        </FormField>

        {error && <p className="text-rust text-[13.5px] mb-4">{error}</p>}

        <PrimaryButton type="submit" loading={loading} className="max-w-xs">
          Submit complaint
        </PrimaryButton>
      </form>
    </DashboardShell>
  )
}
