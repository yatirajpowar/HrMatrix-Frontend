import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
//import { signup } from './services/user'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [buId, setBuId] = useState('')

  const navigate = useNavigate()

  const onSignup = async () => {
    if (name.length === 0 || email.length === 0 || password.length === 0) {
      alert('Please fill all required fields')
    } else {
      // Calling the service with HRMatrix specific fields
      const result = await signup(name, email, password, companyId, buId)
      if (result && result['status'] === 'success') {
        alert('Successfully registered employee')
        navigate('/login')
      } else {
        alert(result ? result['error'] : 'Registration failed')
      }
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>HRMatrix Registration</h2>
        <p style={styles.subtitle}>Create your employee account</p>

        <div style={styles.inputGroup}>
          <label>Full Name</label>
          <input 
            type="text" 
            onChange={(e) => setName(e.target.value)} 
            style={styles.input} 
            placeholder="Enter full name"
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Email</label>
          <input 
            type="email" 
            onChange={(e) => setEmail(e.target.value)} 
            style={styles.input} 
            placeholder="name@company.com"
          />
        </div>

        <div style={styles.row}>
          <div style={{...styles.inputGroup, flex: 1, marginRight: '10px'}}>
            <label>Company ID</label>
            <input 
              type="number" 
              onChange={(e) => setCompanyId(e.target.value)} 
              style={styles.input} 
            />
          </div>
          <div style={{...styles.inputGroup, flex: 1}}>
            <label>Business Unit ID</label>
            <input 
              type="number" 
              onChange={(e) => setBuId(e.target.value)} 
              style={styles.input} 
            />
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label>Password</label>
          <input 
            type="password" 
            onChange={(e) => setPassword(e.target.value)} 
            style={styles.input} 
          />
        </div>

        <button onClick={onSignup} style={styles.button}>Register</button>

        <div style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    width: '400px',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '10px'
  },
  subtitle: {
    textAlign: 'center',
    color: '#7f8c8d',
    marginBottom: '30px'
  },
  inputGroup: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    marginTop: '5px'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px'
  },
  footer: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '14px'
  },
  link: {
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: 'bold'
  }
}

export default Signup;