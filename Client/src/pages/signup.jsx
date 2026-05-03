import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Signup() {
  const navigate = useNavigate()

  const handleFromSubmit = async (e) => {
    e.preventDefault()


    const email = e.target.email.value
    const username = e.target.username.value
    const password = e.target.password.value

    try {
      const response = await axios.post('https://ecommerce-backend-main-1.onrender.com/api/users/signup', {
        email,
        username,
        password
      })
      alert(response.data.message)

      localStorage.setItem('token', response.data.token)
      navigate('/')

      // console.log(response.data)
    } catch (error) {
      console.error('Error signing up:', error)
    }
  }

  return (
    <main className='relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-white'>

      <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.6),transparent_34%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.6),transparent_28%),linear-gradient(135deg,#020617_0%,#0f172a_55%,#111827_100%)]' />

      <div className='absolute left-10 top-10 h-40 w-40 rounded-full bg-cyan-400/60 blur-3xl' />

      <div className='absolute bottom-10 right-10 h-56 w-56 rounded-full bg-fuchsia-500/60 blur-3xl' />

      <section className='relative w-full max-w-6xl min-h-full overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl shadow-cyan-950/40 backdrop-blur-2xl p-5 sm:p-6 lg:p-10' >

        <div className='grid lg:grid-cols-[1.05fr_0.95fr] gap-2 '>

          <div className='flex flex-col justify-between border-b border-white/10 px-10 py-20 sm:px-12 lg:border-b-0 lg:border-r '>

            <div>
              <span className='inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-medium tracking-[0.2em] text-cyan-100 uppercase'>
                Join the store
              </span>
              <h1 className='mt-6 max-w-md text-4xl font-semibold tracking-tight text-white sm:text-5xl'>
                Create your account in a polished, secure space.
              </h1>
              <p className='mt-4 max-w-lg text-sm leading-6 text-slate-300 sm:text-base'>
                Sign up to save favorites, track orders, and get a cleaner shopping experience across every device.
              </p>
            </div>

            <div className='mt-10 grid gap-4 sm:grid-cols-3'>
              <div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
                <p className='text-2xl font-semibold text-white'>24/7</p>
                <p className='mt-1 text-xs uppercase tracking-[0.2em] text-slate-400'>Access</p>
              </div>
              <div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
                <p className='text-2xl font-semibold text-white'>Fast</p>
                <p className='mt-1 text-xs uppercase tracking-[0.2em] text-slate-400'>Checkout</p>
              </div>
              <div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
                <p className='text-2xl font-semibold text-white'>Safe</p>
                <p className='mt-1 text-xs uppercase tracking-[0.2em] text-slate-400'>Account</p>
              </div>
            </div>
          </div>

          <div className='px-8 py-10 sm:px-12'>
            <div className='mb-8'>
              <h2 className='text-2xl font-semibold text-white'>Sign up</h2>
              <p className='mt-2 text-sm text-slate-300'>
                Enter your details to get started.
              </p>
            </div>

            <form className='space-y-5' onSubmit={handleFromSubmit}>
              <div>
                <label htmlFor='email' className='mb-2 block text-sm font-medium text-slate-200'>
                  Email
                </label>
                <input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='you@example.com'
                  className='w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-300/60 focus:bg-white/15 focus:ring-4 focus:ring-cyan-400/10'
                />
              </div>

              <div>
                <label htmlFor='username' className='mb-2 block text-sm font-medium text-slate-200'>
                  Username
                </label>
                <input
                  id='username'
                  name='username'
                  type='text'
                  placeholder='yourname'
                  className='w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-300/60 focus:bg-white/15 focus:ring-4 focus:ring-cyan-400/10'
                />
              </div>

              <div>
                <label htmlFor='password' className='mb-2 block text-sm font-medium text-slate-200'>
                  Password
                </label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  placeholder='Create a strong password'
                  className='w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-300/60 focus:bg-white/15 focus:ring-4 focus:ring-cyan-400/10'
                />
              </div>

              <button
                type='submit'
                className='mt-2 w-full rounded-2xl bg-linear-to-r from-cyan-400 via-sky-400 to-indigo-500 px-4 py-3.5 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-cyan-300/30'
              >
                Create account
              </button>
            </form>

            <p className='mt-6 text-center text-sm text-slate-300'>
              Already have an account?{' '}
              <a href='/login' className='font-medium text-cyan-200 transition hover:text-white'>
                Log in
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>



  )
}

export default Signup