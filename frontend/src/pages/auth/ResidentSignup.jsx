import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AuthShell from '../../components/AuthShell'
import { FormField, TextInput, PrimaryButton } from '../../components/FormElements'

export default function ResidentSignup() {
  const { residentSignup } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ joinCode: '', name: '', flatNumber: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await residentSignup(form)
      navigate('/resident')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="For residents"
      title="Join your society"
      subtitle="Ask your admin for the society code if you don't have it."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-verandah font-medium hover:text-rust transition-colors">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <FormField label="Society code">
          <TextInput
            required
            placeholder="e.g. PLM-7K2X"
            value={form.joinCode}
            onChange={(e) => update('joinCode', e.target.value.toUpperCase())}
            className="stamp tracking-widest"
          />
        </FormField>

        <FormField label="Your name">
          <TextInput
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
          />
        </FormField>

        <FormField label="Flat number">
          <TextInput
            required
            placeholder="e.g. B-204"
            value={form.flatNumber}
            onChange={(e) => update('flatNumber', e.target.value)}
          />
        </FormField>

        <FormField label="Email">
          <TextInput
            required
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </FormField>

        <FormField label="Password">
          <TextInput
            required
            type="password"
            minLength={8}
            placeholder="At least 8 characters"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
          />
        </FormField>

        {error && <p className="text-rust text-[13.5px] mb-4">{error}</p>}

        <PrimaryButton type="submit" loading={loading}>
          Join society
        </PrimaryButton>
      </form>

      <p className="text-center text-[13.5px] text-ink-soft mt-5">
        Setting up a new society instead?{' '}
        <Link to="/signup/admin" className="text-verandah font-medium hover:text-rust transition-colors">
          Sign up as an admin
        </Link>
      </p>
    </AuthShell>
  )
}
