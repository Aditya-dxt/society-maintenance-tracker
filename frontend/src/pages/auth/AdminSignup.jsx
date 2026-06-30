import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import AuthShell from '../../components/AuthShell'
import { FormField, TextInput, PrimaryButton } from '../../components/FormElements'

export default function AdminSignup() {
  const { adminSignup } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ societyName: '', address: '', name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [createdCode, setCreatedCode] = useState(null)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await adminSignup(form)
      setCreatedCode(user.society.joinCode)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (createdCode) {
    return (
      <AuthShell eyebrow="Society created" title="Your society is live">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-card border border-ink/10 p-6 text-center"
        >
          <p className="text-[14px] text-ink-soft mb-3">Share this code with your residents so they can join:</p>
          <p className="stamp text-[28px] text-rust tracking-[0.15em]">{createdCode}</p>
        </motion.div>
        <p className="text-[13.5px] text-ink-soft mt-5 leading-relaxed">
          You can find this code again anytime in Settings, and regenerate it if needed.
        </p>
        <PrimaryButton onClick={() => navigate('/admin')} className="mt-6">
          Go to dashboard
        </PrimaryButton>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      eyebrow="For admins"
      title="Set up your society"
      subtitle="You'll get a unique code to share with residents once you're done."
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
        <FormField label="Society name">
          <TextInput
            required
            placeholder="e.g. Palm Residency"
            value={form.societyName}
            onChange={(e) => update('societyName', e.target.value)}
          />
        </FormField>

        <FormField label="Address (optional)">
          <TextInput
            placeholder="e.g. Sector 12, Kanpur"
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
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
          Create society
        </PrimaryButton>
      </form>

      <p className="text-center text-[13.5px] text-ink-soft mt-5">
        Joining an existing society instead?{' '}
        <Link to="/signup/resident" className="text-verandah font-medium hover:text-rust transition-colors">
          Sign up as a resident
        </Link>
      </p>
    </AuthShell>
  )
}
