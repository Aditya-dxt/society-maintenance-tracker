import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AuthShell from '../../components/AuthShell'
import { FormField, TextInput, PrimaryButton } from '../../components/FormElements'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
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
      const user = await login(form)
      navigate(user.role === 'ADMIN' ? '/admin' : '/resident')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to Aangan"
      footer={
        <>
          New here?{' '}
          <Link to="/signup/resident" className="text-verandah font-medium hover:text-rust transition-colors">
            Join as resident
          </Link>{' '}
          ·{' '}
          <Link to="/signup/admin" className="text-verandah font-medium hover:text-rust transition-colors">
            Set up a society
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <FormField label="Email">
          <TextInput
            required
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            autoFocus
          />
        </FormField>

        <FormField label="Password">
          <TextInput
            required
            type="password"
            placeholder="Your password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
          />
        </FormField>

        {error && <p className="text-rust text-[13.5px] mb-4">{error}</p>}

        <PrimaryButton type="submit" loading={loading}>
          Log in
        </PrimaryButton>
      </form>
    </AuthShell>
  )
}
